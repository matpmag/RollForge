Templates.actions = (char, label = '') => `
  <section class="character-actions">
    ${label ? `<h2>${label}</h2>` : ''}
    <h3>${char.name}'s Actions</h3>
    <ul>
      ${char.actions && char.actions.length > 0 
        ? char.actions.map(action => `<li>${action}</li>`).join('')
        : '<li><em>No actions listed.</em></li>'
      }
    </ul>
  </section>
`;
