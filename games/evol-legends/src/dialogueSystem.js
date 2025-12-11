// ==================== DIALOGUE SYSTEM MODULE ====================
// Handles all dialogue, portraits, {playerName} substitution, and story progression

import { player, getPlayerPortrait, getSpiritPortrait } from './player.js';
import { playSFX, playMusic } from './audio.js';

// Current dialogue state
let currentDialogue = [];
let currentIndex = 0;
let onDialogueComplete = null;
let isDialogueActive = false;

// Speaker portrait mappings
const SPEAKER_PORTRAITS = {
  player: () => getPlayerPortrait(),
  inner_voice: () => getSpiritPortrait(),
  spirit: () => getSpiritPortrait(),
  elder_rana: 'assets/images/portraits/mayor.svg',
  villager: 'assets/images/portraits/farmer.svg',
  villager1: 'assets/images/portraits/farmer.svg',
  villager2: 'assets/images/portraits/farmer.svg',
  lyra: 'assets/images/portraits/spirit_female.svg',
  milo: 'assets/images/portraits/shopkeeper.svg',
  shopkeeper: 'assets/images/portraits/shopkeeper.svg',
  ardin: 'assets/images/portraits/blacksmith.svg',
  trainer: 'assets/images/portraits/blacksmith.svg',
  juna: 'assets/images/portraits/farmer.svg',
  talo: 'assets/images/portraits/farmer.svg',
  guard: 'assets/images/portraits/farmer.svg',
  mayor: 'assets/images/portraits/mayor.svg',
  blacksmith: 'assets/images/portraits/blacksmith.svg',
  guild_master: 'assets/images/portraits/farmer.svg',
  farmer: 'assets/images/portraits/farmer.svg',
  unknown: 'assets/images/portraits/farmer.svg',
  guildMaster: 'assets/images/portraits/farmer.svg'
};

// Speaker display names
const SPEAKER_NAMES = {
  player: () => player.name,
  inner_voice: '???',
  spirit: 'Inner Voice',
  elder_rana: 'Elder Rana',
  villager: 'Villager',
  villager1: 'Villager',
  villager2: 'Fearful Villager',
  lyra: 'Lyra, the Scout',
  milo: 'Milo, the Shopkeeper',
  shopkeeper: 'Shopkeeper',
  ardin: 'Ardin, Weapons Trainer',
  trainer: 'Trainer',
  juna: 'Juna',
  talo: 'Talo, Village Guard',
  guard: 'Guard',
  mayor: 'Mayor',
  blacksmith: 'Blacksmith',
  guild_master: 'Guild Master',
  farmer: 'Farmer',
  unknown: '???'
};

// Get portrait for a speaker
function getPortrait(speaker) {
  const portrait = SPEAKER_PORTRAITS[speaker];
  if (typeof portrait === 'function') {
    return portrait();
  }
  return portrait || SPEAKER_PORTRAITS.unknown;
}

// Get display name for a speaker
function getSpeakerName(speaker) {
  const name = SPEAKER_NAMES[speaker];
  if (typeof name === 'function') {
    return name();
  }
  return name || speaker;
}

// Replace {playerName} and other variables in text
function processText(text) {
  return text
    .replace(/{playerName}/g, player.name)
    .replace(/{name}/g, player.name)
    .replace(/E\.Vol/g, player.name) // Replace E.Vol with player name
    .replace(/{guildRank}/g, player.guildRank)
    .replace(/{level}/g, player.level);
}

// Start a dialogue sequence
export function startDialogue(dialogueArray, onComplete = null) {
  if (!dialogueArray || dialogueArray.length === 0) return;
  
  currentDialogue = dialogueArray;
  currentIndex = 0;
  onDialogueComplete = onComplete;
  isDialogueActive = true;
  
  showDialogueBox(true);
  displayCurrentLine();
  playSFX('dialogueOpen');
}

