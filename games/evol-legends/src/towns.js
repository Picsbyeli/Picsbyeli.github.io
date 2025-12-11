// ==================== TOWNS MODULE ====================
// Handles town interiors, shops, NPCs, and town interactions

import { player, savePlayer } from './player.js';
import { showToast, updateHUD } from './ui.js';
import { startDialogue, STORY_DIALOGUES } from './dialogueSystem.js';
import { playMusic, playSFX } from './audio.js';

// ==================== TOWN LOCATIONS ====================
export const TOWN_LOCATIONS = {
  shop: {
    id: 'shop',
    name: 'General Shop',
    icon: '🛒',
    description: 'Buy potions and useful items',
    npc: 'milo'
  },
  blacksmith: {
    id: 'blacksmith',
    name: 'Blacksmith',
    icon: '⚒️',
    description: 'Upgrade weapons and buy equipment',
    npc: 'blacksmith'
  },
  inn: {
    id: 'inn',
    name: 'Inn',
    icon: '🛏️',
    description: 'Rest to fully restore HP and Shield',
    npc: 'innkeeper'
  },
  guild_hall: {
    id: 'guild_hall',
    name: 'Guild Hall',
    icon: '🏛️',
    description: 'Take quests and raise your rank',
    npc: 'guild_master',
    requiresBoss: true
  },
  elder_house: {
    id: 'elder_house',
    name: "Elder's House",
    icon: '🏠',
    description: 'Speak with Elder Rana about your journey',
    npc: 'elder_rana'
  },
  training_grounds: {
    id: 'training_grounds',
    name: 'Training Grounds',
    icon: '⚔️',
    description: 'Practice combat and learn new techniques',
    npc: 'ardin'
  },
  mayor_office: {
    id: 'mayor_office',
    name: "Mayor's Office",
    icon: '🏛️',
    description: 'Town administration and special quests',
    npc: 'mayor'
  }
};

// ==================== SHOP ITEMS ====================
export const SHOP_ITEMS = {
  // Potions
  heal_potion: {
    id: 'heal_potion',
    name: 'Healing Potion',
    icon: '❤️',
    description: 'Restores 50 HP instantly',
    type: 'potion',
    potionType: 'heal',
    price: 50,
    effect: { heal: 50 }
  },
  shield_potion: {
    id: 'shield_potion',
    name: 'Shield Potion',
    icon: '🛡️',
    description: 'Grants 30 Shield',
    type: 'potion',
    potionType: 'shield',
    price: 75,
    effect: { shield: 30 }
  },
  crit_potion: {
    id: 'crit_potion',
    name: 'Critical Elixir',
    icon: '💥',
    description: '100% crit chance for 5 seconds',
    type: 'potion',
    potionType: 'crit',
    price: 100,
    effect: { critBoost: 5 }
  },
  damage_potion: {
    id: 'damage_potion',
    name: 'Strength Elixir',
    icon: '⚔️',
    description: 'Double damage for 5 seconds',
    type: 'potion',
    potionType: 'damage',
    price: 100,
    effect: { damageBoost: 5 }
  },
  speed_potion: {
    id: 'speed_potion',
    name: 'Speed Elixir',
    icon: '⚡',
    description: 'Double attack speed for 5 seconds',
    type: 'potion',
    potionType: 'speed',
    price: 100,
    effect: { speedBoost: 5 }
  },
  dragon_potion: {
    id: 'dragon_potion',
    name: "Dragon's Breath",
    icon: '🐉',
    description: 'Powerful fire breath attack',
    type: 'potion',
    potionType: 'dragon',
    price: 250,
    effect: { specialAttack: true }
  },
  
  // Permanent upgrades (gems)
  hp_upgrade: {
    id: 'hp_upgrade',
    name: 'Max HP +10',
    icon: '💖',
    description: 'Permanently increase max HP',
    type: 'upgrade',
    priceGems: 20,
    effect: { maxHp: 10 },
    maxPurchases: 10
  },
  damage_upgrade: {
    id: 'damage_upgrade',
    name: 'Damage +5',
    icon: '⚔️',
    description: 'Permanently increase damage',
    type: 'upgrade',
    priceGems: 25,
    effect: { damage: 5 },
    maxPurchases: 10
  },
  shield_upgrade: {
    id: 'shield_upgrade',
    name: 'Max Shield +10',
    icon: '🛡️',
    description: 'Permanently increase max shield',
    type: 'upgrade',
    priceGems: 15,
    effect: { maxShield: 10 },
    maxPurchases: 10
  }
};

