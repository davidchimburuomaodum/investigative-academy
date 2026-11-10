(() => {
  "use strict";

  const root = document.getElementById("profile-content");

  if (!root) {
    console.error("Profile: profile-content is missing.");
    return;
  }

  function render() {
    const data = Academy.getData();
    const xp = Number(data.xp) || 0;
    const level = Math.floor(xp / 100) + 1;
    const currentXP = xp % 100;

    const courseProgress = data.courseProgress || {};
    const caseProgress = data.caseProgress || {};
    const gymProgress = data.gymProgress || {};

    const completedCases = Object.values(caseProgress)
      .filter(item => item && item.completed).length;

    const completedExercises = Object.values(gymProgress)
      .filter(item => item && item.completed).length;

    const completedLessons = Number(data.lessons) || 0;
    const completedMissions = Number(data.missions) || 0;

    const certificates = Object.values(data.courseCertificates || {})
      .filter(item => item && item.certificateId);

    const escapeHTML = value => String(value ?? "").replace(/[&<>"']/g, char => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    })[char]);

    const rank = level < 3
      ? "Novice Investigator"
      : level < 6
        ? "Junior Investigator"
        : level < 10
          ? "Analytical Investigator"
          : "Master Investigator";

    const achievements = [
      {
        title: "First Steps",
        description: "Complete your first lesson.",
        unlocked: completedLessons >= 1
      },
      {
        title: "Case Analyst",
        description: "Complete your first investigation.",
        unlocked: completedCases >= 1
      },
      {
        title: "Mental Training",
        description: "Complete your first Mental Gym exercise.",
        unlocked: completedExercises >= 1
      },
      {
        title: "Dedicated Learner",
        description: "Complete five lessons.",
        unlocked: completedLessons >= 5
      },
      {
        title: "Investigation Specialist",
        description: "Complete all three current case files.",
        unlocked: completedCases >= 3
      },
      {
        title: "Mental Athlete",
        description: "Complete all twelve current gym exercises.",
        unlocked: completedExercises >= 12
      }
    ];

    root.innerHTML = `
      <div class="department-heading">
        <p class="eyebrow">LEARNER ACCOUNT / PERSONAL RECORD</p>
        <h2>Investigator Profile</h2>
        <p>Your learning activity and achievements in Investigative Academy.</p>
      </div>

      <section class="profile-identity">
        <div class="profile-avatar">IA</div>
        <div>
          <p class="eyebrow">INVESTIGATIVE ACADEMY LEARNER</p>
          <h3>${rank}</h3>
          <p>Level ${level}</p>
        </div>
      </section>

      <section class="profile-xp-card">
        <div class="profile-xp-heading">
          <span class="eyebrow">EXPERIENCE</span>
          <strong>${xp} XP</strong>
        </div>
        <div class="profile-progress-track">
          <span style="width:${currentXP}%"></span>
        </div>
        <p>${currentXP}/100 XP toward Level ${level + 1}</p>
      </section>

      <section class="profile-stat-grid">
        <article><strong>${completedLessons}</strong><span>Lessons completed</span></article>
        <article><strong>${completedCases}</strong><span>Cases completed</span></article>
        <article><strong>${completedExercises}</strong><span>Gym exercises</span></article>
        <article><strong>${completedMissions}</strong><span>Daily missions</span></article>
      </section>

      <section class="profile-section">
        <p class="eyebrow">PROGRESS RECORD</p>
        <h3>Learning activity</h3>
        <div class="profile-record-row">
          <span>Course progress records</span>
          <strong>${Object.keys(courseProgress).length}</strong>
        </div>
        <div class="profile-record-row">
          <span>Investigation records</span>
          <strong>${completedCases}</strong>
        </div>
        <div class="profile-record-row">
          <span>Completed gym exercises</span>
          <strong>${completedExercises}/12</strong>
        </div>
      </section>

      <section class="profile-section">
        <p class="eyebrow">RECOGNITION</p>
        <h3>Achievements</h3>
        <div class="profile-achievement-grid">
          ${achievements.map(item => `
            <article class="profile-achievement ${item.unlocked ? "unlocked" : "locked"}">
              <span>${item.unlocked ? "UNLOCKED" : "LOCKED"}</span>
              <h4>${item.title}</h4>
              <p>${item.description}</p>
            </article>
          `).join("")}
        </div>
      </section>

      <section class="profile-section">
        <p class="eyebrow">OFFICIAL LEARNING RECORD</p>
        <h3>Certificate History</h3>

        <div class="certificate-history-list">
          ${certificates.length ? certificates.map(certificate => `
            <article class="profile-record-row">
              <div>
                <strong>${escapeHTML(certificate.courseTitle)}</strong>
                <p>${escapeHTML(certificate.certificateId)}</p>
                <small>Issued: ${escapeHTML(
                  new Date(certificate.issuedAt).toLocaleDateString()
                )}</small>
              </div>
              <span class="certificate-history-status">ISSUED</span>
            </article>
          `).join("") : `
            <p>No certificates have been issued yet.</p>
          `}
        </div>
      </section>

      <p class="profile-disclaimer">
        Progress is stored in this browser on this device. Clearing browser
        storage may remove locally saved learning records.
      </p>
    `;
  }

  window.InvestigativeProfile = { render };
  render();

})();
