// questions.js — compact School Trivia dataset
// Exposes `window.schoolQuestions` with a small starter set.

const schoolQuestions = {
  Math: {
    easy: [
      { question: "What is 2 + 2?", options: ["3","4","5","6"], answer: 1 },
      { question: "How many sides does a square have?", options: ["3","4","5","6"], answer: 1 },
      { question: "What is 10 - 3?", options: ["6","7","8","9"], answer: 1 }
    ],
    medium: [
      { question: "What is 12 × 12?", options: ["144","154","134","124"], answer: 0 },
      { question: "What is 25% of 200?", options: ["25","50","75","100"], answer: 1 }
    ],
    hard: [
      { question: "Factor: x² - 9", options: ["(x-3)(x+3)","(x-9)(x+1)","Prime","(x+9)(x-1)"], answer: 0 }
    ]
  },

  Science: {
    easy: [
      { question: "What planet do we live on?", options: ["Mars","Venus","Earth","Jupiter"], answer: 2 },
      { question: "What gas do humans breathe in?", options: ["Carbon dioxide","Oxygen","Nitrogen","Helium"], answer: 1 }
    ],
    medium: [
      { question: "What is the chemical symbol for gold?", options: ["Au","Ag","Gd","Go"], answer: 0 }
    ],
    hard: []
  },

  History: { easy: [], medium: [], hard: [] },
  English: { easy: [], medium: [], hard: [] }
};

// Expose for pages
try { window.schoolQuestions = schoolQuestions; } catch (e) { /* ignore */ }

// EOF