// ==================== BLACKSMITH ITEMS ====================
export const BLACKSMITH_ITEMS = {
  weapon_upgrade: {
    id: 'weapon_upgrade',
    name: 'Weapon Enhancement',
    icon: '🗡️',
    description: 'Increase base damage by 3',
    price: 200,
    effect: { damage: 3 }
  },
  armor_upgrade: {
    id: 'armor_upgrade',
    name: 'Armor Enhancement',
    icon: '🛡️',
    description: 'Increase max HP by 15',
    price: 300,
    effect: { maxHp: 15 }
  },
  crit_upgrade: {
    id: 'crit_upgrade',
    name: 'Sharpen Weapon',
    icon: '💎',
    description: 'Increase crit chance by 2%',
    price: 500,
    effect: { critChance: 0.02 }
  }
};

// ==================== SHOP FUNCTIONS ====================

// Buy an item from the shop
export function buyItem(itemId) {
  const item = SHOP_ITEMS[itemId];
  if (!item) {
    showToast('Item not found!', 'error');
    return false;
  }
  
  // Check currency
  if (item.priceGems) {
    if (player.gems < item.priceGems) {
      showToast('Not enough gems!', 'error');
      playSFX('error');
      return false;
    }
    player.gems -= item.priceGems;
  } else {
    if (player.coins < item.price) {
      showToast('Not enough coins!', 'error');
      playSFX('error');
      return false;
    }
    player.coins -= item.price;
  }
  
  // Apply item effect
  if (item.type === 'potion') {
    player.potions[item.potionType] = (player.potions[item.potionType] || 0) + 1;
    showToast(`Bought ${item.name}!`, 'success');
  } else if (item.type === 'upgrade') {
    if (item.effect.maxHp) player.maxHp += item.effect.maxHp;
    if (item.effect.damage) player.damage += item.effect.damage;
    if (item.effect.maxShield) player.maxShield += item.effect.maxShield;
    showToast(`Upgraded! ${item.name}`, 'success');
  }
  
  playSFX('coin');
  updateHUD();
  savePlayer();
  return true;
}

// Buy from blacksmith
export function buyBlacksmithItem(itemId) {
  const item = BLACKSMITH_ITEMS[itemId];
  if (!item) {
    showToast('Item not found!', 'error');
    return false;
  }
  
  if (player.coins < item.price) {
    showToast('Not enough coins!', 'error');
    playSFX('error');
    return false;
  }
  
  player.coins -= item.price;
  
  if (item.effect.damage) player.damage += item.effect.damage;
  if (item.effect.maxHp) player.maxHp += item.effect.maxHp;
  if (item.effect.critChance) player.critChance += item.effect.critChance;
  
  showToast(`${item.name} complete!`, 'success');
  playSFX('success');
  updateHUD();
  savePlayer();
  return true;
}

// ==================== INN FUNCTIONS ====================

// Rest at the inn
export function restAtInn() {
  const cost = 25;
  
  if (player.coins < cost) {
    showToast('Not enough coins to rest!', 'error');
    playSFX('error');
    return false;
  }
  
  player.coins -= cost;
  player.hp = player.maxHp;
  player.shield = player.maxShield;
  
  showToast('You feel fully rested!', 'success');
  playSFX('heal');
  updateHUD();
  savePlayer();
  return true;
}

