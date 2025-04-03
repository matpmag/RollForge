// State management
let diceQueue = {};
let hasAdvantage = false;
let hasDisadvantage = false;
let isPanelCollapsed = false;

// Panel toggle
function toggleDicePanel() {
  const panel = document.querySelector('.dice-panel');
  const app = document.querySelector('#app');
  const toggleIcon = document.querySelector('.panel-toggle-icon');
  
  isPanelCollapsed = !isPanelCollapsed;
  
  panel.classList.toggle('collapsed', isPanelCollapsed);
  app.classList.toggle('panel-open', !isPanelCollapsed);
  
  // Update icon
  if (isPanelCollapsed) {
    toggleIcon.classList.remove('fa-chevron-right');
    toggleIcon.classList.add('fa-chevron-left');
  } else {
    toggleIcon.classList.remove('fa-chevron-left');
    toggleIcon.classList.add('fa-chevron-right');
  }
}

// Chat handling
function handleChatInput(event) {
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault();
    sendChat();
  }
}

function sendChat() {
  const input = document.querySelector('#chat-input input');
  const message = input.value.trim();
  if (message) {
    appendLogEntry({
      type: 'chat',
      message: message
    });
    input.value = '';
  }
}

// Roll handling
function rollDice() {
  const rolls = [];
  let formula = [];
  
  for (const [type, count] of Object.entries(diceQueue)) {
    for (let i = 0; i < count; i++) {
      const max = parseInt(type.substring(1));
      const result = Math.floor(Math.random() * max) + 1;
      rolls.push({ type, result });
    }
    formula.push(`${count}${type}`);
  }

  if (rolls.length > 0) {
    appendLogEntry({
      type: 'roll',
      rolls,
      formula: formula.join(' + ')
    });
  }

  clearDice();
}

// Log entry handling
function appendLogEntry(data) {
  const log = document.querySelector('.dice-chat-log');
  if (!log) return;

  const entry = document.createElement('div');
  entry.className = `log-entry ${data.type}-entry`;

  // Header with user/character info
  const header = document.createElement('div');
  header.className = 'log-entry-header';

  const currentUser = localStorage.getItem('userRole');
  const characterPath = localStorage.getItem('activeCharacter');
  const playerName = characterPath ? characterPath.split('/')[0] : '';
  const characterName = characterPath ? characterPath.split('/')[1].replace('.json', '') : '';

  const displayName = currentUser === 'Master' 
    ? 'Dungeon Master'
    : `${characterName} (${playerName})`;

  header.innerHTML = `
    <img class="log-entry-avatar" src="default-pic.png" alt="Avatar">
    <div class="log-entry-name">${displayName}</div>
  `;
  entry.appendChild(header);

  // Content
  const content = document.createElement('div');
  content.className = 'log-entry-content';

  if (data.type === 'roll') {
    // Group dice by type
    const diceGroups = {};
    data.rolls.forEach(roll => {
      const diceType = roll.type;
      if (!diceGroups[diceType]) {
        diceGroups[diceType] = [];
      }
      diceGroups[diceType].push(roll.result);
    });

    // Create roll card
    content.innerHTML = createRollCard({
      type: 'ROLL',
      groups: Object.entries(diceGroups).map(([type, results]) => ({
        type,
        total: results.reduce((a, b) => a + b, 0),
        count: results.length
      })),
      total: data.rolls.reduce((sum, roll) => sum + roll.result, 0),
      formula: data.formula || Object.entries(diceGroups)
        .map(([type, results]) => `${results.length}${type}`)
        .join(' + ')
    });
  } else {
    content.textContent = data.message;
  }

  entry.appendChild(content);
  log.insertBefore(entry, log.firstChild);

  // Keep log size manageable
  while (log.children.length > 50) {
    log.removeChild(log.lastChild);
  }
}

function createRollCard(roll) {
  return `
    <div class="roll-card">
      <div class="roll-header">
        <span class="roll-type">${roll.type}: ${roll.formula}</span>
      </div>
      <div class="roll-content">
        <div class="roll-results">
          ${roll.groups.map(group => `
            <div class="roll-group">
              <div class="roll-total">${group.total}</div>
              <div class="roll-type-label">${group.type}</div>
            </div>
          `).join('')}
        </div>
        <div class="roll-final">
          <div class="roll-final-total">${roll.total}</div>
        </div>
      </div>
    </div>
  `;
}

// Dice state management
function addDie(type) {
  diceQueue[type] = (diceQueue[type] || 0) + 1;
  updateDiceBadges();
}

function clearDice() {
  diceQueue = {};
  updateDiceBadges();
}

// Update badges
function updateDiceBadges() {
  for (const type of ['d20', 'd12', 'd10', 'd8', 'd6', 'd4', 'd100']) {
    const badge = document.getElementById(`badge-${type}`);
    if (badge) {
      const count = diceQueue[type] || 0;
      badge.textContent = count;
      badge.hidden = count === 0;
    }
  }
}

// Initialize tabs
document.addEventListener('DOMContentLoaded', () => {
  const tabLinks = document.querySelectorAll('.nav-link');
  tabLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = e.target.dataset.bsTarget;
      const target = document.querySelector(targetId);
      if (target) {
        document.querySelectorAll('.tab-pane').forEach(pane => {
          pane.classList.remove('show', 'active');
        });
        document.querySelectorAll('.nav-link').forEach(navLink => {
          navLink.classList.remove('active');
        });
        target.classList.add('show', 'active');
        e.target.classList.add('active');
      }
    });
  });

  // Set initial active tab
  const firstTab = document.querySelector('.nav-link');
  if (firstTab) {
    firstTab.click();
  }
});

// Make functions globally available
window.addDie = addDie;
window.clearDice = clearDice;
window.rollDice = rollDice;
window.toggleDicePanel = toggleDicePanel;
window.handleChatInput = handleChatInput;
window.sendChat = sendChat;