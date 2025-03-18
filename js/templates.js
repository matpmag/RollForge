const Templates = {

    stats: (char, label = '') => `
      <section class="character-stats">
        ${label ? `<h2>${label}</h2>` : ''}
        <h3>${char.name}</h3>
        <ul>
          <li><strong>Strength:</strong> ${char.stats.str}</li>
          <li><strong>Dexterity:</strong> ${char.stats.dex}</li>
          <li><strong>Constitution:</strong> ${char.stats.con}</li>
          <li><strong>Intelligence:</strong> ${char.stats.int}</li>
          <li><strong>Wisdom:</strong> ${char.stats.wis}</li>
          <li><strong>Charisma:</strong> ${char.stats.cha}</li>
        </ul>
      </section>
    `,
  
    inventory: (char, label = '') => `
      <section class="character-inventory">
        ${label ? `<h2>${label}</h2>` : ''}
        <h3>${char.name}'s Inventory</h3>
        <ul>
          ${char.inventory.length > 0 ? 
            char.inventory.map(item => `<li>${item}</li>`).join('') :
            '<li><em>No items found.</em></li>'
          }
        </ul>
      </section>
    `,
  
    actions: (char, label = '') => `
      <section class="character-actions">
        ${label ? `<h2>${label}</h2>` : ''}
        <h3>${char.name}'s Actions</h3>
        <ul>
          ${char.actions && char.actions.length > 0 ? 
            char.actions.map(action => `<li>${action}</li>`).join('') :
            '<li><em>No actions listed.</em></li>'
          }
        </ul>
      </section>
    `,
  
    dice: (char, label = '') => `
      <section class="character-dice">
        ${label ? `<h2>${label}</h2>` : ''}
        <h3>${char.name}'s Dice Roller</h3>
        <button onclick="rollDice(20, '${char.name}')">Roll d20</button>
        <div id="dice-result-${char.name.replace(/\s/g,'-')}"></div>
      </section>
    `,
  
  };