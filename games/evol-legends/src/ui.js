// ==================== UI MODULE ====================
// Handles HUD, bars, ability displays, tooltips, and visual feedback

import { player, getPlayerPortrait } from './player.js';

// Update all HUD elements
export function updateHUD() {
  updateHealthBar();
  updateShieldBar();
  updateXPBar();
  updateCurrency();
  updateLevel();
}

// Update health bar with numbers
export function updateHealthBar() {
  const hpBar = document.getElementById('hp-bar-fill');
  const hpText = document.getElementById('hp-text');
  
  if (hpBar && hpText) {
    const percent = Math.max(0, (player.hp / player.maxHp) * 100);
    hpBar.style.width = percent + '%';
    hpText.textContent = `${Math.floor(player.hp)} / ${player.maxHp}`;
    
    // Color based on health
    if (percent <= 25) {
      hpBar.style.background = 'linear-gradient(90deg, #ff0000, #ff4444)';
    } else if (percent <= 50) {
      hpBar.style.background = 'linear-gradient(90deg, #ff8800, #ffaa00)';
    } else {
      hpBar.style.background = 'linear-gradient(90deg, #00ff00, #44ff44)';
    }
  }
}

// Update shield bar with numbers
export function updateShieldBar() {
  const shieldBar = document.getElementById('shield-bar-fill');
  const shieldText = document.getElementById('shield-text');
  
  if (shieldBar && shieldText) {
    const percent = player.maxShield > 0 ? (player.shield / player.maxShield) * 100 : 0;
    shieldBar.style.width = percent + '%';
    shieldText.textContent = `${Math.floor(player.shield)} / ${player.maxShield}`;
  }
}

// Update XP bar with numbers
export function updateXPBar() {
  const xpBar = document.getElementById('xp-bar-fill');
  const xpText = document.getElementById('xp-text');
  
  if (xpBar && xpText) {
    const percent = (player.xp / player.xpToNext) * 100;
    xpBar.style.width = percent + '%';
    xpText.textContent = `${player.xp} / ${player.xpToNext}`;
  }
}

// Update currency display
export function updateCurrency() {
  const coinsEl = document.getElementById('coins-display');
  const gemsEl = document.getElementById('gems-display');
  
  if (coinsEl) coinsEl.textContent = player.coins;
  if (gemsEl) gemsEl.textContent = player.gems;
}

// Update level display
export function updateLevel() {
  const levelEl = document.getElementById('level-display');
  if (levelEl) levelEl.textContent = `Lv.${player.level}`;
}

// Create floating damage/heal text
export function createFloatingText(x, y, text, color = '#ffffff', size = 16) {
  const container = document.getElementById('floating-text-container');
  if (!container) return;
  
  const floater = document.createElement('div');
  floater.className = 'floating-text';
  floater.textContent = text;
  floater.style.cssText = `
    position: absolute;
    left: ${x}px;
    top: ${y}px;
    color: ${color};
    font-size: ${size}px;
    font-family: 'Press Start 2P', monospace;
    text-shadow: 2px 2px 0 #000;
    pointer-events: none;
    z-index: 1000;
    animation: floatUp 1s ease-out forwards;
  `;
  
  container.appendChild(floater);
  
  setTimeout(() => floater.remove(), 1000);
}

// Show ability tooltip on hover
export function showAbilityTooltip(ability, element) {
  const tooltip = document.getElementById('ability-tooltip');
  if (!tooltip) return;
  
  tooltip.innerHTML = `
    <div class="tooltip-name">${ability.icon} ${ability.name}</div>
    <div class="tooltip-desc">${ability.description}</div>
    <div class="tooltip-stats">
      <span>⚔️ Damage: ${ability.damage || 'N/A'}</span>
      <span>⏱️ Cooldown: ${ability.cooldown}s</span>
    </div>
    ${ability.special ? `<div class="tooltip-special">✨ ${ability.special}</div>` : ''}
  `;
  
  const rect = element.getBoundingClientRect();
  tooltip.style.left = rect.left + 'px';
  tooltip.style.top = (rect.top - tooltip.offsetHeight - 10) + 'px';
  tooltip.style.display = 'block';
}

// Hide ability tooltip
export function hideAbilityTooltip() {
  const tooltip = document.getElementById('ability-tooltip');
  if (tooltip) tooltip.style.display = 'none';
}

// Render ability bar with hover info
export function renderAbilities(abilities, onUse) {
  const container = document.getElementById('ability-bar');
  if (!container) return;
  
  container.innerHTML = '';
  
  abilities.forEach((ability, index) => {
    const btn = document.createElement('button');
    btn.className = 'ability-btn';
    btn.innerHTML = `
      <span class="ability-icon">${ability.icon}</span>
      <span class="ability-key">[${ability.key}]</span>
      <div class="ability-cooldown-overlay" id="cd-${ability.id}"></div>
    `;
    
    btn.addEventListener('mouseenter', () => showAbilityTooltip(ability, btn));
    btn.addEventListener('mouseleave', hideAbilityTooltip);
    btn.addEventListener('click', () => onUse(ability));
    
    container.appendChild(btn);
  });
}

