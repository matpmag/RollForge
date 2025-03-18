Templates.inventory = (char, label = '') => `
  <section class="character-inventory">
    ${label ? `<h2>${label}</h2>` : ''}
    <h3>${char.name}'s Inventory</h3>
    <ul>
      ${char.inventory && char.inventory.length > 0 
        ? char.inventory.map(item => `<li>${item}</li>`).join('')
        : '<li><em>No items found.</em></li>'
      }
    </ul>
  </section>
`;
