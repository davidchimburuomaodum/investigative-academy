(() => {
  "use strict";

  const courses = window.InvestigativeCourses || [];
  const catalogue = document.getElementById("academy-catalogue");
  const reader = document.getElementById("academy-reader");
  const courseList = document.getElementById("course-list");
  const lessonContent = document.getElementById("lesson-content");

  if (!catalogue || !reader || !courseList || !lessonContent) return;

  let activeCourse = null;
  let activeLesson = null;

  function getData() {
    return Academy.getData();
  }

  function saveProgress(courseId, lessonId) {
    const data = getData();

    data.courseProgress ||= {};
    data.courseProgress[courseId] ||= { completedLessons: [] };

    const completed = data.courseProgress[courseId].completedLessons;

    if (!completed.includes(lessonId)) {
      completed.push(lessonId);
      data.lessons = (Number(data.lessons) || 0) + 1;
      data.xp = (Number(data.xp) || 0) + 10;
      Academy.save(data);
      Academy.updateDashboard();
    }
  }

  function getCompleted(courseId) {
    const data = getData();
    return data.courseProgress?.[courseId]?.completedLessons || [];
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

  function allLessons(course) {
    return course.modules.flatMap(module =>
      module.lessons.map(lesson => ({
        ...lesson,
        moduleTitle: module.title
      }))
    );
  }

  function renderCatalogue() {
    const totalCompleted = courses.reduce(
      (sum, course) => sum + getCompleted(course.id).length, 0
    );

    document.getElementById("academy-progress-count").textContent =
      `${totalCompleted} lessons completed`;

    courseList.innerHTML = courses.map(course => {
      const total = allLessons(course).length;
      const completed = getCompleted(course.id).length;
      const percentage = total ? Math.round(completed / total * 100) : 0;

      return `
        <article class="course-card">
          <div class="course-card-top">
            <span class="course-level">${escapeHTML(course.level)}</span>
            <span class="course-duration">${completed}/${total} lessons</span>
          </div>
          <h3>${escapeHTML(course.title)}</h3>
          <p>${escapeHTML(course.description)}</p>
          <div class="course-progress-track">
            <span style="width:${percentage}%"></span>
          </div>
          <div class="course-card-footer">
            <span>${percentage}% completed</span>
            <button class="primary-button open-course"
              data-course="${escapeHTML(course.id)}">
              ${completed ? "Continue course" : "Start learning"} →
            </button>
          </div>
        </article>`;
    }).join("") || "<p>No courses are available yet.</p>";
  }

  function openCourse(courseId) {
    activeCourse = courses.find(course => course.id === courseId);
    if (!activeCourse) return;

    catalogue.hidden = true;
    reader.hidden = false;
    renderCourseLessons();
  }

  function renderCourseLessons() {
    const completed = getCompleted(activeCourse.id);

    lessonContent.innerHTML = `
      <div class="reader-heading">
        <p class="eyebrow">${escapeHTML(activeCourse.department)}</p>
        <h2>${escapeHTML(activeCourse.title)}</h2>
        <p>${escapeHTML(activeCourse.description)}</p>
      </div>
      ${activeCourse.modules.map((module, moduleIndex) => `
        <section class="module-card">
          <p class="eyebrow">MODULE ${String(moduleIndex + 1).padStart(2, "0")}</p>
          <h3>${escapeHTML(module.title)}</h3>
          ${module.lessons.map(lesson => `
            <button class="lesson-row"
              data-lesson="${escapeHTML(lesson.id)}">
              <span class="lesson-status">
                ${completed.includes(lesson.id) ? "✓" : "○"}
              </span>
              <span>${escapeHTML(lesson.title)}</span>
              <span>→</span>
            </button>
          `).join("")}
        </section>
      `).join("")}
    `;
  }

  function openLesson(lessonId) {
    const lessons = allLessons(activeCourse);
    activeLesson = lessons.find(lesson => lesson.id === lessonId);
    if (!activeLesson) return;

    const alreadyCompleted = getCompleted(activeCourse.id).includes(lessonId);

    lessonContent.innerHTML = `
      <button class="academy-back" id="back-to-modules">← Course modules</button>
      <div class="reader-heading">
        <p class="eyebrow">${escapeHTML(activeLesson.moduleTitle)}</p>
        <h2>${escapeHTML(activeLesson.title)}</h2>
      </div>
      <article class="lesson-article">
        ${activeLesson.content.map(section => `
          <section>
            <h3>${escapeHTML(section.heading)}</h3>
            <p>${escapeHTML(section.text)}</p>
          </section>
        `).join("")}
      </article>
      <section class="practice-card">
        <p class="eyebrow">KNOWLEDGE CHECK</p>
        <h3>${escapeHTML(activeLesson.questions[0].question)}</h3>
        <div id="practice-options">
          ${activeLesson.questions[0].options.map((option, index) => `
            <button class="practice-option" data-option="${index}">
              ${escapeHTML(option)}
            </button>
          `).join("")}
        </div>
        <p id="practice-feedback" aria-live="polite"></p>
      </section>
      <button id="complete-lesson" class="primary-button" disabled>
        ${alreadyCompleted ? "Lesson completed ✓" : "Complete lesson · +10 XP"}
      </button>
    `;

    const question = activeLesson.questions[0];

    lessonContent.querySelectorAll(".practice-option").forEach(button => {
      button.addEventListener("click", () => {
        const selected = Number(button.dataset.option);
        const feedback = document.getElementById("practice-feedback");

        lessonContent.querySelectorAll(".practice-option").forEach(option => {
          option.disabled = true;
        });

        if (selected === question.answer) {
          feedback.textContent = "Correct. " + question.explanation;
          feedback.className = "feedback-correct";
          document.getElementById("complete-lesson").disabled = false;
        } else {
          feedback.textContent = "Not quite. Review the lesson and try again.";
          feedback.className = "feedback-retry";

          const retry = document.createElement("button");
          retry.className = "secondary-button";
          retry.textContent = "Try again";
          retry.addEventListener("click", () => openLesson(lessonId));
          feedback.appendChild(retry);
        }
      });
    });

    const completeButton = document.getElementById("complete-lesson");

    if (alreadyCompleted) completeButton.disabled = true;

    completeButton.addEventListener("click", () => {
      saveProgress(activeCourse.id, lessonId);
      renderCatalogue();
      renderCourseLessons();
    });
  }

  function showCatalogue() {
    activeCourse = null;
    activeLesson = null;
    reader.hidden = true;
    catalogue.hidden = false;
    renderCatalogue();
  }

  courseList.addEventListener("click", event => {
    const button = event.target.closest(".open-course");
    if (button) openCourse(button.dataset.course);
  });

  lessonContent.addEventListener("click", event => {
    if (event.target.closest("#back-to-modules")) {
      renderCourseLessons();
      return;
    }

    const lessonButton = event.target.closest(".lesson-row");
    if (lessonButton) openLesson(lessonButton.dataset.lesson);
  });

  document.getElementById("back-to-courses")
    .addEventListener("click", showCatalogue);

  window.InvestigativeAcademy = {
    showCatalogue,
    renderCatalogue,
    openCourse
  };

  renderCatalogue();
})();
