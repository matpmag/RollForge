async function loadTab(tabName) {
    const role = localStorage.getItem('userRole');
    if (!role) {
      alert('Select your role first.');
      return;
    }
  
    const contentDiv = document.getElementById('tab-content');
  
    if (role === 'dm') {
      const players = ['player1', 'player2', 'player3'];
      const htmlChunks = [];
  
      for (const playerRole of players) {
        const chars = await fetchCharacters(playerRole);
        for (const charData of chars) {
          htmlChunks.push(Templates[tabName](charData, `${playerRole.toUpperCase()} - ${charData.name}`));
        }
      }
      contentDiv.innerHTML = htmlChunks.join('<hr/>');
    } else {
      const chars = await fetchCharacters(role);
      const htmlChunks = chars.map(charData => Templates[tabName](charData, charData.name));
      contentDiv.innerHTML = htmlChunks.join('<hr/>');
    }
  }
  
  async function fetchCharacters(player) {
    const response = await fetch(`characters/${player}/index.json`);
    const charFiles = await response.json(); // e.g., ["hasoon.json", "liora.json"]
    const chars = await Promise.all(
      charFiles.map(filename => fetch(`characters/${player}/${filename}`).then(res => res.json()))
    );
    return chars;
  }