// ==================== TOWN NAVIGATION ====================

let currentTown = null;
let currentLocation = null;

// Enter a town
export function enterTown(townNodeId) {
  currentTown = townNodeId;
  currentLocation = null;
  playMusic('village');
  
  // Show town interior UI
  renderTownUI(townNodeId);
}

// Enter a location within the town
export function enterLocation(locationId) {
  const location = TOWN_LOCATIONS[locationId];
  if (!location) return;
  
  // Check requirements
  if (location.requiresBoss && player.defeatedBosses.length < 1) {
    showToast('Defeat a boss to unlock the Guild Hall!', 'error');
    return;
  }
  
  currentLocation = locationId;
  
  // Play appropriate music
  if (locationId === 'shop') playMusic('shop');
  else if (locationId === 'guild_hall') playMusic('guild');
  
  // Start NPC dialogue if available
  if (location.npc && STORY_DIALOGUES[location.npc]) {
    startDialogue(STORY_DIALOGUES[location.npc]);
  }
  
  // Render location-specific UI
  renderLocationUI(locationId);
}

// Exit location back to town
export function exitLocation() {
  currentLocation = null;
  playMusic('village');
  renderTownUI(currentTown);
}

// Exit town back to map
export function exitTown() {
  currentTown = null;
  currentLocation = null;
  // Return to map (handled by main.js)
}

// ==================== UI RENDERING ====================

// Render town interior UI
function renderTownUI(townNodeId) {
  const container = document.getElementById('town-container');
  if (!container) return;
  
  const townNode = MAP_NODES[townNodeId];
  if (!townNode || !townNode.isTown) return;
  
  let html = `
    <div class="town-header">
      <h2>${townNode.name}</h2>
      <button class="btn-back" onclick="window.game.exitTown()">← Back to Map</button>
    </div>
    <div class="town-locations">
  `;
  
  (townNode.locations || []).forEach(locId => {
    const loc = TOWN_LOCATIONS[locId];
    if (!loc) return;
    
    const locked = loc.requiresBoss && player.defeatedBosses.length < 1;
    
    html += `
      <div class="town-location ${locked ? 'locked' : ''}" onclick="${locked ? '' : `window.game.enterLocation('${locId}')`}">
        <div class="location-icon">${loc.icon}</div>
        <div class="location-name">${loc.name}</div>
        <div class="location-desc">${locked ? '🔒 Defeat a boss to unlock' : loc.description}</div>
      </div>
    `;
  });
  
  html += '</div>';
  
  container.innerHTML = html;
  container.style.display = 'block';
}

// Render location-specific UI (shop, blacksmith, etc.)
function renderLocationUI(locationId) {
  const container = document.getElementById('location-container');
  if (!container) return;
  
  let html = '';
  
  switch(locationId) {
    case 'shop':
      html = renderShopUI();
      break;
    case 'blacksmith':
      html = renderBlacksmithUI();
      break;
    case 'inn':
      html = renderInnUI();
      break;
    case 'guild_hall':
      html = renderGuildUI();
      break;
    default:
      html = `
        <div class="location-header">
          <h3>${TOWN_LOCATIONS[locationId].name}</h3>
          <button class="btn-back" onclick="window.game.exitLocation()">← Back</button>
        </div>
        <p>Coming soon...</p>
      `;
  }
  
  container.innerHTML = html;
  container.style.display = 'block';
}

