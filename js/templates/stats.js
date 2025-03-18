Templates.stats = (char, label = '') => {
  const getMod = (score) => {
    const mod = Math.floor((score - 10) / 2);
    return mod >= 0 ? `+${mod}` : `${mod}`;
  };

  return `
    <section class="character-stats">
      ${label ? `<h2>${label}</h2>` : ''}
      <h3>${char.name}</h3>

      <h4>Abilities</h4>
      <ul>
        <li><strong>Strength:</strong> ${char.stats.str} (${getMod(char.stats.str)})</li>
        <li><strong>Dexterity:</strong> ${char.stats.dex} (${getMod(char.stats.dex)})</li>
        <li><strong>Constitution:</strong> ${char.stats.con} (${getMod(char.stats.con)})</li>
        <li><strong>Intelligence:</strong> ${char.stats.int} (${getMod(char.stats.int)})</li>
        <li><strong>Wisdom:</strong> ${char.stats.wis} (${getMod(char.stats.wis)})</li>
        <li><strong>Charisma:</strong> ${char.stats.cha} (${getMod(char.stats.cha)})</li>
      </ul>

      <h4>Saving Throws</h4>
      <ul>
        ${
          char.savingThrows
            ? Object.entries(char.savingThrows)
                .map(
                  ([ability, data]) =>
                    `<li><strong>${ability.toUpperCase()}:</strong> ${data.value} ${data.proficient ? '(Proficient)' : ''}</li>`
                )
                .join('')
            : '<li><em>Not specified</em></li>'
        }
      </ul>

      <h4>Senses</h4>
      <ul>
        <li><strong>Passive Perception:</strong> ${char.senses?.passivePerception ?? '—'}</li>
        <li><strong>Passive Investigation:</strong> ${char.senses?.passiveInvestigation ?? '—'}</li>
        <li><strong>Passive Insight:</strong> ${char.senses?.passiveInsight ?? '—'}</li>
      </ul>

      <h4>Vision</h4>
      <p>${char.vision ?? 'Normal'}</p>
    </section>
  `;
};
