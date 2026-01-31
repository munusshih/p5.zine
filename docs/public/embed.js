const DEFAULT_CODE = `function setup() {
  zinePageSize("8.5in", "11in");
}

function draw() {
  cover.background(255);
  cover.text("hello zine", 40, 60);
}`;

function buildSrcDoc(code, runtime) {
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
${code}
    </script>
  </body>
</html>`;
}

function initEmbed(embed) {
  const runtime = embed.dataset.runtime === "legacy" ? "legacy" : "modern";
  const title = embed.dataset.title || "Live editor";

  const existingEditor = embed.querySelector("textarea");
  const initialCode = (existingEditor ? existingEditor.value : embed.dataset.code || "").trim();
  const startCode = initialCode || DEFAULT_CODE;

  const editor = existingEditor || document.createElement("textarea");
  editor.classList.add("embed-editor");
  editor.value = startCode;

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

  const frame = document.createElement("iframe");
  frame.className = "embed-frame";
  frame.setAttribute("sandbox", "allow-scripts allow-same-origin");

  body.appendChild(editor);
  body.appendChild(frame);

  embed.appendChild(toolbar);
  embed.appendChild(body);

  const run = () => {
    frame.srcdoc = buildSrcDoc(editor.value, runtime);
  };

  runButton.addEventListener("click", run);
  resetButton.addEventListener("click", () => {
    editor.value = startCode;
    run();
  });

  run();
}

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".embed").forEach(initEmbed);
});
