// scripts/questions-riddles.js
// Riddles database by category and difficulty

window.riddlesData = {
  logic: {
    easy: [
      {
        riddle: "What comes once in a minute, twice in a moment, but never in a thousand years?",
        answer: "the letter m",
        acceptedAnswers: ["m", "letter m", "the letter m"],
        hints: [
          "Think about the words in the riddle itself.",
          "Look at the letters that make up each word.",
          "Count the letter 'M' in 'minute', 'moment', and 'thousand years'."
        ],
        category: "logic",
        difficulty: "easy"
      },
      {
        riddle: "I'm tall when I'm young, and I'm short when I'm old. What am I?",
        answer: "candle",
        acceptedAnswers: ["candle", "a candle"],
        hints: [
          "This object changes size as it's used.",
          "It provides light and gets shorter over time.",
          "You light it with a match and it melts as it burns."
        ],
        category: "logic",
        difficulty: "easy"
      },
      {
        riddle: "What has keys but no locks, space but no room, you can enter but not go inside?",
        answer: "keyboard",
        acceptedAnswers: ["keyboard", "a keyboard", "computer keyboard"],
        hints: [
          "This is something you use with technology.",
          "It has an 'Enter' key and a 'Space' bar.",
          "You press its keys to type letters and numbers on a computer."
        ],
        category: "logic",
        difficulty: "easy"
      },
      {
        riddle: "What gets wet while drying?",
        answer: "towel",
        acceptedAnswers: ["towel", "a towel"],
        hints: [
          "This item is used in bathrooms.",
          "It absorbs moisture from something else while becoming moist itself.",
          "You use it after a shower to dry your body."
        ],
        category: "logic",
        difficulty: "easy"
      }
    ],
    medium: [
      {
        riddle: "The more you take, the more you leave behind. What am I?",
        answer: "footsteps",
        acceptedAnswers: ["footsteps", "steps", "footprints"],
        hints: [
          "This relates to movement and travel.",
          "Every time you do this action, you create evidence of it.",
          "When you walk, you take these and leave traces behind."
        ],
        category: "logic",
        difficulty: "medium"
      },
      {
        riddle: "I have cities, but no houses. I have mountains, but no trees. I have water, but no fish. What am I?",
        answer: "map",
        acceptedAnswers: ["map", "a map"],
        hints: [
          "This is a flat representation of something three-dimensional.",
          "It shows geographical features but not living things.",
          "You unfold this to find directions and plan routes."
        ],
        category: "logic",
        difficulty: "medium"
      },
      {
        riddle: "What breaks but never falls, and what falls but never breaks?",
        answer: "day breaks and night falls",
        acceptedAnswers: ["day and night", "day breaks night falls", "dawn and dusk"],
        hints: [
          "These are two opposite things that happen every day.",
          "One happens in the morning, the other in the evening.",
          "Think about sunrise (dawn ____) and sunset (night ____)"
        ],
        category: "logic",
        difficulty: "medium"
      },
      {
        riddle: "Forward I am heavy, but backward I am not. What am I?",
        answer: "ton",
        acceptedAnswers: ["ton", "the word ton"],
        hints: [
          "This is a wordplay riddle about spelling.",
          "Think about what this word means forward vs backward.",
          "The word 'TON' spelled backward is 'NOT'."
        ],
        category: "logic",
        difficulty: "medium"
      }
    ],
    hard: [
      {
        riddle: "A man lives on the twentieth floor of an apartment building. Every morning he takes the elevator down to the ground floor. When he comes home, he takes the elevator to the tenth floor and walks the rest of the way... except on rainy days, when he takes the elevator all the way to the twentieth floor. Why?",
        answer: "he is too short to reach the button",
        acceptedAnswers: ["he's short", "he can't reach the button", "too short", "short person", "he's too short to reach"],
        hint: "Think about his physical limitations and what changes on rainy days.",
        category: "logic",
        difficulty: "hard"
      },
      {
        riddle: "A woman shoots her husband, then holds him underwater for five minutes. Next, she hangs him. Right after, they enjoy a lovely dinner. How?",
        answer: "she's a photographer",
        acceptedAnswers: ["photographer", "she's a photographer", "photography", "developing photos"],
        hint: "Think about a profession that involves 'shooting', 'developing', and 'hanging'.",
        category: "logic",
        difficulty: "hard"
      }
    ]
  },
  word: {
    easy: [
      {
        riddle: "What word becomes shorter when you add two letters to it?",
        answer: "short",
        acceptedAnswers: ["short", "the word short"],
        hint: "Add 'er' to the end.",
        category: "word",
        difficulty: "easy"
      },
      {
        riddle: "What 5-letter word typed in all capital letters can be read the same upside down?",
        answer: "swims",
        acceptedAnswers: ["swims"],
        hint: "When rotated 180 degrees, it looks the same.",
        category: "word",
        difficulty: "easy"
      },
      {
        riddle: "What word is spelled wrong in the dictionary?",
        answer: "wrong",
        acceptedAnswers: ["wrong", "the word wrong"],
        hint: "It's literally in the question.",
        category: "word",
        difficulty: "easy"
      }
    ],
    medium: [
      {
        riddle: "I am a word of letters three. Add two and fewer there will be. What word am I?",
        answer: "few",
        acceptedAnswers: ["few", "the word few"],
        hint: "Adding 'er' makes it mean 'less'.",
        category: "word",
        difficulty: "medium"
      },
      {
        riddle: "What English word retains the same pronunciation, even after you take away four of its five letters?",
        answer: "queue",
        acceptedAnswers: ["queue"],
        hint: "It sounds like a single letter.",
        category: "word",
        difficulty: "medium"
      }
    ],
    hard: [
      {
        riddle: "What seven-letter word contains dozens of letters?",
        answer: "mailbox",
        acceptedAnswers: ["mailbox", "postbox"],
        hint: "It contains mail, which includes letters.",
        category: "word",
        difficulty: "hard"
      }
    ]
  },
  math: {
    easy: [
      {
        riddle: "If you multiply this number by any other number, the answer will always be the same. What number is it?",
        answer: "zero",
        acceptedAnswers: ["0", "zero"],
        hint: "Anything times this equals itself.",
        category: "math",
        difficulty: "easy"
      },
      {
        riddle: "I am an odd number. Take away a letter and I become even. What number am I?",
        answer: "seven",
        acceptedAnswers: ["7", "seven"],
        hint: "Remove the 's' from the word.",
        category: "math",
        difficulty: "easy"
      }
    ],
    medium: [
      {
        riddle: "A man has 5 sons, and each of his sons has a sister. How many children does the man have?",
        answer: "6",
        acceptedAnswers: ["6", "six"],
        hint: "They all share the same sister.",
        category: "math",
        difficulty: "medium"
      },
      {
        riddle: "If there are three apples and you take away two, how many apples do you have?",
        answer: "2",
        acceptedAnswers: ["2", "two"],
        hint: "How many did YOU take?",
        category: "math",
        difficulty: "medium"
      }
    ],
    hard: [
      {
        riddle: "A father is 4 times as old as his daughter. In 6 years, he will be 3 times as old. How old are they now?",
        answer: "daughter is 6, father is 24",
        acceptedAnswers: ["6 and 24", "daughter 6 father 24", "6, 24"],
        hint: "Set up equations: F = 4D and F + 6 = 3(D + 6)",
        category: "math",
        difficulty: "hard"
      }
    ]
  },
  lateral: {
    easy: [
      {
        riddle: "A man lives in a house where all four walls face south. A bear walks by the house. What color is the bear?",
        answer: "white",
        acceptedAnswers: ["white", "polar bear"],
        hint: "Where is the only place this house could be?",
        category: "lateral",
        difficulty: "easy"
      }
    ],
    medium: [
      {
        riddle: "A man pushed his car to a hotel and told the owner he was bankrupt. What happened?",
        answer: "playing monopoly",
        acceptedAnswers: ["monopoly", "board game", "playing monopoly"],
        hint: "Think about a game with cars, hotels, and bankruptcy.",
        category: "lateral",
        difficulty: "medium"
      },
      {
        riddle: "Romeo and Juliet are found dead on the floor in a puddle of water. There is broken glass around them. How did they die?",
        answer: "they were fish",
        acceptedAnswers: ["fish", "they were fish", "goldfish"],
        hint: "They weren't human.",
        category: "lateral",
        difficulty: "medium"
      }
    ],
    hard: [
      {
        riddle: "A man calls his dog from the opposite side of a river. The dog crosses the river without getting wet, and without using a bridge or boat. How?",
        answer: "the river was frozen",
        acceptedAnswers: ["frozen", "river was frozen", "ice", "winter"],
        hint: "What state would the water be in?",
        category: "lateral",
        difficulty: "hard"
      }
    ]
  }
};