// Render shop UI
function renderShopUI() {
  let html = `
    <div class="location-header">
      <h3>🛒 Milo's Shop</h3>
      <div class="currency-display">
        <span>💰 ${player.coins}</span>
        <span>💎 ${player.gems}</span>
      </div>
      <button class="btn-back" onclick="window.game.exitLocation()">← Back</button>
    </div>
    <div class="shop-items">
  `;
  
  Object.values(SHOP_ITEMS).forEach(item => {
    const priceText = item.priceGems ? `💎 ${item.priceGems}` : `💰 ${item.price}`;
    const canAfford = item.priceGems ? player.gems >= item.priceGems : player.coins >= item.price;
    
    html += `
      <div class="shop-item ${canAfford ? '' : 'cannot-afford'}">
        <div class="item-icon">${item.icon}</div>
        <div class="item-info">
          <div class="item-name">${item.name}</div>
          <div class="item-desc">${item.description}</div>
        </div>
        <div class="item-price">${priceText}</div>
        <button class="btn-buy" onclick="window.game.buyItem('${item.id}')" ${canAfford ? '' : 'disabled'}>
          BUY
        </button>
      </div>
    `;
  });
  
  html += '</div>';
  return html;
}

// Render blacksmith UI
function renderBlacksmithUI() {
  let html = `
    <div class="location-header">
      <h3>⚒️ Blacksmith</h3>
      <div class="currency-display">💰 ${player.coins}</div>
      <button class="btn-back" onclick="window.game.exitLocation()">← Back</button>
    </div>
    <div class="shop-items">
  `;
  
  Object.values(BLACKSMITH_ITEMS).forEach(item => {
    const canAfford = player.coins >= item.price;
    
    html += `
      <div class="shop-item ${canAfford ? '' : 'cannot-afford'}">
        <div class="item-icon">${item.icon}</div>
        <div class="item-info">
          <div class="item-name">${item.name}</div>
          <div class="item-desc">${item.description}</div>
        </div>
        <div class="item-price">💰 ${item.price}</div>
        <button class="btn-buy" onclick="window.game.buyBlacksmithItem('${item.id}')" ${canAfford ? '' : 'disabled'}>
          FORGE
        </button>
      </div>
    `;
  });
  
  html += '</div>';
  return html;
}

// Render inn UI
function renderInnUI() {
  return `
    <div class="location-header">
      <h3>🛏️ The Wanderer's Rest</h3>
      <button class="btn-back" onclick="window.game.exitLocation()">← Back</button>
    </div>
    <div class="inn-content">
      <p>Rest here to fully restore your HP and Shield.</p>
      <p>Current HP: ${player.hp} / ${player.maxHp}</p>
      <p>Current Shield: ${player.shield} / ${player.maxShield}</p>
      <p>Cost: 💰 25</p>
      <button class="btn-primary" onclick="window.game.restAtInn()" ${player.coins >= 25 ? '' : 'disabled'}>
        REST (25 coins)
      </button>
    </div>
  `;
}

// Render guild hall UI
function renderGuildUI() {
  // Import here to avoid circular dependency
  const { getAvailableQuests, acceptQuest } = require('./guild.js');
  
  const quests = getAvailableQuests();
  
  let html = `
    <div class="location-header">
      <h3>🏛️ Adventurer's Guild</h3>
      <div class="guild-rank">Rank: ${player.guildRank} | Quests: ${player.completedQuests.length}</div>
      <button class="btn-back" onclick="window.game.exitLocation()">← Back</button>
    </div>
  `;
  
  if (!player.guildMembership) {
    html += `
      <div class="guild-notice">
        <p>Complete your first boss to become a guild member!</p>
      </div>
    `;
  } else {
    html += `
      <div class="guild-quests">
        <h4>Available Quests</h4>
    `;
    
    quests.forEach(quest => {
      html += `
        <div class="quest-card">
          <div class="quest-icon">${quest.icon}</div>
          <div class="quest-info">
            <div class="quest-name">${quest.name}</div>
            <div class="quest-desc">${quest.description}</div>
            <div class="quest-rewards">
              Rewards: 💰 ${quest.rewards.coins} | ⭐ ${quest.rewards.xp} XP
            </div>
          </div>
          <button class="btn-accept" onclick="window.game.acceptQuest('${quest.id}')">
            ACCEPT
          </button>
        </div>
      `;
    });
    
    html += '</div>';
  }
  
  return html;
}

// Import MAP_NODES for town data
import { MAP_NODES } from './story.js';
