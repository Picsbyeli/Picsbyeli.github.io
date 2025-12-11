// ==================== PLAYER MODULE ====================
// Handles player state, character selection, stats, and guild rank

export const player = {
  name: "",
  avatar: "boy", // "boy" or "girl"
  spirit: "female", // opposite of avatar - "male" or "female"
  hp: 100,
  maxHp: 100,
  shield: 0,
  maxShield: 50,
  xp: 0,
  xpToNext: 100,
  level: 1,
  coins: 0,
  gems: 0,
  guildRank: "F",
  guildMembership: false,
  selectedClass: "Hunter",
  
  // Combat stats
  damage: 10,
  attackSpeed: 1,
  critChance: 0.05,
  critMultiplier: 2,
  lifesteal: 0,
  
  // Position (for gameplay)
  x: 600,
  y: 350,
  w: 40,
  h: 40,
  alive: true,
  invincible: false,
  
  // Inventory
  potions: {
    heal: 3,
    shield: 2,
    crit: 1,
    damage: 1,
    speed: 1,
    dragon: 0
  },
  
  // Progress tracking
  completedNodes: [],
  unlockedNodes: ["start"],
  completedQuests: [],
  defeatedBosses: [],
  unlockedClasses: ["Hunter", "Knight", "Thief"],
  
  // Stats for achievements
  totalKills: 0,
  bossKills: 0,
  highestWave: 1,
  highestCombo: 0,
  totalCoinsEarned: 0
};

// Guild ranks in order
export const GUILD_RANKS = ["F", "E", "D", "C", "B", "A", "S"];

// Initialize player with name and avatar choice
export function initPlayer(name, avatar) {
  player.name = name || "Legend";
  player.avatar = avatar;
  // Spirit is opposite gender to guide the player
  player.spirit = avatar === "boy" ? "female" : "male";
  
  // Reset stats
  player.hp = player.maxHp;
  player.shield = 0;
  player.xp = 0;
  player.level = 1;
  player.coins = 0;
  player.gems = 0;
  player.guildRank = "F";
  player.guildMembership = false;
  player.alive = true;
  
  console.log(`Player initialized: ${player.name}, Avatar: ${player.avatar}, Spirit: ${player.spirit}`);
}

// Get player portrait path based on avatar
export function getPlayerPortrait() {
  return player.avatar === "boy" 
    ? "assets/images/portraits/player_boy.svg"
    : "assets/images/portraits/player_girl.svg";
}

// Get spirit portrait path based on spirit type
export function getSpiritPortrait() {
  return player.spirit === "female"
    ? "assets/images/portraits/spirit_female.svg"
    : "assets/images/portraits/spirit_male.svg";
}

// Level up the player
export function levelUp() {
  player.level++;
  player.xpToNext = Math.floor(100 * Math.pow(player.level, 1.5));
  player.maxHp += 10;
  player.hp = player.maxHp;
  player.damage += 2;
  
  return {
    newLevel: player.level,
    newMaxHp: player.maxHp,
    newDamage: player.damage
  };
}

// Add XP and check for level up
export function addXP(amount) {
  player.xp += amount;
  let levelsGained = 0;
  
  while (player.xp >= player.xpToNext) {
    player.xp -= player.xpToNext;
    levelUp();
    levelsGained++;
  }
  
  return levelsGained;
}

// Update guild rank based on completed quests
export function updateGuildRank() {
  const completed = player.completedQuests.length;
  
  // First quest + first boss = membership
  if (!player.guildMembership && completed >= 1 && player.defeatedBosses.length >= 1) {
    player.guildMembership = true;
  }
  
  // Rank progression
  if (completed >= 25) player.guildRank = "S";
  else if (completed >= 18) player.guildRank = "A";
  else if (completed >= 12) player.guildRank = "B";
  else if (completed >= 8) player.guildRank = "C";
  else if (completed >= 5) player.guildRank = "D";
  else if (completed >= 2) player.guildRank = "E";
  else player.guildRank = "F";
  
  return player.guildRank;
}

// Save player data to localStorage
export function savePlayer() {
  const saveData = {
    name: player.name,
    avatar: player.avatar,
    spirit: player.spirit,
    level: player.level,
    xp: player.xp,
    coins: player.coins,
    gems: player.gems,
    guildRank: player.guildRank,
    guildMembership: player.guildMembership,
    selectedClass: player.selectedClass,
    maxHp: player.maxHp,
    maxShield: player.maxShield,
    damage: player.damage,
    potions: player.potions,
    completedNodes: player.completedNodes,
    unlockedNodes: player.unlockedNodes,
    completedQuests: player.completedQuests,
    defeatedBosses: player.defeatedBosses,
    unlockedClasses: player.unlockedClasses,
    totalKills: player.totalKills,
    bossKills: player.bossKills,
    highestWave: player.highestWave,
    highestCombo: player.highestCombo,
    totalCoinsEarned: player.totalCoinsEarned
  };
  
  localStorage.setItem("evolLegendsPlayer", JSON.stringify(saveData));
}

// Load player data from localStorage
export function loadPlayer() {
  const saved = localStorage.getItem("evolLegendsPlayer");
  if (saved) {
    const data = JSON.parse(saved);
    Object.assign(player, data);
    return true;
  }
  return false;
}

// Check if player has save data
export function hasSaveData() {
  return localStorage.getItem("evolLegendsPlayer") !== null;
}

// Reset player to defaults
export function resetPlayer() {
  localStorage.removeItem("evolLegendsPlayer");
  Object.assign(player, {
    name: "",
    avatar: "boy",
    spirit: "female",
    hp: 100,
    maxHp: 100,
    shield: 0,
    maxShield: 50,
    xp: 0,
    xpToNext: 100,
    level: 1,
    coins: 0,
    gems: 0,
    guildRank: "F",
    guildMembership: false,
    selectedClass: "Hunter",
    completedNodes: [],
    unlockedNodes: ["start"],
    completedQuests: [],
    defeatedBosses: [],
    unlockedClasses: ["Hunter", "Knight", "Thief"]
  });
}
