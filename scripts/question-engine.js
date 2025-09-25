// Persistent Question Engine
// Exposes: QuestionEngine.getQuestion(category, subject, difficulty)
(function (window) {
  const questionBank = {
    "School Trivia": {
      Math: {
        Easy: [
          { q: "What is 2 + 2?", a: "4" },
          { q: "What shape has 3 sides?", a: "Triangle" }
        ],
        Medium: [
          { q: "What is 12 × 8?", a: "96" },
          { q: "Simplify: (3x + 2x)", a: "5x" }
        ],
        Hard: [
          { q: "What is the quadratic formula?", a: "x = [-b ± √(b²-4ac)] / 2a" },
          { q: "Derivative of sin(x)?", a: "cos(x)" }
        ],
        Expert: [
          { q: "What is Euler’s identity?", a: "e^(iπ) + 1 = 0" },
          { q: "Define a group in abstract algebra.", a: "A set with an associative binary operation, identity, and inverses." }
        ]
      },
      Science: { Easy: [], Medium: [], Hard: [], Expert: [] },
      History: { Easy: [], Medium: [], Hard: [], Expert: [] },
      English: { Easy: [], Medium: [], Hard: [], Expert: [] }
    }
  };

  const STORAGE_KEY = 'qe::usedQuestions';

  let usedQuestions = {};
  try {
    usedQuestions = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
  } catch (e) {
    usedQuestions = {};
  }

  function keyFor(category, subject, difficulty) {
    return `${category}::${subject}::${difficulty}`;
  }

  function save() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(usedQuestions));
    } catch (e) {
      // ignore storage errors
    }
  }

  function getQuestion(category, subject, difficulty) {
    const bankCategory = questionBank[category];
    if (!bankCategory) return { q: `Unknown category: ${category}`, a: null };
    const bankSubject = bankCategory[subject];
    if (!bankSubject) return { q: `Unknown subject: ${subject}`, a: null };
    const pool = bankSubject[difficulty] || [];

    const k = keyFor(category, subject, difficulty);
    if (!usedQuestions[k]) usedQuestions[k] = [];

    // Compare by JSON to avoid object identity issues
    const usedSet = new Set(usedQuestions[k]);
    const remaining = pool.filter(q => !usedSet.has(JSON.stringify(q)));

    if (remaining.length === 0) {
      // Reset used and persist
      usedQuestions[k] = [];
      save();
      return { q: 'All questions used! Restarting.', a: null };
    }

    const picked = remaining[Math.floor(Math.random() * remaining.length)];
    usedQuestions[k].push(JSON.stringify(picked));
    save();
    return picked;
  }

  function resetAll() {
    usedQuestions = {};
    try { localStorage.removeItem(STORAGE_KEY); } catch (e) {}
  }

  window.QuestionEngine = {
    getQuestion,
    resetAll,
    _questionBank: questionBank
  };

  // Example debug usage when loaded in a browser console:
  // console.log(QuestionEngine.getQuestion('School Trivia','Math','Easy'));
})(window);