// Display the current dialogue line
function displayCurrentLine() {
  if (currentIndex >= currentDialogue.length) {
    endDialogue();
    return;
  }
  
  const line = currentDialogue[currentIndex];
  const dialogueBox = document.getElementById('dialogue-box');
  const portrait = document.getElementById('dialogue-portrait');
  const speakerName = document.getElementById('dialogue-speaker');
  const text = document.getElementById('dialogue-text');
  const continueHint = document.getElementById('dialogue-continue');
  
  if (!dialogueBox) return;
  
  // Set portrait
  const portraitSrc = getPortrait(line.speaker);
  if (portrait) {
    portrait.src = portraitSrc;
    portrait.alt = getSpeakerName(line.speaker);
    
    // Position portrait based on speaker
    if (line.speaker === 'player') {
      portrait.classList.add('portrait-left');
      portrait.classList.remove('portrait-right');
    } else {
      portrait.classList.add('portrait-right');
      portrait.classList.remove('portrait-left');
    }
  }
  
  // Set speaker name
  if (speakerName) {
    speakerName.textContent = getSpeakerName(line.speaker);
    
    // Color based on speaker type
    if (line.speaker === 'inner_voice' || line.speaker === 'spirit') {
      speakerName.style.color = '#00ccff';
    } else if (line.speaker === 'player') {
      speakerName.style.color = '#ffff00';
    } else {
      speakerName.style.color = '#ffffff';
    }
  }
  
  // Set text with typewriter effect
  if (text) {
    const processedText = processText(line.text);
    typewriterEffect(text, processedText);
  }
  
  // Show continue hint
  if (continueHint) {
    continueHint.style.opacity = '0';
    setTimeout(() => {
      continueHint.style.opacity = '1';
    }, 500);
  }
  
  // Special handling for inner voice
  if (line.speaker === 'inner_voice' || line.speaker === 'spirit') {
    dialogueBox.classList.add('spirit-dialogue');
    playSFX('spiritVoice');
  } else {
    dialogueBox.classList.remove('spirit-dialogue');
  }
}

// Typewriter effect for text
function typewriterEffect(element, text, speed = 30) {
  element.textContent = '';
  let i = 0;
  
  function type() {
    if (i < text.length) {
      element.textContent += text.charAt(i);
      i++;
      setTimeout(type, speed);
    }
  }
  
  type();
}

// Advance to next line
export function nextDialogueLine() {
  if (!isDialogueActive) return;
  
  currentIndex++;
  playSFX('dialogueAdvance');
  displayCurrentLine();
}

// End dialogue
function endDialogue() {
  isDialogueActive = false;
  showDialogueBox(false);
  
  if (onDialogueComplete) {
    onDialogueComplete();
  }
  
  playSFX('dialogueClose');
}

// Show/hide dialogue box
function showDialogueBox(show) {
  const box = document.getElementById('dialogue-box');
  if (box) {
    box.classList.toggle('active', show);
  }
}

// Check if dialogue is currently active
export function isInDialogue() {
  return isDialogueActive;
}

// Skip to end of current dialogue
export function skipDialogue() {
  if (!isDialogueActive) return;
  
  currentIndex = currentDialogue.length;
  endDialogue();
}

// ==================== STORY DIALOGUES ====================
// These can also be loaded from JSON files

