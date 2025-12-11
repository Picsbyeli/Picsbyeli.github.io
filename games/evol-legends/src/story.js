// ==================== STORY MODE MODULE ====================
// Handles story progression, map nodes, and victory/unlock systems

import { player, savePlayer, updateGuildRank } from './player.js';
import { showVictoryScreen, showToast } from './ui.js';
import { startDialogue, STORY_DIALOGUES } from './dialogueSystem.js';
import { playMusic, playSFX } from './audio.js';

// ==================== MAP NODES ====================
export const MAP_NODES = {
  // BEGINNER VILLAGE - Tutorial Area
  start: {
    id: 'start',
    name: 'Beginner Village Gate',
    description: 'The entrance to a small, peaceful village. Your journey begins here.',
    type: 'tutorial',
    region: 'Beginner Village',
    difficulty: 1,
    waves: 3,
    enemies: ['slime', 'bat'],
    boss: null,
    rewards: { coins: 50, xp: 100 },
    unlocks: ['village_interior', 'sunny_fields_1'],
    requirements: [],
    isTown: false,
    music: 'village'
  },
  
  village_interior: {
    id: 'village_interior',
    name: 'Beginner Village',
    description: 'A peaceful village with shops and friendly villagers.',
    type: 'town',
    region: 'Beginner Village',
    isTown: true,
    music: 'village',
    locations: ['shop', 'blacksmith', 'inn', 'guild_hall', 'elder_house', 'training_grounds'],
    npcs: ['elder_rana', 'lyra', 'milo', 'ardin', 'juna', 'talo']
  },
  
  // SUNNY FIELDS - First Combat Area
  sunny_fields_1: {
    id: 'sunny_fields_1',
    name: 'Sunny Fields - Entrance',
    description: 'Bright meadows filled with weaker monsters.',
    type: 'combat',
    region: 'Sunny Fields',
    difficulty: 2,
    waves: 5,
    enemies: ['slime', 'bat', 'wolf'],
    boss: null,
    rewards: { coins: 100, xp: 200 },
    unlocks: ['sunny_fields_2'],
    requirements: ['start'],
    music: 'sunnyFields'
  },
  
  sunny_fields_2: {
    id: 'sunny_fields_2',
    name: 'Sunny Fields - Deep Meadow',
    description: 'Deeper into the fields. Monsters grow stronger.',
    type: 'combat',
    region: 'Sunny Fields',
    difficulty: 3,
    waves: 7,
    enemies: ['wolf', 'boar', 'goblin'],
    boss: null,
    rewards: { coins: 150, xp: 300 },
    unlocks: ['sunny_fields_boss'],
    requirements: ['sunny_fields_1'],
    music: 'sunnyFields'
  },
  
  sunny_fields_boss: {
    id: 'sunny_fields_boss',
    name: 'The Howler\'s Den',
    description: 'A corrupted beast lurks here, sensing your amulet.',
    type: 'boss',
    region: 'Sunny Fields',
    difficulty: 5,
    waves: 1,
    enemies: [],
    boss: 'lost_howler',
    rewards: { coins: 500, xp: 1000, gems: 10, classUnlock: 'Mage' },
    unlocks: ['crimson_forest_1', 'village_interior_full'],
    requirements: ['sunny_fields_2'],
    music: 'boss',
    introDialogue: 'lostHowlerIntro',
    defeatDialogue: 'lostHowlerDefeat'
  },
  
  // CRIMSON FOREST
  crimson_forest_1: {
    id: 'crimson_forest_1',
    name: 'Crimson Forest - Edge',
    description: 'A dark forest with blood-red leaves. Something watches.',
    type: 'combat',
    region: 'Crimson Forest',
    difficulty: 6,
    waves: 8,
    enemies: ['dark_wolf', 'spider', 'treant'],
    boss: null,
    rewards: { coins: 200, xp: 400 },
    unlocks: ['crimson_forest_2'],
    requirements: ['sunny_fields_boss'],
    music: 'crimsonForest'
  },
  
  crimson_forest_2: {
    id: 'crimson_forest_2',
    name: 'Crimson Forest - Heart',
    description: 'The heart of the forest. Shadows move between the trees.',
    type: 'combat',
    region: 'Crimson Forest',
    difficulty: 7,
    waves: 10,
    enemies: ['shadow_wolf', 'giant_spider', 'corrupted_treant'],
    boss: null,
    rewards: { coins: 300, xp: 600 },
    unlocks: ['crimson_forest_boss'],
    requirements: ['crimson_forest_1'],
    music: 'crimsonForest'
  },
  
  crimson_forest_boss: {
    id: 'crimson_forest_boss',
    name: 'Warden\'s Hollow',
    description: 'A phantom born from your forgotten memories awaits.',
    type: 'boss',
    region: 'Crimson Forest',
    difficulty: 8,
    waves: 1,
    enemies: [],
    boss: 'crimson_warden',
    rewards: { coins: 750, xp: 1500, gems: 20, keyShard: 'forest' },
    unlocks: ['crystal_caves_1', 'abyssal_ruins_1'],
    requirements: ['crimson_forest_2'],
    music: 'boss'
  },
  
  // CRYSTAL CAVES PATH
  crystal_caves_1: {
    id: 'crystal_caves_1',
    name: 'Crystal Caves - Entrance',
    description: 'Glittering caves filled with crystalline creatures.',
    type: 'combat',
    region: 'Crystal Caves',
    difficulty: 9,
    waves: 10,
    enemies: ['crystal_bat', 'gem_golem', 'cave_spider'],
    boss: null,
    rewards: { coins: 400, xp: 800 },
    unlocks: ['crystal_caves_boss'],
    requirements: ['crimson_forest_boss'],
    music: 'crystalCaves'
  },
  
  crystal_caves_boss: {
    id: 'crystal_caves_boss',
    name: 'Leviathan\'s Sanctum',
    description: 'A massive crystalline serpent guards the Crystal Key.',
    type: 'boss',
    region: 'Crystal Caves',
    difficulty: 12,
    waves: 1,
    enemies: [],
    boss: 'crystal_leviathan',
    rewards: { coins: 1000, xp: 2000, gems: 30, keyShard: 'crystal' },
    unlocks: ['volcano_1'],
    requirements: ['crystal_caves_1'],
    music: 'boss'
  },
  
  // ABYSSAL RUINS PATH (Alternative to Crystal Caves)
  abyssal_ruins_1: {
    id: 'abyssal_ruins_1',
    name: 'Abyssal Ruins - Outer Ring',
    description: 'Drowned ruins of an ancient civilization.',
    type: 'combat',
    region: 'Abyssal Ruins',
    difficulty: 9,
    waves: 10,
    enemies: ['drowned_zombie', 'sea_wraith', 'abyssal_crab'],
    boss: null,
    rewards: { coins: 400, xp: 800 },
    unlocks: ['abyssal_ruins_boss'],
    requirements: ['crimson_forest_boss'],
    music: 'crystalCaves'
  },
  
  abyssal_ruins_boss: {
    id: 'abyssal_ruins_boss',
    name: 'The Sunken Throne',
    description: 'A drowned king twisted by curses seeks vengeance.',
    type: 'boss',
    region: 'Abyssal Ruins',
    difficulty: 12,
    waves: 1,
    enemies: [],
    boss: 'abyssal_harrow',
    rewards: { coins: 1000, xp: 2000, gems: 30, keyShard: 'abyss' },
    unlocks: ['volcano_1'],
    requirements: ['abyssal_ruins_1'],
    music: 'boss'
  },
  
  // VOLCANO PATH
  volcano_1: {
    id: 'volcano_1',
    name: 'Volcanic Wastes',
    description: 'Scorched lands leading to an active volcano.',
    type: 'combat',
    region: 'Volcano',
    difficulty: 13,
    waves: 12,
    enemies: ['fire_elemental', 'lava_golem', 'magma_worm'],
    boss: null,
    rewards: { coins: 600, xp: 1200 },
    unlocks: ['volcano_boss'],
    requirements: ['crystal_caves_boss', 'abyssal_ruins_boss'],
    requiresAny: true,
    music: 'volcano'
  },
  
  volcano_boss: {
    id: 'volcano_boss',
    name: 'Titan\'s Forge',
    description: 'A magma giant forged to protect the ancient sigils.',
    type: 'boss',
    region: 'Volcano',
    difficulty: 15,
    waves: 1,
    enemies: [],
    boss: 'ember_titan',
    rewards: { coins: 1500, xp: 3000, gems: 50, classUnlock: 'Tank' },
    unlocks: ['mountain_1'],
    requirements: ['volcano_1'],
    music: 'boss'
  },
  
  // MOUNTAIN PATH
  mountain_1: {
    id: 'mountain_1',
    name: 'Frozen Peaks',
    description: 'Treacherous mountain paths covered in ice.',
    type: 'combat',
    region: 'Mountains',
    difficulty: 16,
    waves: 15,
    enemies: ['ice_wolf', 'frost_giant', 'snow_harpy'],
    boss: null,
    rewards: { coins: 800, xp: 1600 },
    unlocks: ['mountain_boss'],
    requirements: ['volcano_boss'],
    music: 'mountains'
  },
  
  mountain_boss: {
    id: 'mountain_boss',
    name: 'Sentinel\'s Summit',
    description: 'A spiritual guardian tests your truth and identity.',
    type: 'boss',
    region: 'Mountains',
    difficulty: 18,
    waves: 1,
    enemies: [],
    boss: 'mountain_sentinel',
    rewards: { coins: 2000, xp: 4000, gems: 75, keyShard: 'mountain' },
    unlocks: ['forgotten_city_gate'],
    requirements: ['mountain_1'],
    music: 'boss'
  },
  
  // FORGOTTEN CITY - Final Area
  forgotten_city_gate: {
    id: 'forgotten_city_gate',
    name: 'Forgotten City - Gates',
    description: 'The ancient gates to a city erased from memory.',
    type: 'combat',
    region: 'Forgotten City',
    difficulty: 20,
    waves: 15,
    enemies: ['memory_wraith', 'forgotten_soldier', 'void_stalker'],
    boss: null,
    rewards: { coins: 1000, xp: 2000 },
    unlocks: ['forgotten_city_final'],
    requirements: ['mountain_boss'],
    keyShards: ['crystal', 'mountain'], // or ['abyss', 'mountain']
    music: 'forgottenCity'
  },
  
  forgotten_city_final: {
    id: 'forgotten_city_final',
    name: 'The Memory Throne',
    description: 'The final confrontation. All answers await here.',
    type: 'boss',
    region: 'Forgotten City',
    difficulty: 25,
    waves: 1,
    enemies: [],
    boss: 'memory_devourer',
    rewards: { coins: 5000, xp: 10000, gems: 200, classUnlock: 'EvolLegend' },
    unlocks: ['new_game_plus'],
    requirements: ['forgotten_city_gate'],
    music: 'boss',
    isFinalBoss: true
  }
};

