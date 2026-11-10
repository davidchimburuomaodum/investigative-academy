(() => {
  "use strict";

  const root = document.getElementById("gym-content");
  const challenges = window.InvestigativeChallenges || [];

  if (!root) {
    console.error("Mental Gym: gym-content is missing.");
    return;
  }

  let category = "All";
  let difficulty = "All";
  let activeChallenge = null;
  let selectedAnswer = null;

  function getData() {
    return Academy.getData();
  }

  function getProgress() {
    return getData().gymProgress || {};
  }

  function renderLibrary() {
    activeChallenge = null;
    selectedAnswer = null;

    const progress = getProgress();
    const completedCount = Object.values(progress).filter(item => item && item.completed).length;
    const categories = ["All", ...new Set(challenges.map(item => item.category))];
    const filtered = challenges.filter(item =>
      (category === "All" || item.category === category) &&
      (difficulty === "All" || item.difficulty === difficulty)
    );

    root.innerHTML = `
      <div class="department-heading">
        <p class="eyebrow">DEPARTMENT 03 / SKILL DEVELOPMENT</p>
        <h2>Mental Gym</h2>
        <p>Train attention, recall, pattern recognition and evidence-based reasoning.</p>
      </div>

      <div class="gym-summary">
        <div><strong>${completedCount}</strong><span>Completed</span></div>
        <div><strong>${challenges.length}</strong><span>Exercises</span></div>
      </div>

      <div class="gym-filters">
        <label>Skill
          <select id="gym-category">
            ${categories.map(value => `<option ${value === category ? "selected" : ""}>${value}</option>`).join("")}
          </select>
        </label>
        <label>Difficulty
          <select id="gym-difficulty">
            ${["All", "Easy", "Intermediate", "Advanced"].map(value =>
              `<option ${value === difficulty ? "selected" : ""}>${value}</option>`
            ).join("")}
          </select>
        </label>
      </div>

      <div class="gym-challenge-grid">
        ${filtered.map(item => {
          const done = Boolean(progress[item.id]?.completed);
          return `
            <article class="gym-card">
              <span class="eyebrow">${item.category}</span>
              <span class="gym-difficulty">${item.difficulty}</span>
              <h3>${item.title}</h3>
              <p>${done ? "Completed" : "Ready to attempt"}</p>
              <button type="button" data-gym-open="${item.id}">
                ${done ? "Practice again" : "Start exercise"} →
              </button>
            </article>
          `;
        }).join("") || "<p>No exercises match these filters.</p>"}
      </div>
    `;

    root.querySelector("#gym-category").addEventListener("change", event => {
      category = event.target.value;
      renderLibrary();
    });

    root.querySelector("#gym-difficulty").addEventListener("change", event => {
      difficulty = event.target.value;
      renderLibrary();
    });

    root.querySelectorAll("[data-gym-open]").forEach(button => {
      button.addEventListener("click", () => openChallenge(button.dataset.gymOpen));
    });
  }

  function openChallenge(id) {
    activeChallenge = challenges.find(item => item.id === id);
    if (!activeChallenge) return;

    selectedAnswer = null;

    root.innerHTML = `
      <button class="gym-back" id="gym-back">← All exercises</button>
      <article class="gym-exercise">
        <p class="eyebrow">${activeChallenge.category} / ${activeChallenge.difficulty}</p>
        <h2>${activeChallenge.title}</h2>
        <p>${activeChallenge.prompt}</p>
        <div class="gym-answer-list">
          ${activeChallenge.options.map((option, index) => `
            <label class="gym-answer">
              <input type="radio" name="gym-answer" value="${index}">
              <span>${option}</span>
            </label>
          `).join("")}
        </div>
        <button type="button" id="gym-submit">Check answer</button>
        <div id="gym-feedback" aria-live="polite"></div>
      </article>
    `;

    root.querySelector("#gym-back").addEventListener("click", renderLibrary);

    root.querySelectorAll('input[name="gym-answer"]').forEach(input => {
      input.addEventListener("change", () => {
        selectedAnswer = Number(input.value);
      });
    });

    root.querySelector("#gym-submit").addEventListener("click", submitAnswer);
  }

  function submitAnswer() {
    const feedback = root.querySelector("#gym-feedback");

    if (selectedAnswer === null) {
      feedback.innerHTML = '<p class="gym-feedback-error">Choose an answer first.</p>';
      return;
    }

    const correct = selectedAnswer === activeChallenge.answer;
    const data = getData();
    data.gymProgress = data.gymProgress || {};

    const previous = data.gymProgress[activeChallenge.id] || {
      completed: false,
      attempts: 0,
      bestResult: false
    };

    previous.attempts += 1;

    let earnedNow = false;

    if (correct) {
      if (!previous.completed) {
        data.xp = (data.xp || 0) + activeChallenge.xp;
        previous.completed = true;
        previous.bestResult = true;
        previous.completedAt = new Date().toISOString();
        earnedNow = true;
      }
    }

    data.gymProgress[activeChallenge.id] = previous;
    Academy.save(data);
    Academy.updateDashboard();

    feedback.innerHTML = `
      <div class="gym-feedback-card ${correct ? "correct" : "incorrect"}">
        <h3>${correct ? "Correct answer" : "Not quite"}</h3>
        <p>${activeChallenge.explanation}</p>
        <p>${correct
          ? earnedNow
            ? `You earned ${activeChallenge.xp} XP.`
            : "This exercise was already completed. No duplicate XP was awarded."
          : "Review the explanation and try again."
        }</p>
        <button type="button" id="gym-next">
          ${correct ? "Back to exercises" : "Try again"}
        </button>
      </div>
    `;

    root.querySelector("#gym-next").addEventListener("click", () => {
      if (correct) renderLibrary();
      else openChallenge(activeChallenge.id);
    });

    root.querySelector("#gym-submit").disabled = true;
  }

  window.InvestigativeMentalGym = {
    show: renderLibrary
  };

  renderLibrary();
})();
