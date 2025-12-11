// ==================== MAIN.JS - ENTRY POINT ====================
// Ties all modules together and handles game initialization

import { 
  player, 
  initPlayer, 
  loadPlayer, 
  savePlayer, 
  hasSaveData,
  getPlayerPortrait,
  getSpiritPortrait
} from './player.js';

import { 
  updateHUD, 
  updatePlayerInfo,
  renderAbilities,
  showVictoryScreen,
  hideVictoryScreen,
  showGameOverScreen,
  showToast,
  createFloatingText,
  createAbilityEffect
} from './ui.js';

import { 
  CLASSES,
  applyClassStats,
  getClassAbilities,
  projectiles,
  createProjectile,
  updateProjectiles,
  drawProjectiles,
  useAbility
} from './combat.js';

import {
  startDialogue,
  nextDialogueLine,
  isInDialogue,
  STORY_DIALOGUES
} from './dialogueSystem.js';

import {
  initAudio,
  playMusic,
  stopMusic,
  playSFX,
  setMusicVolume,
  setSFXVolume
} from './audio.js';

import {
  MAP_NODES,
  startNode,
  completeNode,
  isNodeUnlocked,
  isNodeCompleted,
  getAvailableNodes
} from './story.js';

import {
  enterTown,
  enterLocation,
  exitLocation,
  exitTown,
  buyItem,
  buyBlacksmithItem,
  restAtInn,
  SHOP_ITEMS
} from './towns.js';

import {
  getAvailableQuests,
  acceptQuest,
  getActiveQuests,
  updateQuestProgress
} from './guild.js';

// ==================== GAME STATE ====================
let gameState = 'title'; // title, character_select, menu, map, town, playing, paused, gameover
let currentNode = null;
let gameRunning = false;
let gamePaused = false;

// Game canvas and context
let canvas, ctx;

// Enemies array
let enemies = [];
let wave = 1;
let enemiesKilled = 0;
let sessionCoins = 0;
let sessionXP = 0;

// ==================== INITIALIZATION ====================

window.addEventListener('DOMContentLoaded', () => {
  console.log('Evol Legends - Initializing...');
  
  // Initialize canvas
  canvas = document.getElementById('game-canvas');
  if (canvas) {
    ctx = canvas.getContext('2d');
  }
  
  // Initialize audio
  initAudio();
  
  // Setup event listeners
  setupEventListeners();
  
  // Check for save data
  if (hasSaveData()) {
    loadPlayer();
    showScreen('menu');
  } else {
    showScreen('title');
  }
  
  // Expose functions globally for onclick handlers
  window.game = {
    startNewGame,
    continueGame,
    selectCharacter,
    confirmCharacter,
    selectClass,
    startNode: handleStartNode,
    enterTown,
    enterLocation,
    exitLocation,
    exitTown,
    buyItem,
    buyBlacksmithItem,
    restAtInn,
    acceptQuest,
    nextDialogue: nextDialogueLine,
    returnToMenu,
    returnToMap,
    pauseGame,
    resumeGame,
    quitToMenu
  };
  
  console.log('Evol Legends - Ready!');
});

// ==================== SCREEN MANAGEMENT ====================

function showScreen(screenName) {
  // Hide all screens
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  
  // Show target screen
  const screen = document.getElementById(`${screenName}-screen`);
  if (screen) {
    screen.classList.add('active');
  }
  
  gameState = screenName;
  
  // Screen-specific logic
  switch(screenName) {
    case 'title':
      playMusic('mainMenu');
      break;
    case 'menu':
      playMusic('village');
      updatePlayerInfo();
      updateHUD();
      break;
    case 'map':
      playMusic('village');
      renderMap();
      break;
    case 'character_select':
      // No music change
      break;
  }
}

// ==================== CHARACTER CREATION ====================

let selectedAvatar = 'boy';

function startNewGame() {
  showScreen('character_select');
}

function continueGame() {
  loadPlayer();
  showScreen('menu');
  updatePlayerInfo();
  updateHUD();
}

function selectCharacter(avatar) {
  selectedAvatar = avatar;
  
  // Update UI to show selection
  document.querySelectorAll('.avatar-option').forEach(el => {
    el.classList.remove('selected');
  });
  document.querySelector(`.avatar-option[data-avatar="${avatar}"]`)?.classList.add('selected');
  
  // Update spirit preview
  const spiritPreview = document.getElementById('spirit-preview');
  if (spiritPreview) {
    spiritPreview.src = avatar === 'boy' 
      ? 'assets/images/portraits/spirit_female.png'
      : 'assets/images/portraits/spirit_male.png';
  }
}