// Update ability cooldown display
export function updateAbilityCooldown(abilityId, remainingTime, totalTime) {
  const overlay = document.getElementById(`cd-${abilityId}`);
  if (!overlay) return;
  
  if (remainingTime > 0) {
    const percent = (remainingTime / totalTime) * 100;
    overlay.style.height = percent + '%';
    overlay.style.display = 'block';
  } else {
    overlay.style.display = 'none';
  }
}

// Show screen shake effect
export function screenShake(intensity = 5, duration = 200) {
  const gameContainer = document.getElementById('game-container');
  if (!gameContainer) return;
  
  const originalTransform = gameContainer.style.transform;
  let start = Date.now();
  
  function shake() {
    const elapsed = Date.now() - start;
    if (elapsed < duration) {
      const x = (Math.random() - 0.5) * intensity;
      const y = (Math.random() - 0.5) * intensity;
      gameContainer.style.transform = `translate(${x}px, ${y}px)`;
      requestAnimationFrame(shake);
    } else {
      gameContainer.style.transform = originalTransform;
    }
  }
  
  shake();
}

// Create special ability effect
export function createAbilityEffect(x, y, type, color = '#ff00ff') {
  const container = document.getElementById('effects-container');
  if (!container) return;
  
  const effect = document.createElement('div');
  effect.className = `ability-effect effect-${type}`;
  effect.style.left = x + 'px';
  effect.style.top = y + 'px';
  
  switch(type) {
    case 'explosion':
      effect.innerHTML = '💥';
      effect.style.fontSize = '60px';
      break;
    case 'blackhole':
      effect.innerHTML = '🌀';
      effect.style.fontSize = '80px';
      effect.style.filter = 'hue-rotate(180deg)';
      break;
    case 'heal':
      effect.innerHTML = '✨';
      effect.style.fontSize = '40px';
      break;
    case 'shield':
      effect.innerHTML = '🛡️';
      effect.style.fontSize = '50px';
      break;
    case 'fire':
      effect.innerHTML = '🔥';
      effect.style.fontSize = '50px';
      break;
    case 'lightning':
      effect.innerHTML = '⚡';
      effect.style.fontSize = '60px';
      break;
  }
  
  container.appendChild(effect);
  setTimeout(() => effect.remove(), 800);
}

// Show victory screen
export function showVictoryScreen(data) {
  const screen = document.getElementById('victory-screen');
  if (!screen) return;
  
  document.getElementById('victory-waves').textContent = data.waves || 1;
  document.getElementById('victory-kills').textContent = data.kills || 0;
  document.getElementById('victory-coins').textContent = data.coins || 0;
  document.getElementById('victory-xp').textContent = data.xp || 0;
  
  // Show drops if any
  const dropsContainer = document.getElementById('victory-drops');
  if (dropsContainer && data.drops && data.drops.length > 0) {
    dropsContainer.innerHTML = data.drops.map(drop => `<div class="drop-item">${drop}</div>`).join('');
    dropsContainer.style.display = 'block';
  }
  
  screen.classList.add('active');
}

// Hide victory screen
export function hideVictoryScreen() {
  const screen = document.getElementById('victory-screen');
  if (screen) screen.classList.remove('active');
}

// Show game over screen
export function showGameOverScreen(data) {
  const screen = document.getElementById('gameover-screen');
  if (!screen) return;
  
  document.getElementById('final-wave').textContent = data.wave || 1;
  document.getElementById('final-kills').textContent = data.kills || 0;
  document.getElementById('earned-coins').textContent = data.coins || 0;
  document.getElementById('earned-xp').textContent = data.xp || 0;
  
  screen.classList.add('active');
}

// Show/hide loading screen
export function showLoading(show = true) {
  const loading = document.getElementById('loading-screen');
  if (loading) {
    loading.style.display = show ? 'flex' : 'none';
  }
}

// Show notification toast
export function showToast(message, type = 'info', duration = 3000) {
  const container = document.getElementById('toast-container');
  if (!container) return;
  
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.textContent = message;
  
  container.appendChild(toast);
  
  setTimeout(() => toast.classList.add('show'), 10);
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
  }, duration);
}

// Update player info display (portrait, name, level)
export function updatePlayerInfo() {
  const portrait = document.getElementById('player-portrait');
  const name = document.getElementById('player-name');
  const guildRank = document.getElementById('guild-rank');
  
  if (portrait) portrait.src = getPlayerPortrait();
  if (name) name.textContent = player.name;
  if (guildRank) guildRank.textContent = `Rank: ${player.guildRank}`;
}
