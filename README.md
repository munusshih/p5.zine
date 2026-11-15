# p5.zine

p5.zine is a **browser‑first** library on top of p5.js for making printable zines. It creates five `p5.Graphics` pages (cover, one, two, three, back) and provides helpers for layout, export, and preview.

> ✅ **Intended usage:** load via `<script>` tags (CDN or local file).  
> ❌ **Not meant** to be imported as an ES module in bundlers.

## Quick start (CDN, easiest)

### p5 1.x + 2.x (global)

```html
<script src="https://cdn.jsdelivr.net/npm/p5@2/lib/p5.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/p5.zine@0.0.4"></script>
<script>
  window.zine = {
    title: "My Zine",
    accentColor: "#7c3aed",
    cam: false
  };

  function setup() {
    zinePageSize("8.5in", "11in");
    cover.background(255);
    cover.text("Hello", 40, 60);
  }

  function draw() {
    one.background(240);
    if (one.mouseHere) {
      one.ellipse(one.mouseX, one.mouseY, 40);
    }
  }
</script>
```

## Table of contents

- [p5.zine](#p5zine)
  - [Quick start (CDN, easiest)](#quick-start-cdn-easiest)
    - [p5 1.x + 2.x (global)](#p5-1x--2x-global)
  - [Table of contents](#table-of-contents)
  - [Bundles (p5 2.x + 1.x)](#bundles-p5-2x--1x)
  - [Local dev / preview](#local-dev--preview)
  - [Offline playground](#offline-playground)
  - [Pages](#pages)
  - [Configuration (`window.zine`)](#configuration-windowzine)
    - [Accent color](#accent-color)
  - [Preview modes](#preview-modes)
  - [Mouse handling](#mouse-handling)
  - [Download background](#download-background)
  - [Page size vs. paper size](#page-size-vs-paper-size)
    - [`zinePageSize(width, height, options)`](#zinepagesizewidth-height-options)
    - [`zinePaperSize(width, height, options)`](#zinepapersizewidth-height-options)
  - [Export](#export)
    - [JPG / PNG](#jpg--png)
    - [PDF](#pdf)
  - [Custom helpers (custom.js)](#custom-helpers-customjs)
  - [CDN usage (advanced)](#cdn-usage-advanced)
    - [UMD via jsDelivr](#umd-via-jsdelivr)
    - [UMD via UNPKG](#umd-via-unpkg)
  - [Architecture (1.x + 2.x addons)](#architecture-1x--2x-addons)
  - [Internal defaults](#internal-defaults)

## Bundles (p5 2.x + 1.x)

The build outputs:

- `dist/p5.zine.js` → **p5 1.x + 2.x** (window-globals)
- `dist/p5.zine.full.js` → **p5 1.x + 2.x** with jsPDF bundled (offline PDF export)

## Local dev / preview

```bash
npm run dev
```

Open:

- `http://localhost:3000/test/index.html` (p5 2.x + p5.zine.js)
- `http://localhost:3000/test/index.legacy.html` (p5 1.x + p5.zine.js)
- `http://localhost:3000/test/compat.html` (side‑by‑side 1.x vs 2.x)

Other scripts:

```bash
npm run build
npm run preview
npm run test
```

## Offline playground

Run `npm ci` once while online, then run `npm run playground`.
Open `dist/p5-zine-playground/index.html` in a browser. Edit the `sketch.js`
beside it and refresh to see your changes. The folder contains p5.js and the
full p5.zine bundle, including PDF export. You can copy the entire folder
elsewhere and open it without a server, npm, or Wi-Fi. Rebuilding preserves
your edits to the generated `sketch.js`.

## Pages

The library exposes five `p5.Graphics` pages:

- `cover`
- `one`
- `two`
- `three`
- `back`

Each page is its own canvas. In the default preview mode, these canvases are mounted in the DOM and scaled responsively.
With `0.0.3`, the page globals are ready in `draw()`. Starting with
`0.0.4`, they are also ready in `setup()`; call any page sizing helper
before drawing so it can rebuild the canvases at the requested size.

## Configuration (`window.zine`)

The local build also accepts these settings in `createZine(width, height, options)`.
Call it at the start of `setup()`, before drawing on the pages. Dimensions
accept the same units as `zinePageSize()`, and `options.dpi` controls print resolution.

```js
function setup() {
  createZine("8.5in", "11in", {
    title: "My Zine",
    accentColor: "#7c3aed",
    cam: false,
  });
  cover.background(255);
  cover.text("Hello", 40, 60);
}
```

Existing sketches can keep `window.zine`, `zinePageSize()`, and `zinePaperSize()`.
The local build also recognizes classic `setupPage()` and `drawPage()` callbacks
when the corresponding p5 `setup()` or `draw()` function is absent.

Set options **before** `setup()` runs:

```js
window.zine = {
  title: "My Zine",
  author: "Your Name",
  authorUrl: "https://example.com",
  accentColor: "#7c3aed",
  preview: "pages", // "pages" (default) or "canvas"
  cam: false, // set false to disable webcam capture
  downloadFormat: "png", // "png" (default) or "jpg"
};
```

Other optional settings:

- `description`, `authorUrl`, `accentColor`
- `frameRate`, `pixelDensity`
- `downloadBackground` (set `"transparent"` for PNG)
- `mouseClamp`, `mousePadding`
- `pdfCdn` (override jsPDF CDN for PDF export)

Sizing is configured via `zinePageSize` / `zinePaperSize` (below).

### Accent color

Set `accentColor` once in `window.zine` to recolor the preview UI, including its headings, labels, borders, and buttons:

```js
window.zine = {
  accentColor: "#7c3aed",
};
```

This changes the p5.zine interface, not the artwork drawn inside your pages. Page colors remain under your sketch’s control.

## Preview modes

- `preview: "pages"` (default) mounts each page canvas in the DOM and scales them responsively.
- `preview: "canvas"` uses the legacy big preview canvas.

## Mouse handling

`page.mouseX/page.mouseY` are only populated when the pointer is over that page’s canvas.
When the pointer is outside, they become `null` and `page.mouseHere` is `false`.

## Download background

Exports are rendered to an offscreen graphics buffer. By default a white background is applied so JPEGs are not black.
Set `downloadBackground: "transparent"` to keep transparency (only works with PNG).

## Page size vs. paper size

### `zinePageSize(width, height, options)`

Sets the **base size for each single page** (cover/back). Full spreads are 2× width.

```js
function setup() {
  zinePageSize("8.5in", "11in", { dpi: 96 });
  cover.background(255);
}
```

Call the sizing helper once, at the beginning of `setup()`, before drawing on a page.

### `zinePaperSize(width, height, options)`

Sets the **full paper size** (imposition) and derives the page size:

- `pageWidth = paperHeight / 4`
- `pageHeight = paperWidth / 2`

```js
function setup() {
  zinePaperSize("11in", "17in", { dpi: 300 });
}
```

If you call both helpers, **the last call wins**.

Supported units: `px`, `in`, `cm`, `mm`, `pt`. If you pass a number (or unitless string), it’s treated as pixels.

## Export

### JPG / PNG

The “download” button exports each page as an image. The extension matches `downloadFormat`.

### PDF

PDFs are generated using the imposition layout. The PDF page size is derived from the
`dpi` you pass to `zinePageSize` / `zinePaperSize`, so the PDF matches the paper dimensions.

For smaller bundle sizes, jsPDF is **lazy‑loaded** from a CDN when you click “download .pdf”.
If you’re offline or want to self‑host, include jsPDF yourself or set `window.zine.pdfCdn`.
You can also use the **full** bundle (`p5.zine.full.js`) which includes jsPDF.

## Custom helpers (custom.js)

These helpers are available on both `p5` and `p5.Graphics`:

- `Background`
- `selfieBackground`
- `rightCamera`
- `randomLayout`
- `gridLayout`
- `glitchLayout`
- `leftBackground`
- `rightBackground`
- `fullPage`
- `leftPage`
- `rightPage`
- `textSet`
- `textBox`

## CDN usage (advanced)

If you omit the version, the CDN serves the latest npm tag. Pin an exact version for published projects so a future release cannot change their behavior unexpectedly.

### UMD via jsDelivr

**Global (p5 1.x + 2.x):**

```html
<script src="https://cdn.jsdelivr.net/npm/p5.zine"></script>
```

**Global + jsPDF bundled:**

```html
<script src="https://cdn.jsdelivr.net/npm/p5.zine/dist/p5.zine.full.js"></script>
```

### UMD via UNPKG

**Global (p5 1.x + 2.x):**

```html
<script src="https://unpkg.com/p5.zine/dist/p5.zine.js"></script>
```

**Global + jsPDF bundled:**

```html
<script src="https://unpkg.com/p5.zine/dist/p5.zine.full.js"></script>
```

## Architecture (1.x + 2.x addons)

Core addon logic lives in:

- `src/zine.js`
- `src/custom.js`
- `src/ui.js` (UI HTML + CSS injection)

Adapters bridge to each runtime:

- `src/adapters/p5-universal.js` → **p5 1.x + 2.x** (window-globals)

Entry points:

- `src/index.js` → global bundle
- `src/index.full.js` → global bundle with jsPDF

## Internal defaults

```js
const DEFAULTS = {
  maxSinglePageWidth: 400,
  rWidth: 198,
  rHeight: 306,
  pWidth: 800,
  frameRate: 10,
  pixelDensity: 1,
  accentColor: "#ed225d",
};
```

- `maxSinglePageWidth`: cap for the legacy preview canvas.
- `rWidth` / `rHeight`: reference ratio used to compute page height from width.
- `pWidth`: base width for a single page (pixels).
- `accentColor`: fallback interface accent when `window.zine.accentColor` is not set.