function confirmCharacter() {
  const nameInput = document.getElementById('player-name-input');
  const playerName = nameInput?.value.trim() || 'Legend';
  
  if (playerName.length < 2) {
    showToast('Name must be at least 2 characters!', 'error');
    return;
  }
  
  // Initialize player
  initPlayer(playerName, selectedAvatar);
  savePlayer();
  
  // Show intro cutscene
  startDialogue(STORY_DIALOGUES.villageIntro, () => {
    startDialogue(STORY_DIALOGUES.elderHouse, () => {
      startDialogue(STORY_DIALOGUES.tutorial, () => {
        showScreen('menu');
      });
    });
  });
}

// ==================== CLASS SELECTION ====================

function selectClass(className) {
  if (!player.unlockedClasses.includes(className)) {
    showToast('This class is locked!', 'error');
    return;
  }
  
  applyClassStats(className);
  savePlayer();
  
  // Update UI
  renderClassSelection();
  showToast(`Selected class: ${className}`, 'success');
}

function renderClassSelection() {
  const container = document.getElementById('class-grid');
  if (!container) return;
  
  let html = '';
  
  Object.entries(CLASSES).forEach(([id, cls]) => {
    const unlocked = player.unlockedClasses.includes(id);
    const selected = player.selectedClass === id;
    
    html += `
      <div class="class-card ${unlocked ? '' : 'locked'} ${selected ? 'selected' : ''}"
           onclick="window.game.selectClass('${id}')">
        <div class="class-icon">${cls.icon}</div>
        <div class="class-name">${cls.name}</div>
        <div class="class-desc">${unlocked ? cls.description : '🔒 Locked'}</div>
        ${selected ? '<div class="class-selected-badge">✓ SELECTED</div>' : ''}
      </div>
    `;
  });
  
  container.innerHTML = html;
}

// ==================== MAP RENDERING ====================

function renderMap() {
  const mapContainer = document.getElementById('map-nodes');
  if (!mapContainer) return;
  
  let html = '';
  
  Object.values(MAP_NODES).forEach(node => {
    if (node.type === 'town') return; // Towns shown separately
    
    const unlocked = isNodeUnlocked(node.id);
    const completed = isNodeCompleted(node.id);
    
    let nodeClass = 'map-node';
    if (!unlocked) nodeClass += ' locked';
    if (completed) nodeClass += ' completed';
    if (node.type === 'boss') nodeClass += ' boss';
    
    let icon = '⚔️';
    if (node.type === 'tutorial') icon = '📖';
    if (node.type === 'boss') icon = '👹';
    if (completed) icon = '✓';
    if (!unlocked) icon = '🔒';
    
    html += `
      <div class="${nodeClass}" 
           onclick="${unlocked ? `window.game.startNode('${node.id}')` : ''}"
           title="${node.name}">
        <div class="node-icon">${icon}</div>
        <div class="node-name">${node.name}</div>
        <div class="node-difficulty">⭐ ${node.difficulty || 1}</div>
      </div>
    `;
  });
  
  // Add town nodes
  Object.values(MAP_NODES).filter(n => n.type === 'town').forEach(node => {
    if (!isNodeUnlocked(node.id)) return;
    
    html += `
      <div class="map-node town" onclick="window.game.enterTown('${node.id}')">
        <div class="node-icon">🏘️</div>
        <div class="node-name">${node.name}</div>
      </div>
    `;
  });
  
  mapContainer.innerHTML = html;
}

// ==================== GAMEPLAY ====================

function handleStartNode(nodeId) {
  const node = startNode(nodeId);
  if (!node) return;
  
  currentNode = node;
  wave = 1;
  enemiesKilled = 0;
  sessionCoins = 0;
  sessionXP = 0;
  enemies = [];
  projectiles.length = 0;
  
  // Reset player for battle
  player.hp = player.maxHp;
  player.shield = 0;
  player.alive = true;
  
  // Show game screen
  showScreen('game');
  
  // Setup abilities
  const abilities = getClassAbilities();
  renderAbilities(abilities, handleAbilityUse);
  
  // Start game loop
  gameRunning = true;
  gamePaused = false;
  gameLoop();
}

function handleAbilityUse(ability) {
  if (gamePaused || !gameRunning) return;
  
  const damage = useAbility(ability);
  // Apply ability effects to enemies
  createAbilityEffect(player.x, player.y, 'explosion');
  
  // TODO: Apply damage to enemies in range
}

let lastTime = 0;
function gameLoop(timestamp = 0) {
  if (!gameRunning) return;
  
  const deltaTime = (timestamp - lastTime) / 1000;
  lastTime = timestamp;
  
  if (!gamePaused) {
    update(deltaTime);
    render();
  }
  
  requestAnimationFrame(gameLoop);
}

