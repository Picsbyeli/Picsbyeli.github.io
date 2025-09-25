// School Trivia UI wiring for standalone page
(function(){
  // Ensure a game-area exists (for standalone.html it's usually already there)
  if (!document.getElementById("game-area")) {
    const div = document.createElement("div");
    div.id = "game-area";
    document.body.appendChild(div);
  }

  // Button handler (safe guard if button not present)
  const btn = document.getElementById("schoolTriviaBtn");
  if (btn) {
    btn.addEventListener("click", () => {
      startSchoolTrivia();
    });
  }

  // Start School Trivia UI
  window.startSchoolTrivia = function startSchoolTrivia() {
    const container = document.getElementById("game-area");
    container.innerHTML = `
      <div class="quiz-container">
        <h2>🎓 School Trivia</h2>
        <p>Select a subject and grade difficulty to begin:</p>

        <label>Subject:
          <select id="school-subject">
            <option value="Math">Math</option>
            <option value="Science">Science</option>
            <option value="History">History</option>
            <option value="English">English</option>
          </select>
        </label>

        <label>Difficulty:
          <select id="school-difficulty">
            <option value="Easy">Easy (K–4)</option>
            <option value="Medium">Medium (5–8)</option>
            <option value="Hard">Hard (High School)</option>
            <option value="Expert">Expert (College)</option>
          </select>
        </label>

        <button id="beginSchoolTrivia">Start Quiz</button>
        <button id="resetSchoolTrivia">Reset Pool</button>

        <div id="quiz-area"></div>
      </div>
    `;

    document.getElementById("beginSchoolTrivia").addEventListener("click", () => {
      const subject = document.getElementById("school-subject").value;
      const difficulty = document.getElementById("school-difficulty").value;
      runSchoolTrivia(subject, difficulty);
    });

    document.getElementById("resetSchoolTrivia").addEventListener("click", () => {
      try { localStorage.removeItem("usedSchoolQuestions"); } catch(e){}
      alert("✅ School Trivia pool reset. Questions may repeat again.");
    });
  };

  // Run a School Trivia round
  window.runSchoolTrivia = function runSchoolTrivia(subject, difficulty) {
    // prefer standaloneGetQuestion (exists in this page)
    const engine = window.standaloneGetQuestion || window.getQuestion;
    const quizArea = document.getElementById("quiz-area");
    if (!engine) {
      if (quizArea) quizArea.innerHTML = "<p>⚠️ Quiz engine not available.</p>";
      return;
    }

    const q = engine('School Trivia', subject, difficulty);

    if (!q || !q.q) {
      if (quizArea) quizArea.innerHTML = "<p>🎉 No more questions available for this category & difficulty!</p>";
      return;
    }

    // Normalize shape to { question, options, answer }
    const questionText = q.question || q.q || q.prompt || q.text || '';
    const options = q.options || q.choices || (q.a ? [q.a] : []);
    const answerIndex = (typeof q.correct === 'number') ? q.correct : (typeof q.answer === 'number' ? q.answer : 0);

    let optionsHTML = "";
    options.forEach((opt, i) => {
      optionsHTML += `<button class="optionBtn" data-index="${i}">${opt}</button>`;
    });

    if (quizArea) {
      quizArea.innerHTML = `
        <h3>${questionText}</h3>
        <div>${optionsHTML}</div>
        <p id="feedback"></p>
        <button id="nextSchoolQ">Next Question</button>
      `;

      // Check answer
      document.querySelectorAll(".optionBtn").forEach(btn => {
        btn.addEventListener("click", () => {
          const idx = parseInt(btn.dataset.index, 10);
          const fb = document.getElementById("feedback");
          if (idx === answerIndex) {
            fb.textContent = "✅ Correct!";
          } else {
            fb.textContent = "❌ Incorrect!" + (options[answerIndex] ? (" Correct answer: " + options[answerIndex]) : '');
          }
        });
      });

      // Next question
      const next = document.getElementById("nextSchoolQ");
      if (next) next.addEventListener("click", () => { runSchoolTrivia(subject, difficulty); });
    }
  };
})();
