// ==================== GUILD MODULE ====================
// Handles guild membership, quests, ranks, and rewards

import { player, savePlayer, updateGuildRank, GUILD_RANKS } from './player.js';
import { showToast, updateHUD } from './ui.js';
import { startDialogue, STORY_DIALOGUES } from './dialogueSystem.js';
import { playSFX } from './audio.js';

// ==================== QUEST DEFINITIONS ====================
export const QUESTS = {
  // RANK F QUESTS (Beginner)
  q_kill_slimes: {
    id: 'q_kill_slimes',
    name: 'Slime Extermination',
    icon: '🟢',
    description: 'Defeat 10 slimes in the Sunny Fields.',
    rank: 'F',
    type: 'kill',
    target: 'slime',
    amount: 10,
    rewards: { coins: 100, xp: 200 }
  },
  q_explore_fields: {
    id: 'q_explore_fields',
    name: 'Field Survey',
    icon: '🗺️',
    description: 'Complete Sunny Fields - Entrance.',
    rank: 'F',
    type: 'complete_node',
    target: 'sunny_fields_1',
    rewards: { coins: 150, xp: 250 }
  },
  q_gather_herbs: {
    id: 'q_gather_herbs',
    name: 'Herb Gathering',
    icon: '🌿',
    description: 'Collect 5 healing herbs (defeat plant enemies).',
    rank: 'F',
    type: 'kill',
    target: 'plant',
    amount: 5,
    rewards: { coins: 75, xp: 150, items: { heal_potion: 2 } }
  },
  
  // RANK E QUESTS
  q_wolf_hunt: {
    id: 'q_wolf_hunt',
    name: 'Wolf Pack Threat',
    icon: '🐺',
    description: 'Eliminate 15 wolves terrorizing the fields.',
    rank: 'E',
    type: 'kill',
    target: 'wolf',
    amount: 15,
    rewards: { coins: 200, xp: 400 }
  },
  q_goblin_camp: {
    id: 'q_goblin_camp',
    name: 'Goblin Menace',
    icon: '👺',
    description: 'Clear out 20 goblins from the area.',
    rank: 'E',
    type: 'kill',
    target: 'goblin',
    amount: 20,
    rewards: { coins: 250, xp: 500, gems: 5 }
  },
  
  // RANK D QUESTS
  q_forest_patrol: {
    id: 'q_forest_patrol',
    name: 'Crimson Forest Patrol',
    icon: '🌲',
    description: 'Complete the Crimson Forest - Edge area.',
    rank: 'D',
    type: 'complete_node',
    target: 'crimson_forest_1',
    rewards: { coins: 400, xp: 800, gems: 10 }
  },
  q_spider_nest: {
    id: 'q_spider_nest',
    name: 'Spider Nest Destruction',
    icon: '🕷️',
    description: 'Kill 25 spiders in the Crimson Forest.',
    rank: 'D',
    type: 'kill',
    target: 'spider',
    amount: 25,
    rewards: { coins: 350, xp: 700 }
  },
  
  // RANK C QUESTS
  q_crystal_expedition: {
    id: 'q_crystal_expedition',
    name: 'Crystal Cave Expedition',
    icon: '💎',
    description: 'Complete the Crystal Caves entrance.',
    rank: 'C',
    type: 'complete_node',
    target: 'crystal_caves_1',
    rewards: { coins: 600, xp: 1200, gems: 20 }
  },
  q_boss_hunter_1: {
    id: 'q_boss_hunter_1',
    name: 'Boss Hunter I',
    icon: '👹',
    description: 'Defeat 3 different bosses.',
    rank: 'C',
    type: 'boss_count',
    amount: 3,
    rewards: { coins: 1000, xp: 2000, gems: 30 }
  },
  
  // RANK B QUESTS
  q_volcano_survey: {
    id: 'q_volcano_survey',
    name: 'Volcanic Survey',
    icon: '🌋',
    description: 'Complete the Volcanic Wastes.',
    rank: 'B',
    type: 'complete_node',
    target: 'volcano_1',
    rewards: { coins: 1000, xp: 2000, gems: 40 }
  },
  q_elite_slayer: {
    id: 'q_elite_slayer',
    name: 'Elite Slayer',
    icon: '⚔️',
    description: 'Kill 100 enemies of any type.',
    rank: 'B',
    type: 'total_kills',
    amount: 100,
    rewards: { coins: 800, xp: 1600, gems: 25 }
  },
  
  // RANK A QUESTS
  q_mountain_conquest: {
    id: 'q_mountain_conquest',
    name: 'Mountain Conquest',
    icon: '🏔️',
    description: 'Defeat the Mountain Sentinel.',
    rank: 'A',
    type: 'defeat_boss',
    target: 'mountain_sentinel',
    rewards: { coins: 2000, xp: 4000, gems: 75 }
  },
  q_master_slayer: {
    id: 'q_master_slayer',
    name: 'Master Slayer',
    icon: '💀',
    description: 'Kill 500 enemies total.',
    rank: 'A',
    type: 'total_kills',
    amount: 500,
    rewards: { coins: 2500, xp: 5000, gems: 100 }
  },
  
  // RANK S QUESTS
  q_legend_awakens: {
    id: 'q_legend_awakens',
    name: 'The Legend Awakens',
    icon: '🌟',
    description: 'Defeat the Memory Devourer and uncover your past.',
    rank: 'S',
    type: 'defeat_boss',
    target: 'memory_devourer',
    rewards: { coins: 10000, xp: 20000, gems: 500, classUnlock: 'EvolLegend' }
  },
  q_true_legend: {
    id: 'q_true_legend',
    name: 'True Legend',
    icon: '👑',
    description: 'Defeat all bosses and complete the main story.',
    rank: 'S',
    type: 'complete_all_bosses',
    rewards: { coins: 25000, xp: 50000, gems: 1000 }
  }
};

