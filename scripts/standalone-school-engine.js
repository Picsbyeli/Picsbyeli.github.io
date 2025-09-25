(function(){
  try {
    // Standalone School Trivia engine (exposes window.standaloneGetQuestion)
    const questionBank = (function(){
      // Use external window.schoolQuestions if available, otherwise fall back to embedded bank
      try { if (window && window.schoolQuestions) return { 'School Trivia': window.schoolQuestions }; } catch(e){}
      // Standalone School Trivia engine (exposes window.standaloneGetQuestion)
      (function(){
        try {
          const questionBank = (function(){
            try { if (window && window.schoolQuestions) return { 'School Trivia': window.schoolQuestions }; } catch(e){}
            // Standalone School Trivia engine (exposes window.standaloneGetQuestion)
            (function(){
              try {
                const questionBank = (function(){
                  try { if (window && window.schoolQuestions) return { 'School Trivia': window.schoolQuestions }; } catch(e){}
                  return {
                    "School Trivia": {
                      Math: {
                        Easy: [
                          { q: "What is 2 + 2?", a: "4" },
                          { q: "How many sides does a square have?", a: "4" },
                          { q: "What is 10 - 3?", a: "7" },
                          { q: "What number comes after 19?", a: "20" },
                          { q: "What is 5 + 6?", a: "11" },
                          { q: "How many legs does a triangle have?", a: "Trick! None. It has sides." },
                          { q: "How many minutes are in an hour?", a: "60" },
                          { q: "What is half of 20?", a: "10" },
                          { q: "What shape is a stop sign?", a: "Octagon" },
                          { q: "What is 3 + 4 + 5?", a: "12" }
                        ],
                        Medium: [
                          { q: "What is 12 × 12?", a: "144" },
                          { q: "What is 144 ÷ 12?", a: "12" },
                          { q: "What is 25% of 200?", a: "50" },
                          { q: "Simplify: (3x + 5x)", a: "8x" },
                          { q: "What is the area of a rectangle with length 10 and width 4?", a: "40" },
                          { q: "What is the value of π (approx, 2 decimals)?", a: "3.14" },
                          { q: "What is 2⁵?", a: "32" },
                          { q: "What is the square root of 81?", a: "9" },
                          { q: "Convert 0.75 to a fraction.", a: "3/4" },
                          { q: "Solve: 2x + 6 = 14", a: "x = 4" }
                        ],
                        Hard: [
                          { q: "What is the slope of y = 3x + 7?", a: "3" },
                          { q: "Solve: x² - 16 = 0", a: "x = 4 or -4" },
                          { q: "What is the quadratic formula?", a: "x = [-b ± √(b²-4ac)] / 2a" },
                          { q: "Derivative of sin(x)?", a: "cos(x)" },
                          { q: "What is the integral of 2x?", a: "x² + C" },
                          { q: "Simplify: (x+2)(x+3)", a: "x² + 5x + 6" },
                          { q: "What is the distance formula?", a: "√[(x₂-x₁)² + (y₂-y₁)²]" },
                          { q: "What is log₁₀(1000)?", a: "3" },
                          { q: "Factor: x² - 9", a: "(x-3)(x+3)" },
                          { q: "What is 7! ?", a: "5040" }
                        ],
                        Expert: [
                          { q: "State Euler’s identity.", a: "e^(iπ) + 1 = 0" },
                          { q: "What is a group in abstract algebra?", a: "A set with an associative operation, identity, and inverses." }
                        ]
                      },
                      Science: { Easy: [], Medium: [], Hard: [], Expert: [] },
                      History: { Easy: [], Medium: [], Hard: [], Expert: [] },
                      English: { Easy: [], Medium: [], Hard: [], Expert: [] }
                    }
                  };
                })();

                const usedQuestions = {};
                function getQuestion(category, subject, difficulty){
                  try{
                    const key = `${category}-${subject}-${difficulty}`;
                    if (!usedQuestions[key]) usedQuestions[key] = [];
                    const pool = (questionBank[category] && questionBank[category][subject] && questionBank[category][subject][difficulty]) || [];
                    const remaining = pool.filter(q => !usedQuestions[key].includes(q.q));
                    if (remaining.length === 0) { usedQuestions[key] = []; return { q: 'All questions used! Restarting.', a: null }; }
                    const picked = remaining[Math.floor(Math.random() * remaining.length)];
                    usedQuestions[key].push(picked.q);
                    return picked;
                  } catch(e){ return { q:'Error fetching question', a:null }; }
                }

                // expose
                try { window.standaloneGetQuestion = getQuestion; } catch(e){}
                try { if (typeof window.getQuestion !== 'function') window.getQuestion = getQuestion; } catch(e){}
              } catch(e){}
            })();
