import html from "./ui.html";
import styles from "./ui.css";

function injectStyles() {
  if (typeof document === "undefined") {
    return;
  }

  if (
    window.location.protocol !== "file:" &&
    !document.documentElement.hasAttribute("data-zine-offline")
  ) {
    const fonts = document.createElement("link");
    fonts.rel = "stylesheet";
    fonts.href = "https://fonts.googleapis.com/css2?family=Averia+Libre&family=Bebas+Neue&family=Bungee+Shade&family=Faster+One&family=Inconsolata&family=Playfair+Display:ital@1&family=Rubik+Puddles&family=Ultra&display=swap";
    document.head.appendChild(fonts);
  }

  const styleSheet = document.createElement("style");
  styleSheet.innerText = styles;
  document.head.appendChild(styleSheet);

  const accentColor = window.zine?.accentColor;
  if (typeof accentColor === "string" && accentColor.trim()) {
    document.documentElement.style.setProperty(
      "--zine-accent-color",
      accentColor.trim(),
    );
  }

  if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
    document.documentElement.setAttribute("data-theme", "dark");
  } else {
    document.documentElement.setAttribute("data-theme", "light");
  }

  window
    .matchMedia("(prefers-color-scheme: dark)")
    .addEventListener("change", (event) => {
      const colorScheme = event.matches ? "dark" : "light";
      document.documentElement.setAttribute(
        "data-theme",
        colorScheme === "dark" ? "dark" : "light",
      );
    });
}

function injectHtml() {
  if (typeof document === "undefined") {
    return;
  }
  document.body.insertAdjacentHTML("beforeend", html);
}

document.addEventListener("DOMContentLoaded", () => {
  injectStyles();
  injectHtml();
});