// ==================== STORY PROGRESSION ====================

// Check if a node is available to play
export function isNodeUnlocked(nodeId) {
  return player.unlockedNodes.includes(nodeId);
}

// Check if a node is completed
export function isNodeCompleted(nodeId) {
  return player.completedNodes.includes(nodeId);
}

// Get available nodes
export function getAvailableNodes() {
  return Object.values(MAP_NODES).filter(node => isNodeUnlocked(node.id));
}

// Get node by ID
export function getNode(nodeId) {
  return MAP_NODES[nodeId];
}

// Start a story node
export function startNode(nodeId) {
  const node = MAP_NODES[nodeId];
  if (!node) return null;
  
  // Check requirements
  if (!isNodeUnlocked(nodeId)) {
    showToast('This area is locked!', 'error');
    return null;
  }
  
  // Play appropriate music
  if (node.music) {
    playMusic(node.music);
  }
  
  // Show intro dialogue if boss fight
  if (node.introDialogue && STORY_DIALOGUES[node.introDialogue]) {
    startDialogue(STORY_DIALOGUES[node.introDialogue]);
  }
  
  return node;
}

// Complete a story node
export function completeNode(nodeId, results) {
  const node = MAP_NODES[nodeId];
  if (!node) return;
  
  // Mark as completed
  if (!player.completedNodes.includes(nodeId)) {
    player.completedNodes.push(nodeId);
  }
  
  // Add rewards
  if (node.rewards) {
    player.coins += node.rewards.coins || 0;
    player.gems += node.rewards.gems || 0;
    player.totalCoinsEarned += node.rewards.coins || 0;
    
    // XP and level up
    const levelsGained = addXP(node.rewards.xp || 0);
    if (levelsGained > 0) {
      playSFX('levelUp');
    }
    
    // Class unlock
    if (node.rewards.classUnlock) {
      if (!player.unlockedClasses.includes(node.rewards.classUnlock)) {
        player.unlockedClasses.push(node.rewards.classUnlock);
        showToast(`New class unlocked: ${node.rewards.classUnlock}!`, 'success');
      }
    }
    
    // Key shard
    if (node.rewards.keyShard) {
      player.keyShards = player.keyShards || {};
      player.keyShards[node.rewards.keyShard] = true;
    }
  }
  
  // Unlock new nodes
  if (node.unlocks) {
    node.unlocks.forEach(unlockId => {
      if (!player.unlockedNodes.includes(unlockId)) {
        player.unlockedNodes.push(unlockId);
      }
    });
  }
  
  // Track boss defeat
  if (node.boss) {
    if (!player.defeatedBosses.includes(node.boss)) {
      player.defeatedBosses.push(node.boss);
      player.bossKills++;
      playSFX('bossDefeat');
    }
    
    // Show defeat dialogue
    if (node.defeatDialogue && STORY_DIALOGUES[node.defeatDialogue]) {
      setTimeout(() => {
        startDialogue(STORY_DIALOGUES[node.defeatDialogue]);
      }, 1000);
    }
  }
  
  // Update guild rank
  updateGuildRank();
  
  // Calculate story progress
  const totalNodes = Object.keys(MAP_NODES).filter(k => MAP_NODES[k].type !== 'town').length;
  player.storyProgress = (player.completedNodes.length / totalNodes) * 100;
  
  // Show victory screen
  const drops = [];
  if (node.rewards.classUnlock) drops.push(`🎭 ${node.rewards.classUnlock} Class`);
  if (node.rewards.keyShard) drops.push(`🔑 ${node.rewards.keyShard} Key Shard`);
  if (node.rewards.gems) drops.push(`💎 ${node.rewards.gems} Gems`);
  
  showVictoryScreen({
    waves: results.waves || node.waves,
    kills: results.kills || 0,
    coins: node.rewards.coins,
    xp: node.rewards.xp,
    drops: drops
  });
  
  // Play victory music
  playMusic('victory', false);
  
  // Save progress
  savePlayer();
  
  return true;
}

// Import addXP from player module
import { addXP } from './player.js';

// ==================== TOWN SYSTEM ====================

// Get town locations for a town node
export function getTownLocations(townNodeId) {
  const node = MAP_NODES[townNodeId];
  if (!node || !node.isTown) return [];
  
  return node.locations || [];
}

// Get NPCs in a town
export function getTownNPCs(townNodeId) {
  const node = MAP_NODES[townNodeId];
  if (!node || !node.isTown) return [];
  
  return node.npcs || [];
}

// Check if guild hall is unlocked (after first boss)
export function isGuildUnlocked() {
  return player.defeatedBosses.length >= 1;
}

// Check if player has guild membership
export function hasGuildMembership() {
  return player.guildMembership;
}
