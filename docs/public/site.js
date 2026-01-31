function setActiveNav() {
  const path = window.location.pathname.replace(/\/$/, "") || "/";
  document.querySelectorAll(".nav a").forEach((link) => {
    const href = link.getAttribute("href");
    if (href === path || (href === "/" && path === "")) {
      link.classList.add("active");
    }
  });
}

document.addEventListener("DOMContentLoaded", setActiveNav);
