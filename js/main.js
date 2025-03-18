function loadTab(tabName) {
    console.log("DEBUG: loadTab() called with tab:", tabName);
  
    const path = localStorage.getItem('activeCharacter');
    if (!path) {
      console.warn("DEBUG: No activeCharacter path in localStorage.");
      document.getElementById('tab-content').innerHTML = '<p class="text-warning">No character selected.</p>';
      return;
    }
  
    fetch(`characters/${path}`)
      .then(res => res.json())
      .then(charData => {
        const loadTemplate = () => {
          if (typeof Templates?.[tabName] === 'function') {
            console.log("DEBUG: Executing template function for", tabName);
            const content = Templates[tabName](charData);
            document.getElementById('tab-content').innerHTML = content;
          } else {
            console.warn(`DEBUG: Template function Templates.${tabName} is not defined.`);
            document.getElementById('tab-content').innerHTML = `<p class="text-warning">Template for "${tabName}" not available.</p>`;
          }
        };
  
        if (typeof Templates?.[tabName] === 'function') {
          loadTemplate();
        } else {
          fetch(`js/templates/${tabName}.js`)
            .then(res => res.text())
            .then(code => {
              console.log("DEBUG: Loaded template script, evaluating...");
              eval(code);
              loadTemplate();
            })
            .catch(err => {
              console.error(`DEBUG: Failed to load tab template:`, err);
              document.getElementById('tab-content').innerHTML = `<p class="text-danger">Error loading tab content.</p>`;
            });
        }
      })
      .catch(err => {
        console.error(`DEBUG: Failed to load character data for ${path}:`, err);
        document.getElementById('tab-content').innerHTML = `<p class="text-danger">Error loading character data.</p>`;
      });
  }
  
  function logout() {
    console.log("DEBUG: logout() called");
    localStorage.removeItem('userRole');
    localStorage.removeItem('activeCharacter');
    location.href = 'login.html';
  }
  
  async function showCharacterSelector() {
    console.log("DEBUG: showCharacterSelector() called");
  
    const characterList = document.getElementById('character-list');
    console.log("DEBUG: characterList element:", characterList);
    if (!characterList) {
      console.log("DEBUG: characterList element NOT found, exiting");
      return;
    }
  
    characterList.innerHTML = '';
    console.log("DEBUG: Cleared character list.");
  
    const currentUser = localStorage.getItem('userRole');
    console.log("DEBUG: currentUser retrieved:", currentUser);
  
    try {
      if (currentUser === 'Master') {
        const playersRes = await fetch('characters/players.json');
        console.log('DEBUG: players.json status:', playersRes.status);
        const players = await playersRes.json();
        console.log('DEBUG: players loaded:', players);
  
        for (const player of players) {
          const response = await fetch(`characters/${player}/index.json`);
          console.log(`DEBUG: ${player}/index.json status:`, response.status);
          const charFiles = await response.json();
          console.log(`DEBUG: Character files for ${player}:`, charFiles);
  
          for (const file of charFiles) {
            try {
              const charDataRes = await fetch(`characters/${player}/${file}`);
              console.log(`DEBUG: ${player}/${file} status:`, charDataRes.status);
              const charData = await charDataRes.json();
              console.log(`DEBUG: Loaded character:`, charData.name);
  
              const listItem = document.createElement('li');
              listItem.className = 'list-group-item list-group-item-action';
              listItem.textContent = `${player}: ${charData.name}`;
              listItem.style.cursor = 'pointer';
              listItem.onclick = () => {
                setActiveCharacter(`${player}/${file}`);
              };
              characterList.appendChild(listItem);
              console.log(`DEBUG: Appended ${charData.name} to list.`);
            } catch (err) {
              console.error(`DEBUG: Skipping invalid character file ${player}/${file}:`, err);
            }
          }
        }
  
      } else {
        const response = await fetch(`characters/${currentUser}/index.json`);
        console.log(`${currentUser}/index.json status:`, response.status);
        const charFiles = await response.json();
        console.log(`DEBUG: Character files:`, charFiles);
  
        for (const file of charFiles) {
          try {
            const charDataRes = await fetch(`characters/${currentUser}/${file}`);
            console.log(`${currentUser}/${file} status:`, charDataRes.status);
            const charData = await charDataRes.json();
            console.log(`DEBUG: Loaded character:`, charData.name);
  
            const listItem = document.createElement('li');
            listItem.className = 'list-group-item list-group-item-action';
            listItem.textContent = charData.name;
            listItem.style.cursor = 'pointer';
            listItem.onclick = () => {
              setActiveCharacter(`${currentUser}/${file}`);
            };
            characterList.appendChild(listItem);
            console.log(`DEBUG: Appended ${charData.name} to list.`);
          } catch (err) {
            console.error(`DEBUG: Skipping invalid character file ${currentUser}/${file}:`, err);
          }
        }
      }
  
      console.log("DEBUG: Finished building character list. Attempting modal...");
      const modalEl = document.getElementById('characterSelectModal');
      if (modalEl) {
        const modal = bootstrap.Modal.getOrCreateInstance(modalEl);
        modal.show();
        console.log("DEBUG: modal.show() executed successfully via direct instance.");
      } else {
        console.log("DEBUG: Modal element not found.");
      }
    } catch (error) {
      console.error("DEBUG: Exception occurred in showCharacterSelector:", error);
      characterList.innerHTML = '<li class="list-group-item text-danger">Error loading characters.</li>';
    }
  }
  
  function setActiveCharacter(path) {
    console.log("DEBUG: setActiveCharacter() called with path:", path);
    localStorage.setItem('activeCharacter', path);
  
    const modalEl = document.getElementById('characterSelectModal');
    if (modalEl) {
      const modal = bootstrap.Modal.getOrCreateInstance(modalEl);
      modal.hide();
      console.log("DEBUG: modal.hide() called after character select.");
    }
  
    loadTab('stats');
  }
  
  // Ensure global access for inline event handlers
  window.loadTab = loadTab;
  window.logout = logout;
  window.showCharacterSelector = showCharacterSelector;
  window.setActiveCharacter = setActiveCharacter;