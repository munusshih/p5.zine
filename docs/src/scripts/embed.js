import ace from "ace-code/src/ace";
import * as oopModule from "ace-code/src/lib/oop";
import * as javascriptHighlightRulesModule from "ace-code/src/mode/javascript_highlight_rules";
import * as javascriptModeModule from "ace-code/src/mode/javascript";
import * as crimsonThemeModule from "ace-code/src/theme/crimson_editor";

const oop = oopModule.default || oopModule;
const inherits = oop?.inherits || oopModule.inherits;

const JavaScriptHighlightRules =
  javascriptHighlightRulesModule.JavaScriptHighlightRules ||
  javascriptHighlightRulesModule.default?.JavaScriptHighlightRules ||
  javascriptHighlightRulesModule.default;

const JavaScriptMode =
  javascriptModeModule.Mode ||
  javascriptModeModule.default?.Mode ||
  javascriptModeModule.default;
const crimsonTheme = crimsonThemeModule.default || crimsonThemeModule;

const P5_FUNCTIONS = [
  "createCanvas",
  "resizeCanvas",
  "createGraphics",
  "background",
  "clear",
  "fill",
  "stroke",
  "noFill",
  "noStroke",
  "strokeWeight",
  "ellipse",
  "circle",
  "rect",
  "square",
  "line",
  "point",
  "arc",
  "triangle",
  "quad",
  "beginShape",
  "endShape",
  "vertex",
  "bezierVertex",
  "curveVertex",
  "text",
  "textFont",
  "textSize",
  "textAlign",
  "image",
  "imageMode",
  "loadImage",
  "loadFont",
  "loadSound",
  "color",
  "lerpColor",
  "random",
  "randomSeed",
  "noise",
  "noiseSeed",
  "map",
  "lerp",
  "dist",
  "angleMode",
  "blendMode",
  "push",
  "pop",
  "translate",
  "rotate",
  "scale",
  "shearX",
  "shearY",
  "frameRate",
  "pixelDensity",
  "saveCanvas",
  "saveFrames",
  "createCapture",
  "noLoop",
  "loop",
  "redraw",
];

const P5_CONSTANTS = [
  "PI",
  "HALF_PI",
  "QUARTER_PI",
  "TWO_PI",
  "TAU",
  "DEGREES",
  "RADIANS",
  "RGB",
  "HSB",
  "HSL",
  "CENTER",
  "CORNER",
  "CORNERS",
  "LEFT",
  "RIGHT",
  "TOP",
  "BOTTOM",
  "BASELINE",
  "WEBGL",
  "P2D",
  "ADD",
  "MULTIPLY",
  "SCREEN",
  "BLEND",
  "DARKEST",
  "LIGHTEST",
  "DIFFERENCE",
  "EXCLUSION",
  "OVERLAY",
  "HARD_LIGHT",
  "SOFT_LIGHT",
  "DODGE",
  "BURN",
  "frameCount",
  "deltaTime",
  "width",
  "height",
  "mouseX",
  "mouseY",
  "pmouseX",
  "pmouseY",
  "mouseIsPressed",
  "key",
  "keyCode",
  "keyIsPressed",
  "windowWidth",
  "windowHeight",
];

function P5HighlightRules() {
  JavaScriptHighlightRules.call(this);
  const fnRegex = new RegExp(`\\b(?:${P5_FUNCTIONS.join("|")})\\b`);
  const constRegex = new RegExp(`\\b(?:${P5_CONSTANTS.join("|")})\\b`);
  this.$rules.start.unshift(
    { token: "support.function", regex: fnRegex },
    { token: "support.constant", regex: constRegex }
  );
  this.normalizeRules();
}

if (inherits && JavaScriptHighlightRules) {
  inherits(P5HighlightRules, JavaScriptHighlightRules);
}

function P5Mode() {
  JavaScriptMode.call(this);
  this.HighlightRules = P5HighlightRules;
  this.$id = "ace/mode/p5js";
}

if (inherits && JavaScriptMode) {
  inherits(P5Mode, JavaScriptMode);
}

