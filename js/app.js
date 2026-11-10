const Academy = {
  key: "mentalist_academy_v1",

  getData() {
    try {
      return JSON.parse(localStorage.getItem(this.key)) || {
        xp: 0,
        lessons: 0,
        missions: 0,
        completedToday: "",
        lastMission: ""
      };
    } catch {
      return {
        xp: 0,
        lessons: 0,
        missions: 0,
        completedToday: "",
        lastMission: ""
      };
    }
  },

  save(data) {
    localStorage.setItem(this.key, JSON.stringify(data));
  },

  updateDashboard() {
    const data = this.getData();
    const level = Math.floor(data.xp / 100) + 1;
    const currentXP = data.xp % 100;

    document.getElementById("xp").textContent =
      data.xp + " XP";

    document.getElementById("totalXP").textContent =
      data.xp;

    document.getElementById("level").textContent =
      String(level).padStart(2, "0");

    document.getElementById("lessonsCompleted").textContent =
      data.lessons;

    document.getElementById("missionsCompleted").textContent =
      data.missions;

    document.getElementById("rank").textContent =
      level < 3 ? "Novice Investigator" :
      level < 6 ? "Junior Investigator" :
      level < 10 ? "Analytical Investigator" :
      "Master Investigator";

    document.getElementById("progress").style.width =
      currentXP + "%";

    document.getElementById("nextXP").textContent =
      (100 - currentXP) + " XP to next level";

    const today = new Date().toLocaleDateString("en-CA");

    if (data.completedToday === today) {
      document.getElementById("completeMission").disabled = true;
      document.getElementById("completeMission").textContent =
        "Mission Completed";
      document.getElementById("missionStatus").textContent =
        "Your daily mission has been completed.";
    }
  },

  completeMission() {
    const data = this.getData();
    const today = new Date().toLocaleDateString("en-CA");

    if (data.completedToday === today) return;

    data.xp += 20;
    data.missions += 1;
    data.completedToday = today;

    this.save(data);
    this.updateDashboard();
  }
};

document.getElementById("completeMission")
  .addEventListener("click", () => Academy.completeMission());

Academy.updateDashboard();


// Remove previous PWA service workers and their application caches.
if ("serviceWorker" in navigator) {
  window.addEventListener("load", async () => {
    try {
      const registrations =
        await navigator.serviceWorker.getRegistrations();

      await Promise.all(
        registrations.map(registration => registration.unregister())
      );

      if ("caches" in window) {
        const keys = await caches.keys();

        await Promise.all(
          keys
            .filter(key =>
              key.startsWith("investigative-academy-") ||
              key.startsWith("mentalist-academy-")
            )
            .map(key => caches.delete(key))
        );
      }

      console.log("Previous Academy PWA registration and caches cleared.");
    } catch (error) {
      console.error("PWA cleanup could not finish:", error);
    }
  });
}
