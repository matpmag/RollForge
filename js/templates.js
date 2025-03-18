let Templates = {};

async function loadTemplates() {
  const [stats, inventory, actions, dice] = await Promise.all([
    fetch('js/templates/stats.js').then(res => res.text()),
    fetch('js/templates/inventory.js').then(res => res.text()),
    fetch('js/templates/actions.js').then(res => res.text()),
    //fetch('js/templates/dice.js').then(res => res.text())
  ]);

  // Dynamically evaluate and attach templates to Templates object
  eval(stats);
  eval(inventory);
  eval(actions);
  eval(dice);
}

loadTemplates();