function update(dt) {
  // Update projectiles
  updateProjectiles(canvas, enemies, handleProjectileHit);
  
  // Update enemies
  updateEnemies(dt);
  
  // Check win/lose conditions
  if (enemies.length === 0 && wave >= currentNode.waves) {
    victory();
  }
  
  if (!player.alive) {
    gameOver();
  }
  
  // Update HUD
  updateHUD();
}

function render() {
  if (!ctx) return;
  
  // Clear canvas
  ctx.fillStyle = '#1a1a2e';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  // Draw background grid
  ctx.strokeStyle = '#333';
  ctx.lineWidth = 1;
  for (let x = 0; x < canvas.width; x += 50) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, canvas.height);
    ctx.stroke();
  }
  for (let y = 0; y < canvas.height; y += 50) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(canvas.width, y);
    ctx.stroke();
  }
  
  // Draw enemies
  enemies.forEach(enemy => {
    ctx.fillStyle = enemy.color || '#ff4444';
    ctx.fillRect(enemy.x, enemy.y, enemy.w, enemy.h);
    
    // Enemy HP bar
    const hpPercent = enemy.hp / enemy.maxHp;
    ctx.fillStyle = '#333';
    ctx.fillRect(enemy.x, enemy.y - 10, enemy.w, 5);
    ctx.fillStyle = '#ff0000';
    ctx.fillRect(enemy.x, enemy.y - 10, enemy.w * hpPercent, 5);
  });
  
  // Draw player
  const cls = CLASSES[player.selectedClass];
  ctx.fillStyle = cls?.color || '#00ff00';
  ctx.fillRect(player.x, player.y, player.w, player.h);
  
  // Draw projectiles
  drawProjectiles(ctx);
  
  // Draw wave info
  ctx.fillStyle = '#ffffff';
  ctx.font = '16px "Press Start 2P"';
  ctx.fillText(`Wave ${wave}/${currentNode?.waves || 1}`, 10, 30);
  ctx.fillText(`Kills: ${enemiesKilled}`, 10, 55);
}

function handleProjectileHit(enemy, projectile) {
  enemy.hp -= projectile.damage;
  playSFX('hit');
  
  createFloatingText(
    enemy.x + enemy.w / 2, 
    enemy.y, 
    `-${Math.floor(projectile.damage)}`,
    projectile.isCrit ? '#ffff00' : '#ffffff'
  );
  
  if (enemy.hp <= 0) {
    enemyKilled(enemy);
  }
}

function enemyKilled(enemy) {
  enemies = enemies.filter(e => e !== enemy);
  enemiesKilled++;
  player.totalKills++;
  
  // Rewards
  const coins = 5 + wave * 2;
  sessionCoins += coins;
  player.coins += coins;
  
  playSFX('kill');
  createFloatingText(enemy.x, enemy.y, `+${coins}💰`, '#ffdd00');
  
  // Update quest progress
  updateQuestProgress('kill', enemy.type, 1);
  
  // Boss kill
  if (enemy.isBoss) {
    player.bossKills++;
    playSFX('bossDefeat');
    updateQuestProgress('defeat_boss', enemy.bossId, 1);
  }
}

function updateEnemies(dt) {
  // Spawn enemies if needed
  if (enemies.length < 5 + wave * 2) {
    spawnEnemy();
  }
  
  // Move enemies toward player
  enemies.forEach(enemy => {
    const dx = player.x - enemy.x;
    const dy = player.y - enemy.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    
    if (dist > 50) {
      enemy.x += (dx / dist) * enemy.speed * 60 * dt;
      enemy.y += (dy / dist) * enemy.speed * 60 * dt;
    }
    
    // Damage player on collision
    if (dist < 40 && player.alive) {
      damagePlayer(enemy.damage * dt);
    }
  });
}

function spawnEnemy() {
  const side = Math.floor(Math.random() * 4);
  let x, y;
  
  switch(side) {
    case 0: x = -30; y = Math.random() * canvas.height; break;
    case 1: x = canvas.width + 30; y = Math.random() * canvas.height; break;
    case 2: x = Math.random() * canvas.width; y = -30; break;
    case 3: x = Math.random() * canvas.width; y = canvas.height + 30; break;
  }
  
  const enemy = {
    x, y,
    w: 30,
    h: 30,
    hp: 20 + wave * 5,
    maxHp: 20 + wave * 5,
    damage: 5 + wave,
    speed: 1 + wave * 0.1,
    color: '#ff4444',
    type: 'slime'
  };
  
  enemies.push(enemy);
}

function damagePlayer(amount) {
  if (player.invincible) return;
  
  // Shield absorbs first
  if (player.shield > 0) {
    const shieldDamage = Math.min(player.shield, amount);
    player.shield -= shieldDamage;
    amount -= shieldDamage;
  }
  
  player.hp -= amount;
  
  if (player.hp <= 0) {
    player.hp = 0;
    player.alive = false;
  }
}