const DEFAULT_CODE = `function setup() {
  zinePageSize("8.5in", "11in");
}

function draw() {
  cover.background(255);
  cover.text("hello zine", 40, 60);
}`;

function buildSrcDoc(code, runtime, embedId) {
  const isLegacy = runtime === "legacy";
  const p5Url = isLegacy
    ? "https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.11.1/p5.js"
    : "https://cdn.jsdelivr.net/npm/p5@2/lib/p5.min.js";
  const zineUrl = "https://cdn.jsdelivr.net/npm/p5.zine";

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <style>
      html, body { margin: 0; padding: 0; background: #ffffff; }
      canvas { display: block; }
    </style>
  </head>
  <body>
    <script src="${p5Url}"></script>
    <script src="${zineUrl}"></script>
    <script>
      (function() {
        const EMBED_ID = ${JSON.stringify(embedId)};
        const send = (type, payload) => {
          try {
            window.parent.postMessage({
              source: "p5zine-embed",
              embedId: EMBED_ID,
              type,
              payload,
            }, "*");
          } catch (err) {
            // noop
          }
        };

        const formatArgs = (args) =>
          args.map((item) => {
            if (typeof item === "string") return item;
            try {
              return JSON.stringify(item);
            } catch (err) {
              return String(item);
            }
          });

        ["log", "info", "warn", "error"].forEach((level) => {
          const original = console[level];
          console[level] = function(...args) {
            try {
              send("console", { level, args: formatArgs(args) });
            } catch (err) {
              // noop
            }
            if (original) {
              original.apply(console, args);
            }
          };
        });

        window.addEventListener("error", (event) => {
          const message = event?.message || "Unknown error";
          const source = event?.filename || "";
          const line = event?.lineno || 0;
          const col = event?.colno || 0;
          send("console", {
            level: "error",
            args: [
              message,
              source ? "(" + source + ":" + line + ":" + col + ")" : "",
            ].filter(Boolean),
          });
        });

        window.addEventListener("unhandledrejection", (event) => {
          const reason = event?.reason;
          const message = reason?.message || String(reason || "Unhandled rejection");
          send("console", { level: "error", args: [message] });
        });
      })();
    </script>
    <script>
${code}
    </script>
  </body>
</html>`;
}

let embedCounter = 0;

function initEmbed(embed) {
  const runtime = embed.dataset.runtime === "legacy" ? "legacy" : "modern";
  const title = embed.dataset.title || "Live editor";
  const embedId = embed.dataset.embedId || `embed-${embedCounter++}`;
  embed.dataset.embedId = embedId;

  const existingEditor = embed.querySelector("textarea");
  const initialCode = (existingEditor ? existingEditor.value : embed.dataset.code || "").trim();
  const startCode = initialCode || DEFAULT_CODE;

  embed.innerHTML = "";

  const toolbar = document.createElement("div");
  toolbar.className = "embed-toolbar";

  const titleSpan = document.createElement("span");
  titleSpan.textContent = title;

  const actions = document.createElement("div");

  const runButton = document.createElement("button");
  runButton.type = "button";
  runButton.textContent = "Run";

  const resetButton = document.createElement("button");
  resetButton.type = "button";
  resetButton.textContent = "Reset";
  resetButton.className = "secondary";

  const runtimeLabel = document.createElement("span");
  runtimeLabel.textContent = runtime === "legacy" ? "p5 1.x" : "p5 2.x";

  actions.appendChild(runButton);
  actions.appendChild(resetButton);

  toolbar.appendChild(titleSpan);
  toolbar.appendChild(actions);
  toolbar.appendChild(runtimeLabel);

  const body = document.createElement("div");
  body.className = "embed-body";

  let editor = null;
  let aceEditor = null;
  if (ace && typeof ace.edit === "function") {
    editor = document.createElement("div");
    editor.className = "embed-editor-ace";
    body.appendChild(editor);
    aceEditor = ace.edit(editor);
    if (JavaScriptMode && JavaScriptHighlightRules && inherits) {
      aceEditor.session.setMode(new P5Mode());
    } else if (JavaScriptMode) {
      aceEditor.session.setMode(new JavaScriptMode());
    } else {
      aceEditor.session.setMode("ace/mode/javascript");
    }
    if (crimsonTheme && crimsonTheme.cssClass) {
      aceEditor.setTheme(crimsonTheme);
    } else {
      aceEditor.setTheme("ace/theme/crimson_editor");
    }
    aceEditor.setOptions({
      fontSize: 13,
      tabSize: 2,
      useSoftTabs: true,
      showPrintMargin: false,
      wrap: true,
    });
    aceEditor.renderer.setPadding(14);
    aceEditor.session.setUseWorker(false);
    aceEditor.session.setValue(startCode, -1);
  } else {
    editor = existingEditor || document.createElement("textarea");
    editor.classList.add("embed-editor");
    editor.value = startCode;
    body.appendChild(editor);
  }

  const frame = document.createElement("iframe");
  frame.className = "embed-frame";
  frame.setAttribute(
    "sandbox",
    "allow-scripts allow-downloads allow-popups"
  );

  body.appendChild(frame);

  const consoleWrap = document.createElement("div");
  consoleWrap.className = "embed-console";

  const consoleHeader = document.createElement("div");
  consoleHeader.className = "embed-console-header";
  consoleHeader.textContent = "Console";

  const consoleClear = document.createElement("button");
  consoleClear.type = "button";
  consoleClear.className = "embed-console-clear";
  consoleClear.textContent = "Clear";

  const consoleHeaderRow = document.createElement("div");
  consoleHeaderRow.className = "embed-console-header-row";
  consoleHeaderRow.appendChild(consoleHeader);
  consoleHeaderRow.appendChild(consoleClear);

  const consoleBody = document.createElement("div");
  consoleBody.className = "embed-console-body";

  consoleWrap.appendChild(consoleHeaderRow);
  consoleWrap.appendChild(consoleBody);

  embed.appendChild(toolbar);
  embed.appendChild(body);
  embed.appendChild(consoleWrap);

  const clearConsole = () => {
    consoleBody.innerHTML = "";
  };

  const appendConsoleLine = (level, args) => {
    const line = document.createElement("div");
    line.className = `embed-console-line ${level}`;
    line.textContent = args.join(" ");
    consoleBody.appendChild(line);
    consoleBody.scrollTop = consoleBody.scrollHeight;
  };

  const run = () => {
    const value = aceEditor ? aceEditor.getValue() : editor.value;
    clearConsole();
    frame.srcdoc = buildSrcDoc(value, runtime, embedId);
  };

  runButton.addEventListener("click", run);
  consoleClear.addEventListener("click", clearConsole);
  resetButton.addEventListener("click", () => {
    if (aceEditor) {
      aceEditor.session.setValue(startCode, -1);
    } else {
      editor.value = startCode;
    }
    run();
  });

  if (aceEditor) {
    aceEditor.commands.addCommand({
      name: "runSketch",
      bindKey: { win: "Ctrl-Enter", mac: "Command-Enter" },
      exec: run,
    });
  } else if (editor) {
    editor.addEventListener("keydown", (event) => {
      if ((event.metaKey || event.ctrlKey) && event.key === "Enter") {
        event.preventDefault();
        run();
      }
    });
  }

  run();

  return { embedId, appendConsoleLine };
}

document.addEventListener("DOMContentLoaded", () => {
  const embeds = Array.from(document.querySelectorAll(".embed"));
  if (embeds.length === 0) {
    return;
  }

  const embedMap = new Map();
  embeds.forEach((embed) => {
    const instance = initEmbed(embed);
    if (instance) {
      embedMap.set(instance.embedId, instance);
    }
  });

  window.addEventListener("message", (event) => {
    const data = event.data;
    if (!data || data.source !== "p5zine-embed") {
      return;
    }
    const target = embedMap.get(data.embedId);
    if (!target) {
      return;
    }
    if (data.type === "console") {
      const level = data.payload?.level || "log";
      const args = Array.isArray(data.payload?.args) ? data.payload.args : [String(data.payload)];
      target.appendConsoleLine(level, args);
    }
  });
});
