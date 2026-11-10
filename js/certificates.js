(() => {
  "use strict";

  const courses = window.InvestigativeCourses || [];
  const questions = window.InvestigativeFinalExam || [];
  const reader = document.getElementById("academy-reader");

  if (!reader) {
    console.error("Certificate engine: academy-reader is missing.");
    return;
  }

  function getData() {
    return Academy.getData();
  }

  function saveData(data) {
    Academy.save(data);
    Academy.updateDashboard();
  }

  function escapeHTML(value) {
    return String(value ?? "").replace(/[&<>"']/g, character => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;"
    })[character]);
  }

  function getCourse(courseId) {
    return courses.find(course => course.id === courseId);
  }

  function isCourseComplete(course) {
    const data = getData();
    const completed = data.courseProgress?.[course.id]?.completedLessons || [];
    const required = course.modules.flatMap(module =>
      module.lessons.map(lesson => lesson.id)
    );

    return required.length > 0 &&
      required.every(id => completed.includes(id));
  }

  function makeCertificateId() {
    const random = window.crypto?.randomUUID
      ? crypto.randomUUID().replace(/-/g, "").slice(0, 12).toUpperCase()
      : Math.random().toString(36).slice(2, 14).toUpperCase();

    return "IA-DCO-" + new Date().getFullYear() + "-" + random;
  }

  function showCertificate(certificate) {
    const root = document.getElementById("certificate-exam-root");
    if (!root) return;

    root.hidden = false;

    const lessonContent = document.getElementById("lesson-content");
    if (lessonContent) lessonContent.hidden = true;

    root.innerHTML = `
      <article class="certificate-paper">
        <div class="certificate-brand">
          <img src="assets/dco-company-logo.jpg"
               alt="DCO Cyber Solutions company logo">
          <span>DCO CYBER SOLUTIONS</span>
        </div>
        <p class="certificate-kicker">INVESTIGATIVE ACADEMY</p>
        <div class="certificate-rule"></div>

        <p class="certificate-label">CERTIFICATE OF COMPLETION</p>
        <h1>Certificate of Achievement</h1>
        <p class="certificate-intro">This certificate is proudly presented to</p>

        <h2 class="certificate-name">${escapeHTML(certificate.learnerName)}</h2>

        <p class="certificate-intro">
          for successfully completing the course
        </p>

        <h2 class="certificate-course">${escapeHTML(getCourse(certificate.courseId)?.title || certificate.courseTitle)}</h2>

        <p class="certificate-description">
          Having completed all required lessons and achieved the required
          standard in the final assessment.
        </p>

        <div class="certificate-result">
          <span>FINAL ASSESSMENT</span>
          <strong>${certificate.score}%</strong>
        </div>

        <div class="certificate-footer">
          <div>
            <span>DATE ISSUED</span>
            <strong>${escapeHTML(new Date(certificate.issuedAt).toLocaleDateString())}</strong>
          </div>
          <div>
            <span>CERTIFICATE ID</span>
            <strong>${escapeHTML(certificate.certificateId)}</strong>
          </div>
        </div>

        <div class="certificate-signature">
          <span class="signature-mark">OAO</span>
          <span class="signature-line"></span>
          <strong>Founder &amp; CEO</strong>
          <span>DCO CYBER SOLUTIONS</span>
        </div>

        <p class="certificate-authority">
          Issued by Investigative Academy — By DCO Cyber Solutions.
          Platform-issued certificate of course completion.
        </p>
      </article>

      <div class="certificate-actions">
        <button type="button" class="primary-button" id="print-certificate">
          Print / Save as PDF
        </button>
        <button type="button" class="secondary-button" id="return-to-academy">
          Return to Academy
        </button>
      </div>
    `;

    document.getElementById("print-certificate").addEventListener("click", () => {
      window.print();
    });

    document.getElementById("return-to-academy").addEventListener("click", () => {
      window.InvestigativeAcademy.showCatalogue();
    });
  }

  function issueCertificate(course, learnerName, score) {
    const data = getData();
    data.courseCertificates ||= {};

    if (data.courseCertificates[course.id]) {
      return data.courseCertificates[course.id];
    }

    const certificate = {
      certificateId: makeCertificateId(),
      courseId: course.id,
      courseTitle: course.title,
      learnerName,
      score,
      issuedAt: new Date().toISOString(),
      issuer: "Investigative Academy — DCO Cyber Solutions"
    };

    data.courseCertificates[course.id] = certificate;

    data.achievementHistory ||= [];
    data.achievementHistory.push({
      type: "certificate",
      title: "Course Completed",
      description: course.title,
      certificateId: certificate.certificateId,
      date: certificate.issuedAt
    });

    data.xp = (Number(data.xp) || 0) + (Number(course.xpReward) || 0);

    saveData(data);
    return certificate;
  }

  function startExam(courseId) {
    const course = getCourse(courseId);
    if (!course || !isCourseComplete(course)) {
      alert("Complete all course lessons before taking the final examination.");
      return;
    }

    const existing = getData().courseCertificates?.[courseId];
    const root = document.getElementById("certificate-exam-root");

    if (existing) {
      showCertificate(existing);
      return;
    }

    document.getElementById("lesson-content").hidden = true;
    root.hidden = false;

    root.innerHTML = `
      <button type="button" class="academy-back" id="exam-back">
        ← Return to course
      </button>

      <div class="department-heading">
        <p class="eyebrow">FINAL COURSE ASSESSMENT</p>
        <h2>${escapeHTML(course.title)}</h2>
        <p>Answer all ${questions.length} questions. You need 80% to pass.</p>
      </div>

      <form id="final-exam-form">
        <label class="exam-name-label" for="certificate-learner-name">
          Learner name for certificate
        </label>
        <input
          id="certificate-learner-name"
          name="learnerName"
          type="text"
          maxlength="80"
          required
          placeholder="Enter your full name"
        />

        <div class="final-exam-questions">
          ${questions.map((question, index) => `
            <fieldset class="final-exam-question">
              <legend>${index + 1}. ${escapeHTML(question.question)}</legend>
              ${question.options.map((option, optionIndex) => `
                <label class="final-exam-option">
                  <input
                    type="radio"
                    name="question-${index}"
                    value="${optionIndex}"
                    required
                  />
                  <span>${escapeHTML(option)}</span>
                </label>
              `).join("")}
            </fieldset>
          `).join("")}
        </div>

        <button class="primary-button" type="submit">
          Submit final examination
        </button>
        <p id="final-exam-feedback" aria-live="polite"></p>
      </form>
    `;

    document.getElementById("exam-back").addEventListener("click", () => {
      root.hidden = true;
      document.getElementById("lesson-content").hidden = false;
    });

    document.getElementById("final-exam-form").addEventListener("submit", event => {
      event.preventDefault();

      const form = event.currentTarget;
      if (!form.reportValidity()) return;

      const learnerName = form.elements.learnerName.value.trim();
      if (!learnerName) return;

      let correct = 0;

      questions.forEach((question, index) => {
        const selected = form.querySelector(
          `input[name="question-${index}"]:checked`
        );

        if (selected && Number(selected.value) === question.answer) {
          correct += 1;
        }
      });

      const score = Math.round((correct / questions.length) * 100);
      const feedback = document.getElementById("final-exam-feedback");

      if (score >= 80) {
        const certificate = issueCertificate(course, learnerName, score);
        showCertificate(certificate);

        if (window.InvestigativeProfile) {
          window.InvestigativeProfile.render();
        }
      } else {
        feedback.className = "feedback-retry";
        feedback.textContent =
          `You scored ${score}%. You need 80% to pass. Review the course and try again.`;
      }
    });
  }

  function addExamButtons() {
    const list = document.getElementById("course-list");
    if (!list) return;

    list.querySelectorAll(".course-card").forEach(card => {
      const courseButton = card.querySelector(".open-course");
      if (!courseButton) return;

      const course = getCourse(courseButton.dataset.course);
      if (!course || !isCourseComplete(course)) return;

      const footer = card.querySelector(".course-card-footer");
      if (!footer || footer.querySelector(".final-exam-entry")) return;

      const button = document.createElement("button");
      button.type = "button";
      button.className = "secondary-button final-exam-entry";
      button.textContent = getData().courseCertificates?.[course.id]
        ? "View certificate"
        : "Take final examination";

      button.addEventListener("click", () => {
        window.InvestigativeAcademy.openCourse(course.id);

        let root = document.getElementById("certificate-exam-root");
        if (!root) {
          root = document.createElement("div");
          root.id = "certificate-exam-root";
          root.hidden = true;
          reader.appendChild(root);
        }

        startExam(course.id);
      });

      footer.appendChild(button);
    });
  }

  const list = document.getElementById("course-list");

  if (list) {
    new MutationObserver(addExamButtons).observe(list, {
      childList: true,
      subtree: true
    });

    addExamButtons();
  }

  window.InvestigativeCertificates = {
    startExam,
    isCourseComplete
  };
})();