// Active quests the player has accepted
let activeQuests = [];
let questProgress = {};

// ==================== QUEST FUNCTIONS ====================

// Get quests available for player's current rank
export function getAvailableQuests() {
  const rankIndex = GUILD_RANKS.indexOf(player.guildRank);
  
  return Object.values(QUESTS).filter(quest => {
    // Check rank requirement
    const questRankIndex = GUILD_RANKS.indexOf(quest.rank);
    if (questRankIndex > rankIndex + 1) return false; // Can only see one rank above
    
    // Check if already completed
    if (player.completedQuests.includes(quest.id)) return false;
    
    // Check if already active
    if (activeQuests.includes(quest.id)) return false;
    
    return true;
  });
}

// Accept a quest
export function acceptQuest(questId) {
  const quest = QUESTS[questId];
  if (!quest) {
    showToast('Quest not found!', 'error');
    return false;
  }
  
  // Check if player can accept more quests
  if (activeQuests.length >= 3) {
    showToast('You can only have 3 active quests!', 'error');
    return false;
  }
  
  activeQuests.push(questId);
  questProgress[questId] = 0;
  
  showToast(`Quest accepted: ${quest.name}`, 'success');
  playSFX('success');
  savePlayer();
  
  return true;
}

// Update quest progress
export function updateQuestProgress(type, target, amount = 1) {
  activeQuests.forEach(questId => {
    const quest = QUESTS[questId];
    if (!quest) return;
    
    let shouldUpdate = false;
    
    switch(quest.type) {
      case 'kill':
        if (type === 'kill' && target === quest.target) shouldUpdate = true;
        break;
      case 'complete_node':
        if (type === 'complete_node' && target === quest.target) shouldUpdate = true;
        break;
      case 'defeat_boss':
        if (type === 'defeat_boss' && target === quest.target) shouldUpdate = true;
        break;
      case 'total_kills':
        if (type === 'kill') shouldUpdate = true;
        break;
      case 'boss_count':
        if (type === 'defeat_boss') shouldUpdate = true;
        break;
    }
    
    if (shouldUpdate) {
      questProgress[questId] = (questProgress[questId] || 0) + amount;
      
      // Check if quest is complete
      if (quest.amount && questProgress[questId] >= quest.amount) {
        completeQuest(questId);
      } else if (!quest.amount) {
        // Single-target quests
        completeQuest(questId);
      }
    }
  });
}