function victory() {
  gameRunning = false;
  
  completeNode(currentNode.id, {
    waves: wave,
    kills: enemiesKilled
  });
  
  updateQuestProgress('complete_node', currentNode.id);
}

function gameOver() {
  gameRunning = false;
  playSFX('playerDefeat');
  
  showGameOverScreen({
    wave,
    kills: enemiesKilled,
    coins: sessionCoins,
    xp: sessionXP
  });
}

// ==================== NAVIGATION ====================

function returnToMenu() {
  hideVictoryScreen();
  showScreen('menu');
}

function returnToMap() {
  hideVictoryScreen();
  showScreen('map');
}

function pauseGame() {
  gamePaused = true;
  document.getElementById('pause-menu')?.classList.add('active');
}

function resumeGame() {
  gamePaused = false;
  document.getElementById('pause-menu')?.classList.remove('active');
}

function quitToMenu() {
  gameRunning = false;
  gamePaused = false;
  showScreen('menu');
}

// ==================== INPUT HANDLING ====================

function setupEventListeners() {
  // Keyboard
  document.addEventListener('keydown', handleKeyDown);
  document.addEventListener('keyup', handleKeyUp);
  
  // Mouse
  document.addEventListener('mousemove', handleMouseMove);
  document.addEventListener('click', handleClick);
  
  // Touch for mobile
  document.addEventListener('touchstart', handleTouch);
}

const keys = {};
let mouseX = 0, mouseY = 0;

function handleKeyDown(e) {
  keys[e.key.toLowerCase()] = true;
  
  // Dialogue advance
  if (isInDialogue() && (e.key === ' ' || e.key === 'Enter')) {
    nextDialogueLine();
    return;
  }
  
  // Pause
  if (e.key === 'Escape' && gameState === 'game') {
    if (gamePaused) resumeGame();
    else pauseGame();
  }
  
  // Potions (1-6)
  if (gameRunning && !gamePaused) {
    if (e.key >= '1' && e.key <= '6') {
      // Use potion
    }
    
    // Abilities (Q, E)
    if (e.key.toLowerCase() === 'q' || e.key.toLowerCase() === 'e') {
      const abilities = getClassAbilities();
      const ability = abilities.find(a => a.key.toLowerCase() === e.key.toLowerCase());
      if (ability) handleAbilityUse(ability);
    }
  }
}

function handleKeyUp(e) {
  keys[e.key.toLowerCase()] = false;
}

function handleMouseMove(e) {
  mouseX = e.clientX;
  mouseY = e.clientY;
  
  // Move player toward mouse in game
  if (gameRunning && !gamePaused && canvas) {
    const rect = canvas.getBoundingClientRect();
    const canvasX = e.clientX - rect.left;
    const canvasY = e.clientY - rect.top;
    
    // Smooth movement toward mouse
    player.x += (canvasX - player.x - player.w / 2) * 0.05;
    player.y += (canvasY - player.y - player.h / 2) * 0.05;
    
    // Keep in bounds
    player.x = Math.max(0, Math.min(canvas.width - player.w, player.x));
    player.y = Math.max(0, Math.min(canvas.height - player.h, player.y));
  }
}

function handleClick(e) {
  // Dialogue advance on click
  if (isInDialogue()) {
    nextDialogueLine();
    return;
  }
  
  // Shoot projectile
  if (gameRunning && !gamePaused && canvas) {
    const rect = canvas.getBoundingClientRect();
    const targetX = e.clientX - rect.left;
    const targetY = e.clientY - rect.top;
    
    createProjectile(
      player.x + player.w / 2,
      player.y + player.h / 2,
      targetX,
      targetY
    );
  }
}

function handleTouch(e) {
  // Treat touch as click for dialogue
  if (isInDialogue()) {
    nextDialogueLine();
  }
}

// Movement with WASD/Arrow keys
function updatePlayerMovement() {
  if (!gameRunning || gamePaused) return;
  
  const speed = 5;
  
  if (keys['w'] || keys['arrowup']) player.y -= speed;
  if (keys['s'] || keys['arrowdown']) player.y += speed;
  if (keys['a'] || keys['arrowleft']) player.x -= speed;
  if (keys['d'] || keys['arrowright']) player.x += speed;
  
  // Keep in bounds
  if (canvas) {
    player.x = Math.max(0, Math.min(canvas.width - player.w, player.x));
    player.y = Math.max(0, Math.min(canvas.height - player.h, player.y));
  }
}

// Run movement update in game loop
setInterval(updatePlayerMovement, 16);

console.log('main.js loaded');