export const STORY_DIALOGUES = {
  // Intro cutscene when first arriving at village
  villageIntro: [
    {
      speaker: 'villager1',
      text: 'Is that… the amulet? The same one from the stories?'
    },
    {
      speaker: 'villager2',
      text: 'No… impossible. The Returner vanished ages ago.'
    },
    {
      speaker: 'elder_rana',
      text: 'You there. Stranger. That light around your neck… do you understand what it means?'
    },
    {
      speaker: 'player',
      text: "I don't even know who I am. I woke up in the fields… monsters everywhere. I—I think my name is {playerName}. That's all I remember."
    },
    {
      speaker: 'elder_rana',
      text: 'Then the prophecy has begun again. Come inside, child. We have much to discuss.'
    }
  ],
  
  // Elder's house dialogue
  elderHouse: [
    {
      speaker: 'elder_rana',
      text: 'That amulet you carry is older than this village. It was worn by a warrior who once protected the Forgotten City.'
    },
    {
      speaker: 'elder_rana',
      text: 'Some say he betrayed it. Others say he was betrayed.'
    },
    {
      speaker: 'player',
      text: 'And you think I\'m connected to him?'
    },
    {
      speaker: 'elder_rana',
      text: 'I do not know. But your awakening beneath the starry sky… That is exactly how the legend is said to begin.'
    },
    {
      speaker: 'player',
      text: 'So where do I go from here?'
    },
    {
      speaker: 'elder_rana',
      text: 'Follow the world\'s old routes. Retrace the steps of the Legendary One. Begin in the Sunny Fields.'
    },
    {
      speaker: 'elder_rana',
      text: 'Your answers lie far beyond this village, but every journey starts with knowing who you are today.'
    },
    {
      speaker: 'inner_voice',
      text: '…We\'ve walked these paths before… {playerName}. Keep moving… you are not alone.'
    },
    {
      speaker: 'player',
      text: 'What—who said that?'
    },
    {
      speaker: 'elder_rana',
      text: '…Said what?'
    }
  ],
  
  // Spirit's first direct conversation
  spiritIntro: [
    {
      speaker: 'inner_voice',
      text: '…I am here, {playerName}. I have always been here.'
    },
    {
      speaker: 'inner_voice',
      text: 'When you walk, I remember. When you fight, I awaken.'
    },
    {
      speaker: 'player',
      text: 'Who are you? Why can only I hear you?'
    },
    {
      speaker: 'inner_voice',
      text: 'I am bound to the amulet, and thus to you. In time, you will understand.'
    },
    {
      speaker: 'inner_voice',
      text: 'For now, trust in your instincts. They are sharper than you know.'
    }
  ],
  
  // Tutorial dialogue
  tutorial: [
    {
      speaker: 'inner_voice',
      text: 'Let me guide you, {playerName}. These basics will keep you alive.'
    },
    {
      speaker: 'inner_voice',
      text: 'Use WASD or arrow keys to move. Your body remembers this, even if your mind does not.'
    },
    {
      speaker: 'inner_voice',
      text: 'Aim with your mouse and click to attack. Each class has unique projectiles.'
    },
    {
      speaker: 'inner_voice',
      text: 'Watch your HP bar—the green one. If it empties, your journey ends.'
    },
    {
      speaker: 'inner_voice',
      text: 'The blue bar is your Shield. It absorbs damage before your health does.'
    },
    {
      speaker: 'inner_voice',
      text: 'The purple bar is your XP. Fill it to level up and grow stronger.'
    },
    {
      speaker: 'inner_voice',
      text: 'Use number keys 1-4 for potions. Q and E activate your class abilities.'
    },
    {
      speaker: 'inner_voice',
      text: 'Hover over abilities to see what they do. Knowledge is power, {playerName}.'
    },
    {
      speaker: 'inner_voice',
      text: 'Now... let us see what you are capable of.'
    }
  ],
  
  // NPC dialogues
  lyra: [
    {
      speaker: 'lyra',
      text: "I've seen that look before—confusion, fear. Don't worry. Most heroes don't start heroic."
    },
    {
      speaker: 'player',
      text: 'What do you know about the amulet?'
    },
    {
      speaker: 'lyra',
      text: 'Only that it glows when its owner is close to danger… or destiny. Sometimes both.'
    }
  ],
  
  milo: [
    {
      speaker: 'milo',
      text: 'Well! Look who wandered in! You look like a walking disaster and a shopping opportunity.'
    },
    {
      speaker: 'milo',
      text: 'Need gear? Potions? A rope to climb out of whatever hole you fell into?'
    },
    {
      speaker: 'player',
      text: 'Have you seen this amulet before?'
    },
    {
      speaker: 'milo',
      text: "Me? No way. I'd remember something that shiny. But the Elder… she's been expecting someone like you."
    }
  ],
  
  ardin: [
    {
      speaker: 'ardin',
      text: "Your stance is sloppy. Your grip is uneven. You're either inexperienced… or recovering from something."
    },
    {
      speaker: 'player',
      text: "I can't remember anything."
    },
    {
      speaker: 'ardin',
      text: "Amnesia? Hmph. Convenient excuse. Fine. I'll teach you the basics."
    },
    {
      speaker: 'ardin',
      text: 'But remember this: strength is forged, not gifted. Even for legends.'
    }
  ],
  
  juna: [
    {
      speaker: 'juna',
      text: 'Your amulet… it\'s talking. I can hear it whisper.'
    },
    {
      speaker: 'player',
      text: 'What is it saying?'
    },
    {
      speaker: 'juna',
      text: 'It\'s sad. Like it lost something precious. Maybe… you?'
    }
  ],
  
  talo: [
    {
      speaker: 'talo',
      text: "There's been movement in the Sunny Fields. Monsters acting strangely."
    },
    {
      speaker: 'talo',
      text: "If you're heading out… keep your weapon ready."
    },
    {
      speaker: 'player',
      text: 'Why are monsters acting differently?'
    },
    {
      speaker: 'talo',
      text: "No idea. But they're looking for something. Or someone."
    }
  ],
  
  // Boss dialogues
  lostHowlerIntro: [
    {
      speaker: 'inner_voice',
      text: 'Be careful, {playerName}. This creature... it was once a peaceful guardian.'
    },
    {
      speaker: 'inner_voice',
      text: 'The Howler was corrupted when darkness spread across these lands.'
    },
    {
      speaker: 'inner_voice',
      text: 'It senses the amulet and mistakes you for the one who caused its pain.'
    }
  ],
  
  lostHowlerDefeat: [
    {
      speaker: 'inner_voice',
      text: '…It remembers you… or what it thinks you were. You have calmed its rage.'
    },
    {
      speaker: 'inner_voice',
      text: 'The corruption fades... the beast can finally rest.'
    },
    {
      speaker: 'player',
      text: 'What was that thing? Why did it attack me?'
    },
    {
      speaker: 'inner_voice',
      text: 'It saw the amulet and felt only betrayal. We must uncover the truth of what happened.'
    }
  ],
  
  // Guild dialogues
  guildJoin: [
    {
      speaker: 'guild_master',
      text: 'So, you\'re the one everyone\'s talking about. The stranger with the glowing amulet.'
    },
    {
      speaker: 'guild_master',
      text: 'You\'ve proven yourself against the Howler. That takes strength.'
    },
    {
      speaker: 'guild_master',
      text: 'Welcome to the Adventurer\'s Guild, {playerName}. You start at Rank F.'
    },
    {
      speaker: 'guild_master',
      text: 'Complete quests, help the people, and your rank will rise. Higher ranks mean better rewards.'
    }
  ],
  
  // Inner voice hints during combat
  combatHints: [
    {
      speaker: 'inner_voice',
      text: 'Your stance falters. Breathe. Steady your arms. Strike with intention—not fear.'
    },
    {
      speaker: 'inner_voice',
      text: 'Watch the enemy\'s movements. Timing is your shield when strength is not.'
    },
    {
      speaker: 'inner_voice',
      text: 'Do not let the past blind you. This creature knows only suffering.'
    },
    {
      speaker: 'inner_voice',
      text: 'Focus. Dodge before the ground cracks. Now—strike!'
    }
  ],
  
  // Approaching end game
  forgottenCityApproach: [
    {
      speaker: 'inner_voice',
      text: 'I remember this place.'
    },
    {
      speaker: 'inner_voice',
      text: 'You bled here. You fought here.'
    },
    {
      speaker: 'inner_voice',
      text: 'You died here.'
    },
    {
      speaker: 'player',
      text: 'What... what are you saying?'
    },
    {
      speaker: 'inner_voice',
      text: 'The truth awaits within those walls, {playerName}. Are you ready to face it?'
    }
  ],
  
  // Final revelation
  finalRevelation: [
    {
      speaker: 'inner_voice',
      text: 'You were not the monster they feared.'
    },
    {
      speaker: 'inner_voice',
      text: 'You were the shield that broke.'
    },
    {
      speaker: 'inner_voice',
      text: 'And I… I am the part of you that could not pass on.'
    },
    {
      speaker: 'player',
      text: 'So all this time... you were me?'
    },
    {
      speaker: 'inner_voice',
      text: 'I was who you used to be. And now... you must choose who you will become.'
    }
  ]
};

// Get a random combat hint
export function getRandomCombatHint() {
  const hints = STORY_DIALOGUES.combatHints;
  return [hints[Math.floor(Math.random() * hints.length)]];
}
