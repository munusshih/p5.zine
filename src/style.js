// css------------------------------------------
const styless = `
  @import url('https://fonts.googleapis.com/css2?family=Averia+Libre&family=Bebas+Neue&family=Bungee+Shade&family=Faster+One&family=Inconsolata&family=Playfair+Display:ital@1&family=Rubik+Puddles&family=Ultra&display=swap');

html[data-theme=light] {
  --color-text: #333;
  --accent-color: #ed225d;
  --line-color: #ddd;
  --color-background: #fff;
}

html[data-theme=dark] {
  --color-text: #fff;
  --accent-color: #ed225d;
  --line-color: #ddd;
  --color-background: #000;
}

* {
  box-sizing: border-box;
}

html,
body {
  margin: 0;
  padding: 0;
  padding-top: 30px;
  background: url(https://munusshih.github.io/p5.genzine/bg.png) repeat fixed var(--color-background);
  scroll-behavior: smooth;
  transition: cubic-bezier(0.68, -0.55, 0.27, 1.55) 420ms !important;
  transition-delay: 0 !important;
}

canvas {
  display: block;
}

p {
  text-align: center;
  font-family: "Inconsolata", monospace;
  color: var(--accent-color);
  font-size: 12px;
  letter-spacing: -0.1px;
  overflow-wrap: break-word;
}

nav {
  position: fixed;
  background: none;
  width: 100%;
  text-align: left;
  top: 0px;
  padding-bottom: 0.5em;
  padding-left: 1em;
}
.desktop {
  position: fixed;
  bottom: 0em;
  padding-right: .5em;
  width: 100%;
  height: 2.5em;
  text-align: right;
  padding-top: .5em;
  padding-bottom: 3.25em;
  border-top: 1px solid var(--accent-color);
  background: var(--color-background);
  color: var(--color-text);
  margin-top: 0.5em;
  margin-right: 0.5em;
}
nav .title {
  display: inline-block;
  text-align: left;
  margin: 0px;
}
nav .title h1 {
  display: inline-block;
  color: var(--accent-color);
  font-size: 1.8em;
  line-height: 1;
  padding-top: 20px;
  margin: 0;
  margin-right: 10px;
  vertical-align: text-bottom;
}
nav .title h2 {
  display: inline-block;
  margin-right: 20px;
  color: var(--color-text);
  font-weight: 100;
  font-family: monospace;
  font-size: 1em;
}
nav .title h2 a {
  color: var(--color-text);
}
nav .title h2 a:hover {
  color: var(--line-color);
}

.label {
  position: fixed;
  background: var(--accent-color);
  padding: 0.5em;
  font-family: monospace;
}
.label a {
  text-decoration: none;
  color: white;
}

#nav-label {
  position: fixed;
  right: 0em;
  top: 0em;
}

#myCanvas{
  display: flex;
  justify-content: center;
  align-items: center;
}

#footer-label {
  position: relative;
  text-align: left;
  width: 15em;
  padding-left: 0.5em;
  color: white;
  left: 0em;
  top: -3.7em;
}

footer {
  width: 100%;
  text-align: center;
  padding: 20px;
  border-top: 1px solid var(--accent-color);
  margin-bottom: 6em;
}
footer p {
  margin: auto;
  text-align: center;
  max-width: 700px;
}

.button {
  // background: var(--color-background);
  border: 0px solid var(--accent-color);
  color: var(--accent-color);
  text-align: center;
  text-decoration: none;
  vertical-align: super;
  display: inline-block;
  font-size: 13px;
  margin: 4px 10px;
  height: 40px;
  min-width: 40px;
  line-height: 40px;
  font-family: "Inconsolata", monospace;
border: 1px solid var(--accent-color);
}
.button:hover {
  color: var(--accent-color);
  cursor: pointer;
  border-bottom: 1px dashed var(--accent-color);
}

.alt {
  background: var(--color-background);
  color: var(--accent-color);

  margin: 0em;
  margin-top: 0.3em;
  margin-left:.3em;
  // border-right: 1px solid var(--color-background);
  border-radius:20px;
}
.alt:hover {
background: var(--accent-color);
  color: white;

  cursor: pointer;

}

hr {
  margin-top: 50px;
  margin-bottom: 50px;
  border: 0.1px solid var(--accent-color);
}

#doc,
#doc p {
  text-align: left;
}

h3 {
  font-family: "Inconsolata", monospace;
}

h3 {
  color: var(--accent-color);
  font-size: 20px;
}

p {
  font-size: 20px;
}

span {
  color: grey;
}

@media screen and (max-width: 500px) {
  canvas {
    margin-top: 4em;
  }
}/*# sourceMappingURL=styles.css.map */`;

let colorScheme;

const styleSheet = document.createElement("style");
styleSheet.innerText = styless;
document.head.appendChild(styleSheet);

// dark mode
if (
  window.matchMedia &&
  window.matchMedia("(prefers-color-scheme: dark)").matches
) {
  colorScheme === "dark";
  document.documentElement.setAttribute("data-theme", "dark");
} else {
  colorScheme === "light";
  document.documentElement.setAttribute("data-theme", "light");
}

window
  .matchMedia("(prefers-color-scheme: dark)")
  .addEventListener("change", (event) => {
    colorScheme = event.matches ? "dark" : "light";

    if (colorScheme === "dark") {
      document.documentElement.setAttribute("data-theme", "dark");
    } else {
      document.documentElement.setAttribute("data-theme", "light");
    }
  });
