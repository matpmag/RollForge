// Loads a specific tab (e.g., Stats, Inventory) and populates its content.
function loadTab(tabName) {
    console.debug("[RollForge] Loading tab:", tabName);
  
    // Retrieve the path to the currently active character from local storage.
    const path = localStorage.getItem('activeCharacter');
    
    // If no character is selected, show a warning and stop execution.
    if (!path) {
        document.getElementById('tab-content').innerHTML = '<p class="text-warning">No character selected.</p>';
        return;
    }
  
    // Fetch the character data JSON file.
    fetch(`characters/${path}`)
        .then(res => res.json())
        .then(charData => {
            // First populate the main profile details.
            populateProfile(charData);
  
            // Function to load the tab content dynamically.
            const loadTemplate = () => {
                if (typeof Templates?.[tabName] === 'function') {
                    document.getElementById('tab-content').innerHTML = Templates[tabName](charData);
                } else {
                    document.getElementById('tab-content').innerHTML = `<p class="text-warning">Template for "${tabName}" not available.</p>`;
                }
            };
  
            // If the template function already exists, load it directly.
            if (typeof Templates?.[tabName] === 'function') {
                loadTemplate();
            } else {
                // Otherwise, fetch the JS template file dynamically.
                fetch(`js/templates/${tabName}.js`)
                    .then(res => res.text())
                    .then(code => {
                        eval(code); // Evaluate the fetched JS to define the template function.
                        loadTemplate(); // Then load the template content.
                    })
                    .catch(err => {
                        document.getElementById('tab-content').innerHTML = `<p class="text-danger">Error loading tab content.</p>`;
                    });
            }
        })
        .catch(err => {
            document.getElementById('tab-content').innerHTML = `<p class="text-danger">Error loading character data.</p>`;
        });
}

// Populates the profile section with character details from JSON data.
function populateProfile(charData) {
    const currentUser = localStorage.getItem('userRole');
    const currentCharPath = localStorage.getItem('activeCharacter');
    const playerName = currentCharPath ? currentCharPath.split('/')[0] : '';
  
    // Show player name and character name if Dungeon Master, otherwise just character name
    document.getElementById('current-character').textContent =
      currentUser === 'Master' ? `${playerName}: ${charData.name}` : charData.name;
  
    document.getElementById('character-name').textContent = charData.name;
    document.getElementById('armour-class').textContent = charData.ac ?? '—';
    document.getElementById('initiative').textContent = charData.initiative ?? '—';
    document.getElementById('hit-points').textContent = charData.hp ? `${charData.hp.current}/${charData.hp.max}` : '—/—';
    document.getElementById('conditions').textContent = charData.conditions?.join(', ') || 'None';
    document.getElementById('inspiration').textContent = charData.inspiration ? 'Yes' : 'No';
  
    const profilePic = document.getElementById('profile-pic');
    profilePic.src = charData.profilePic || 'default-pic.png';
    profilePic.alt = `${charData.name}'s Profile`;
  
    // Make the content visible after selecting character
    document.getElementById('character-content').classList.remove('d-none');
  
    // Ensure the stats tab shows correctly populated content
    if (typeof Templates?.stats === 'function') {
      document.getElementById('stats').innerHTML = Templates.stats(charData);
    }
  }

// Handles user logout by clearing local storage and redirecting to login page.
function logout() {
    console.debug("[RollForge] User initiated logout.");
    localStorage.removeItem('userRole');
    localStorage.removeItem('activeCharacter');
    location.href = 'login.html';
}

// Opens the character selection interface/modal for choosing a character.
async function showCharacterSelector() {
    console.debug("[RollForge] Opening character selection.");

    const characterList = document.getElementById('character-list');
    if (!characterList) {
        console.debug("[RollForge] No character list found, exiting character selection.");
        return;
    }

    characterList.innerHTML = '';

    const currentUser = localStorage.getItem('userRole');

    try {
        if (currentUser === 'Master') {
            const playersRes = await fetch('characters/players.json');
            const players = await playersRes.json();

            for (const player of players) {
                const response = await fetch(`characters/${player}/index.json`);
                const charFiles = await response.json();

                for (const file of charFiles) {
                    try {
                        const charDataRes = await fetch(`characters/${player}/${file}`);
                        const charData = await charDataRes.json();

                        const listItem = document.createElement('li');
                        listItem.className = 'list-group-item list-group-item-action';
                        listItem.textContent = `${player}: ${charData.name}`;
                        listItem.style.cursor = 'pointer';
                        listItem.onclick = () => {
                            setActiveCharacter(`${player}/${file}`);
                        };
                        characterList.appendChild(listItem);
                    } catch (err) {
                        console.error(`[RollForge] Skipping invalid character file ${player}/${file}:`, err);
                    }
                }
            }

        } else {
            const response = await fetch(`characters/${currentUser}/index.json`);
            const charFiles = await response.json();

            for (const file of charFiles) {
                try {
                    const charDataRes = await fetch(`characters/${currentUser}/${file}`);
                    const charData = await charDataRes.json();

                    const listItem = document.createElement('li');
                    listItem.className = 'list-group-item list-group-item-action';
                    listItem.textContent = charData.name;
                    listItem.style.cursor = 'pointer';
                    listItem.onclick = () => {
                        setActiveCharacter(`${currentUser}/${file}`);
                    };
                    characterList.appendChild(listItem);
                } catch (err) {
                    console.error(`[RollForge] Skipping invalid character file ${currentUser}/${file}:`, err);
                }
            }
        }

        const modalEl = document.getElementById('characterSelectModal');
        if (modalEl) {
            const modal = bootstrap.Modal.getOrCreateInstance(modalEl);
            modal.show();
        }
    } catch (error) {
        characterList.innerHTML = '<li class="list-group-item text-danger">Error loading characters.</li>';
    }
}

// Sets the currently active character and updates the view accordingly.
function setActiveCharacter(path) {
    console.debug("[RollForge] Character selected:", path);
    localStorage.setItem('activeCharacter', path);

    const modalEl = document.getElementById('characterSelectModal');
    if (modalEl) {
        const modal = bootstrap.Modal.getOrCreateInstance(modalEl);
        modal.hide();
    }

    document.getElementById('character-content').classList.remove('d-none');
    loadTab('stats');
}

function changeCharacter() {
    localStorage.removeItem('activeCharacter');
    showCharacterSelector();
  }
  
  // make sure it's globally accessible
  window.changeCharacter = changeCharacter;

// Initializes tab interactions after DOM fully loads.
document.addEventListener('DOMContentLoaded', () => {
    const tabs = document.querySelectorAll('#myTab .nav-link');
    tabs.forEach(tab => {
        tab.addEventListener('click', (e) => {
            e.preventDefault();
            const tabName = tab.getAttribute('href').substring(1);
            loadTab(tabName);
            new bootstrap.Tab(tab).show();
        });
    });

    // Default to loading the stats tab upon initial page load.
    loadTab('stats');
});

// Makes key functions globally accessible for HTML inline event handlers.
window.loadTab = loadTab;
window.logout = logout;
window.showCharacterSelector = showCharacterSelector;
window.setActiveCharacter = setActiveCharacter;