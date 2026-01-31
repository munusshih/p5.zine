# p5.zine

p5.zine is a small community library on top of p5.js for making zines with a simple page workflow.

## Install

```bash
npm install p5.zine
```

## Local dev / preview

```bash
npm run dev
```

Open:

- `http://localhost:3000/test/index.html` (p5 2.x)
- `http://localhost:3000/test/index.legacy.html` (p5 1.x)

Other scripts:

```bash
npm run build
npm run preview
npm run test
```

## Bundles

The build outputs two files:

- `dist/p5.zine.js` (p5 2.x addon API)
- `dist/p5.zine.legacy.js` (p5 1.x)

## Addon architecture (1.x + 2.x)

The core addon logic lives in:

- `src/zine.js`
- `src/custom.js`

These files are written against the **p5 2.x addon signature** (`(p5, fn, lifecycles)`), but do **not** auto-register.

Adapters bridge to each runtime:

- `src/adapters/p5-2.js` uses `p5.registerAddon(...)` (p5 2.x)
- `src/adapters/p5-1.js` patches `p5.prototype` and maps lifecycles to `registerMethod(...)` (p5 1.x)

The two entry points (`src/index.modern.js` and `src/index.legacy.js`) import the right adapter so each bundle stays compatible.

## Quick start (global mode)

```html
<script src="https://cdn.jsdelivr.net/npm/p5@2.2.0/lib/p5.min.js"></script>
<script src="./dist/p5.zine.js"></script>
<script>
  function setup() {}
  function draw() {
    cover.background(255);
    cover.text("Hello", 40, 60);

    one.background(240);
    one.ellipse(one.mouseX, one.mouseY, 40);
  }
</script>
```

For p5 1.x, swap the CDN and use `p5.zine.legacy.js`:

```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.11.1/p5.js"></script>
<script src="./dist/p5.zine.legacy.js"></script>
```

## Pages

The library exposes five `p5.Graphics` pages you can draw into:

- `cover`
- `one`
- `two`
- `three`
- `back`

Each page is its own canvas. In preview mode (default), those canvases are mounted in the DOM and scaled to fit the container.

## Configuration

Set options on `window.zine` before `setup()` runs:

```js
window.zine = {
  title: "My Zine",
  author: "Your Name",
  personalUrl: "https://example.com",
  description: "Short description",
  cam: true, // set false to disable webcam capture
  frameRate: 10,
  pixelDensity: 1,
  preview: "pages", // "pages" (default) or "canvas"
  downloadFormat: "png", // "png" (default) or "jpg"
  downloadBackground: "#ffffff", // default white; use "transparent" for none
  mouseClamp: true, // keep mouse within each page
  mousePadding: 0 // when mouseClamp is false, allow extra padding
};
```

### Preview modes

- `preview: "pages"` (default) mounts each page canvas in the DOM and scales them responsively.
- `preview: "canvas"` uses the legacy big preview canvas.

### Download background

Exports are rendered to an offscreen graphics buffer. By default a white background is applied so JPEGs are not black.
Set `downloadBackground: "transparent"` to keep transparency (only works with PNG).

### Mouse handling

`page.mouseX/page.mouseY` are only populated when the pointer is over that page’s canvas.
When the pointer is outside, they become `null` and `page.mouseHere` is `false`.

## Internal defaults

These are internal sizing defaults used by the renderer. They are not currently exposed as public config:

```js
const DEFAULTS = {
  maxSinglePageWidth: 400,
  rWidth: 198,
  rHeight: 306,
  pWidth: 800,
  frameRate: 10,
  pixelDensity: 1
};
```

- `maxSinglePageWidth`: max width (px) for a single page when using the legacy preview canvas.
- `rWidth` / `rHeight`: reference ratio used to compute page height from `pWidth`.
- `pWidth`: base width (px) for a single page graphics buffer.
- `frameRate` / `pixelDensity`: default p5 settings (can be overridden via `window.zine`).

If you want these exposed as public config, say the word and I can wire that up.
