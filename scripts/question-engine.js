// Persistent Question Engine
// Exposes: QuestionEngine.getQuestion(category, subject, difficulty)
(function (window) {
  const questionBank = {
    "School Trivia": {
      Math: {
        Easy: [
          { q: "What is 7 - 3?", a: "4" },
          { q: "How many sides does a square have?", a: "4" },
          { q: "What is 5 + 10?", a: "15" },
          { q: "What is 2 × 3?", a: "6" },
          { q: "What is 10 - 7?", a: "3" }
        ],
        Medium: [
          { q: "What is 144 ÷ 12?", a: "12" },
          { q: "What is 25% of 200?", a: "50" },
          { q: "What is the area of a triangle with base 6 and height 4?", a: "12" },
          { q: "Solve: 3x = 12", a: "4" },
          { q: "What is the decimal for 1/4?", a: "0.25" }
        ],
        Hard: [
          { q: "What is the slope of y = 2x + 3?", a: "2" },
          { q: "Solve: x² - 9 = 0", a: "x = 3 or -3" },
          { q: "What is the derivative of x^2?", a: "2x" },
          { q: "Integrate: ∫2 dx", a: "2x + C" },
          { q: "What is the value of π (approx)?", a: "3.14159" }
        ],
        Expert: [
          { q: "Define a matrix determinant.", a: "A scalar value that can be computed from the elements of a square matrix and encodes certain properties of the linear transformation described by the matrix." },
          { q: "What is a Taylor series expansion?", a: "An infinite sum of terms that are expressed in terms of the function's derivatives at a single point." },
          { q: "State the Fundamental Theorem of Calculus.", a: "It links the concept of the derivative of a function with the concept of an integral." },
          { q: "What is an eigenvalue?", a: "A scalar λ such that there exists a non-zero vector v where Av = λv for matrix A." },
          { q: "Explain convergence of a sequence.", a: "A sequence converges if its terms approach a single finite limit as n→∞." }
        ]
      },
      Science: {
        Easy: [
          { q: "What planet do we live on?", a: "Earth" },
          { q: "What is H2O commonly called?", a: "Water" },
          { q: "What do plants need to make food (basic)?", a: "Sunlight" }
        ],
        Medium: [
          { q: "What gas do humans exhale?", a: "Carbon dioxide" },
          { q: "What organ pumps blood through the body?", a: "Heart" }
        ],
        Hard: [
          { q: "State Newton’s second law.", a: "F = ma" },
          { q: "What is the chemical symbol for sodium?", a: "Na" }
        ],
        Expert: [
          { q: "Define entropy.", a: "A measure of the number of specific ways a thermodynamic system can be arranged; often interpreted as disorder." },
          { q: "What is Gibbs free energy?", a: "A thermodynamic potential that measures the maximum reversible work obtainable from a system at constant temperature and pressure." }
        ]
      },
      History: {
        Easy: [
          { q: "Who was the first U.S. president?", a: "George Washington" },
          { q: "Which ancient civilization built the pyramids?", a: "The Egyptians" }
        ],
        Medium: [
          { q: "What year did the Civil War begin?", a: "1861" },
          { q: "Who was the first emperor of Rome?", a: "Augustus" }
        ],
        Hard: [
          { q: "Who wrote The Communist Manifesto?", a: "Karl Marx & Friedrich Engels" },
          { q: "What caused the fall of the Western Roman Empire?", a: "Multiple factors including invasions, economic troubles, and internal strife" }
        ],
        Expert: [
          { q: "Explain the significance of the Treaty of Westphalia.", a: "It ended the Thirty Years' War (1648) and established the concept of state sovereignty in international law." },
          { q: "Describe the Columbian Exchange.", a: "The widespread transfer of plants, animals, culture, human populations, and ideas between the Americas and the Old World following Columbus's voyages." }
        ]
      },
      English: {
        Easy: [
          { q: "What is the opposite of 'hot'?", a: "Cold" },
          { q: "What is a noun?", a: "A person, place, or thing" }
        ],
        Medium: [
          { q: "Identify the verb: 'She runs fast.'", a: "runs" },
          { q: "What is an adjective?", a: "A word that describes a noun" }
        ],
        Hard: [
          { q: "What is iambic pentameter?", a: "A line with 5 iambs (unstressed + stressed)" },
          { q: "Define metaphor.", a: "A figure of speech that directly compares two unlike things" }
        ],
        Expert: [
          { q: "Explain postmodernism in literature.", a: "A broad movement characterized by reliance on narrative techniques such as fragmentation, paradox, and unreliable narrators, often challenging grand narratives and objective truth." },
          { q: "What is deconstruction (brief)?", a: "A critical approach that seeks to expose assumptions and contradictions in texts." }
        ]
      }
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
