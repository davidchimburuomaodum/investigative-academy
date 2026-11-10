(() => {
  "use strict";

  const cases = window.InvestigativeCases || [];
  const catalogue = document.getElementById("case-catalogue");
  const reader = document.getElementById("case-reader");
  const content = document.getElementById("case-content");

  if (!catalogue || !reader || !content) {
    console.error("Case Files: required HTML elements are missing.");
    return;
  }

  let activeCase = null;
  let answers = {};

  function escapeHTML(value) {
    return String(value).replace(/[&<>"']/g, character => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;"
    })[character]);
  }

  function getProgress() {
    try {
      const data = JSON.parse(
        localStorage.getItem("mentalist_academy_v1")
      ) || {};

      return data.caseProgress || {};
    } catch {
      return {};
    }
  }

  function saveResult(caseId, result) {
    const key = "mentalist_academy_v1";
    let data = {};

    try {
      data = JSON.parse(localStorage.getItem(key)) || {};
    } catch {
      data = {};
    }

    data.caseProgress = data.caseProgress || {};

    const previous = data.caseProgress[caseId];
    const firstPass = result.passed && !previous?.completed;

    data.caseProgress[caseId] = {
      score: Math.max(previous?.score || 0, result.score),
      completed: Boolean(previous?.completed || result.passed),
      completedAt: firstPass
        ? new Date().toISOString()
        : previous?.completedAt || null,
      report: result.report
    };

    if (firstPass) {
      data.xp = (data.xp || 0) + 30;
    }

    localStorage.setItem(key, JSON.stringify(data));

    if (window.Academy?.updateDashboard) {
      window.Academy.updateDashboard();
    }
  }

  function showCatalogue() {
    activeCase = null;
    catalogue.hidden = false;
    reader.hidden = true;

    const progress = getProgress();

    catalogue.innerHTML = `
      <div class="case-library-heading">
        <p class="eyebrow">INVESTIGATIVE DEPARTMENT</p>
        <h2>Investigation Library</h2>
        <p>Select a case, examine its records and submit your findings.</p>
      </div>

      <div class="case-library-grid">
        ${cases.map(item => {
          const completed = progress[item.id]?.completed;

          return `
            <article class="case-library-card">
              <div class="case-card-topline">
                <span class="case-difficulty">${escapeHTML(item.difficulty)}</span>
                <span class="case-status">
                  ${completed ? "COMPLETED" : "AVAILABLE"}
                </span>
              </div>
              <p class="eyebrow">${escapeHTML(item.department)}</p>
              <h3>${escapeHTML(item.title)}</h3>
              <p>${escapeHTML(item.summary)}</p>
              <div class="case-card-footer">
                <span>${item.questions.length} assessment questions</span>
                <button type="button" data-open-case="${escapeHTML(item.id)}">
                  ${completed ? "Review case" : "Open investigation"} →
                </button>
              </div>
              ${completed ? `
                <p class="case-previous-score">
                  Previous score: ${progress[item.id]?.score ?? 0}%
                </p>
              ` : ""}
            </article>
          `;
        }).join("")}
      </div>
    `;

    catalogue.querySelectorAll("[data-open-case]").forEach(button => {
      button.addEventListener("click", () => {
        openCase(button.dataset.openCase);
      });
    });
  }

  function openCase(id) {
    activeCase = cases.find(item => item.id === id);
    if (!activeCase) return;

    answers = {};
    catalogue.hidden = true;
    reader.hidden = false;

    renderCase();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function renderCase() {
    const item = activeCase;

    content.innerHTML = `
      <div class="case-detail-heading">
        <p class="eyebrow">${escapeHTML(item.department)} / CASE FILE</p>
        <h2>${escapeHTML(item.title)}</h2>
        <span class="case-difficulty">${escapeHTML(item.difficulty)}</span>
        <p>${escapeHTML(item.summary)}</p>
      </div>

      <section class="case-detail-section">
        <p class="eyebrow">01 / CASE BRIEFING</p>
        <h3>Situation overview</h3>
        <p>${escapeHTML(item.briefing)}</p>
        <h4>Investigation objectives</h4>
        <ul>
          ${item.objectives.map(objective =>
            `<li>${escapeHTML(objective)}</li>`
          ).join("")}
        </ul>
      </section>

      <section class="case-detail-section">
        <p class="eyebrow">02 / EVIDENCE ROOM</p>
        <h3>Available evidence</h3>
        <div class="case-evidence-grid">
          ${item.evidence.map((evidence, index) => `
            <article class="case-evidence-card">
              <span class="case-evidence-number">EVIDENCE ${String(index + 1).padStart(2, "0")}</span>
              <h4>${escapeHTML(evidence.title)}</h4>
              <span class="case-evidence-type">${escapeHTML(evidence.type)}</span>
              <p>${escapeHTML(evidence.detail)}</p>
              <div class="case-significance">
                <strong>Investigative significance</strong>
                <p>${escapeHTML(evidence.significance)}</p>
              </div>
            </article>
          `).join("")}
        </div>
      </section>

      <section class="case-detail-section">
        <p class="eyebrow">03 / WITNESS ACCOUNTS</p>
        <h3>Statements</h3>
        ${item.statements.map(statement => `
          <article class="case-statement">
            <h4>${escapeHTML(statement.person)}</h4>
            <p>“${escapeHTML(statement.statement)}”</p>
          </article>
        `).join("")}
      </section>

      <section class="case-detail-section">
        <p class="eyebrow">04 / EVENT RECONSTRUCTION</p>
        <h3>Known timeline</h3>
        <div class="case-timeline">
          ${item.timeline.map(event => `
            <div class="case-timeline-event">
              <strong>${escapeHTML(event.time)}</strong>
              <p>${escapeHTML(event.event)}</p>
            </div>
          `).join("")}
        </div>
      </section>

      <section class="case-detail-section">
        <p class="eyebrow">05 / INVESTIGATIVE ASSESSMENT</p>
        <h3>Test your conclusions</h3>
        <p>Choose the best evidence-based answer for each question.</p>
        <div id="case-questions">
          ${item.questions.map((question, index) => `
            <article class="case-question" data-question="${index}">
              <span class="eyebrow">QUESTION ${String(index + 1).padStart(2, "0")}</span>
              <h4>${escapeHTML(question.prompt)}</h4>
              <div class="case-options">
                ${question.options.map((option, optionIndex) => `
                  <label class="case-option">
                    <input type="radio"
                      name="case-question-${index}"
                      value="${optionIndex}">
                    <span>${escapeHTML(option)}</span>
                  </label>
                `).join("")}
              </div>
              <div class="case-answer-feedback" hidden></div>
            </article>
          `).join("")}
        </div>
      </section>

      <section class="case-detail-section">
        <p class="eyebrow">06 / FINAL SUBMISSION</p>
        <h3>Investigative report</h3>
        <p>Summarise your findings. Separate established facts from unresolved questions.</p>
        <label class="case-report-label" for="case-report">
          YOUR INVESTIGATIVE CONCLUSION
        </label>
        <textarea id="case-report" rows="7"
          placeholder="1. Established facts&#10;2. Important evidence&#10;3. Unresolved questions&#10;4. Recommended next steps"></textarea>
        <button type="button" id="submit-case" class="case-submit-button">
          Submit investigation →
        </button>
        <div id="case-result" aria-live="polite"></div>
      </section>
    `;

    content.querySelectorAll(".case-question").forEach(question => {
      question.querySelectorAll("input").forEach(input => {
        input.addEventListener("change", () => {
          const questionIndex = Number(question.dataset.question);
          answers[questionIndex] = Number(input.value);
          question.classList.remove("case-question-unanswered");
        });
      });
    });

    document.getElementById("submit-case")
      .addEventListener("click", submitCase);
  }

  function submitCase() {
    const resultBox = document.getElementById("case-result");
    const report = document.getElementById("case-report").value.trim();

    if (activeCase.questions.some((question, index) =>
      answers[index] === undefined
    )) {
      resultBox.innerHTML =
        '<p class="case-error">Please answer every assessment question before submitting.</p>';

      activeCase.questions.forEach((question, index) => {
        if (answers[index] === undefined) {
          document.querySelector(
            `[data-question="${index}"]`
          )?.classList.add("case-question-unanswered");
        }
      });

      return;
    }

    if (report.length < 40) {
      resultBox.innerHTML =
        '<p class="case-error">Please provide a more complete investigative report (at least 40 characters).</p>';
      return;
    }

    let correct = 0;

    activeCase.questions.forEach((question, index) => {
      const isCorrect = answers[index] === question.answer;
      if (isCorrect) correct++;

      const feedback = document.querySelector(
        `[data-question="${index}"] .case-answer-feedback`
      );

      feedback.hidden = false;
      feedback.className = "case-answer-feedback " +
        (isCorrect ? "case-answer-correct" : "case-answer-incorrect");

      feedback.textContent =
        (isCorrect ? "Correct. " : "Not quite. ") +
        question.explanation;
    });

    const score = Math.round(
      (correct / activeCase.questions.length) * 100
    );

    const passed = score >= 80;

    saveResult(activeCase.id, { score, report, passed });

    resultBox.innerHTML = `
      <div class="case-result-card">
        <p class="eyebrow">INVESTIGATION RESULT</p>
        <strong class="case-result-score">${score}%</strong>
        <h3>${passed ? "Assessment passed" : "Assessment reviewed"}</h3>
        <p>You answered ${correct} of ${activeCase.questions.length} questions correctly.</p>
        <p>${passed
          ? "You demonstrated a strong understanding of the available evidence."
          : "Review the explanations and revisit the evidence before attempting the case again."
        }</p>
        <p class="case-result-note">
          ${passed ? "Your first successful completion earns 30 XP." : "You can review the evidence and try again. No XP is awarded for an unsuccessful attempt."}
        </p>
        <button type="button" id="return-case-library">
          Return to Case Library
        </button>
      </div>
    `;

    document.getElementById("submit-case").disabled = passed;

    document.getElementById("return-case-library")
      .addEventListener("click", showCatalogue);

    window.scrollTo({ top: resultBox.offsetTop, behavior: "smooth" });
  }

  document.getElementById("back-to-case-library")
    ?.addEventListener("click", showCatalogue);

  window.InvestigativeCaseFiles = {
    showCatalogue,
    openCase
  };

  showCatalogue();
})();