// Complete a quest
export function completeQuest(questId) {
  const quest = QUESTS[questId];
  if (!quest) return;
  
  // Remove from active
  activeQuests = activeQuests.filter(id => id !== questId);
  delete questProgress[questId];
  
  // Add to completed
  if (!player.completedQuests.includes(questId)) {
    player.completedQuests.push(questId);
  }
  
  // Give rewards
  if (quest.rewards) {
    player.coins += quest.rewards.coins || 0;
    player.gems += quest.rewards.gems || 0;
    player.totalCoinsEarned += quest.rewards.coins || 0;
    
    // XP
    if (quest.rewards.xp) {
      // Would call addXP here
    }
    
    // Class unlock
    if (quest.rewards.classUnlock) {
      if (!player.unlockedClasses.includes(quest.rewards.classUnlock)) {
        player.unlockedClasses.push(quest.rewards.classUnlock);
        showToast(`Unlocked class: ${quest.rewards.classUnlock}!`, 'success');
      }
    }
    
    // Items
    if (quest.rewards.items) {
      Object.entries(quest.rewards.items).forEach(([itemType, amount]) => {
        player.potions[itemType] = (player.potions[itemType] || 0) + amount;
      });
    }
  }
  
  // Update guild rank
  updateGuildRank();
  
  showToast(`Quest completed: ${quest.name}!`, 'success');
  playSFX('levelUp');
  
  // Show guild dialogue on first quest
  if (player.completedQuests.length === 1 && player.guildMembership) {
    setTimeout(() => {
      startDialogue(STORY_DIALOGUES.guildJoin);
    }, 1000);
  }
  
  savePlayer();
  updateHUD();
}

// Get active quests
export function getActiveQuests() {
  return activeQuests.map(id => ({
    ...QUESTS[id],
    progress: questProgress[id] || 0
  }));
}

// Abandon a quest
export function abandonQuest(questId) {
  activeQuests = activeQuests.filter(id => id !== questId);
  delete questProgress[questId];
  
  showToast('Quest abandoned.', 'info');
  savePlayer();
}

// Check if player meets rank requirement for quest
export function canAcceptQuest(questId) {
  const quest = QUESTS[questId];
  if (!quest) return false;
  
  const playerRankIndex = GUILD_RANKS.indexOf(player.guildRank);
  const questRankIndex = GUILD_RANKS.indexOf(quest.rank);
  
  // Can accept quests up to one rank above current
  return questRankIndex <= playerRankIndex + 1;
}

// Get quest by ID
export function getQuest(questId) {
  return QUESTS[questId];
}

// Save/load quest state
export function saveQuestState() {
  return {
    activeQuests,
    questProgress
  };
}

export function loadQuestState(state) {
  if (state) {
    activeQuests = state.activeQuests || [];
    questProgress = state.questProgress || {};
  }
}

// ==================== GUILD UI HELPERS ====================

// Get rank color
export function getRankColor(rank) {
  const colors = {
    'F': '#888888',
    'E': '#44aa44',
    'D': '#4488ff',
    'C': '#aa44aa',
    'B': '#ff8800',
    'A': '#ff4444',
    'S': '#ffdd00'
  };
  return colors[rank] || '#ffffff';
}

// Get rank title
export function getRankTitle(rank) {
  const titles = {
    'F': 'Novice',
    'E': 'Apprentice',
    'D': 'Journeyman',
    'C': 'Expert',
    'B': 'Veteran',
    'A': 'Elite',
    'S': 'Legend'
  };
  return titles[rank] || 'Unknown';
}

// Get quests needed for next rank
export function getQuestsForNextRank() {
  const currentIndex = GUILD_RANKS.indexOf(player.guildRank);
  const thresholds = [0, 2, 5, 8, 12, 18, 25];
  
  if (currentIndex >= GUILD_RANKS.length - 1) return 0;
  
  return thresholds[currentIndex + 1] - player.completedQuests.length;
}
