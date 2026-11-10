(() => {
  "use strict";

  const views = {
    home: document.querySelector("main"),
    academy: document.getElementById("academy-view"),
    cases: document.getElementById("cases-view"),
    gym: document.getElementById("gym-view"),
    profile: document.getElementById("profile-view")
  };

  const navLinks = document.querySelectorAll(".bottom-nav a");

  if (Object.values(views).some(view => !view)) {
    console.error("Navigation: one or more department views are missing.");
    return;
  }

  function showView(name) {
    if (!views[name]) return;

    Object.entries(views).forEach(([key, element]) => {
      element.hidden = key !== name;
    });

    navLinks.forEach(link => {
      link.classList.toggle(
        "active",
        link.getAttribute("href") === "#" + name
      );
    });

    if (name === "academy") {
      window.InvestigativeAcademy?.showCatalogue();
    }

    if (name === "cases") {
      window.InvestigativeCaseFiles?.showCatalogue();
    }

    if (name === "gym") {
      window.InvestigativeMentalGym?.show();
    }

    if (name === "profile") {
      window.InvestigativeProfile?.render();
    }

    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  navLinks.forEach(link => {
    link.addEventListener("click", event => {
      event.preventDefault();
      showView(link.getAttribute("href").slice(1));
    });
  });

  document.getElementById("caseButton")?.addEventListener("click", () => {
    showView("cases");
  });

  document.getElementById("profileButton")?.addEventListener("click", () => {
    showView("profile");
  });

  window.InvestigativeNavigation = { showView };
})();
