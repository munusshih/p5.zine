# p5.zine

p5.zine is a **browser‑first** library on top of p5.js for making printable zines. It creates five `p5.Graphics` pages (cover, one, two, three, back) and provides helpers for layout, export, and preview.

> ✅ **Intended usage:** load via `<script>` tags (CDN or local file).  
> ❌ **Not meant** to be imported as an ES module in bundlers.

## Quick start (CDN, easiest)

### p5 2.x

```html
<script src="https://cdn.jsdelivr.net/npm/p5@2/lib/p5.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/p5.zine"></script>
<script>
  function setup() {}
  function draw() {
    cover.background(255);
    cover.text("Hello", 40, 60);

    one.background(240);
    if (one.mouseHere) {
      one.ellipse(one.mouseX, one.mouseY, 40);
    }
  }
</script>
```

### p5 1.x (legacy)

```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.11.1/p5.js"></script>
<script src="https://cdn.jsdelivr.net/npm/p5.zine/dist/p5.zine.legacy.js"></script>
```

## Table of contents

- [p5.zine](#p5zine)
  - [Quick start (CDN, easiest)](#quick-start-cdn-easiest)
    - [p5 2.x](#p5-2x)
    - [p5 1.x (legacy)](#p5-1x-legacy)
  - [Table of contents](#table-of-contents)
  - [Bundles (p5 2.x + 1.x)](#bundles-p5-2x--1x)
  - [Local dev / preview](#local-dev--preview)
  - [Pages](#pages)
  - [Configuration (`window.zine`)](#configuration-windowzine)
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
  - [Architecture (1.x + 2.x addons)](#architecture-1x--2x-addons)
  - [Internal defaults](#internal-defaults)

## Bundles (p5 2.x + 1.x)

The build outputs two bundles:

- `dist/p5.zine.js` → **p5 2.x** (`p5.registerAddon`)
- `dist/p5.zine.legacy.js` → **p5 1.x** (`p5.prototype` + `registerMethod`)
- `dist/p5.zine.full.js` → **p5 2.x** with jsPDF bundled (offline PDF export)
- `dist/p5.zine.legacy.full.js` → **p5 1.x** with jsPDF bundled (offline PDF export)

## Local dev / preview

```bash
npm run dev
```

Open:

- `http://localhost:3000/test/index.html` (p5 2.x)
- `http://localhost:3000/test/index.legacy.html` (p5 1.x)
- `http://localhost:3000/test/compat.html` (side‑by‑side)

Other scripts:

```bash
npm run build
npm run preview
npm run test
```

## Pages

The library exposes five `p5.Graphics` pages:

- `cover`
- `one`
- `two`
- `three`
- `back`

Each page is its own canvas. In the default preview mode, these canvases are mounted in the DOM and scaled responsively.

## Configuration (`window.zine`)

Set options **before** `setup()` runs:

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
  mousePadding: 0, // when mouseClamp is false, allow extra padding

  // page size (single page)
  pageWidth: "8.5in",
  pageHeight: "11in",
  // or pageSize: { width: "8.5in", height: "11in" }

  // paper size (imposition)
  // paperWidth: "11in",
  // paperHeight: "17in",
  // or paperSize: { width: "11in", height: "17in" }

  // DPI + units (used for inches/cm/mm/pt conversions)
  pageDPI: 96,
  pageUnit: "in",

  // Optional: override the jsPDF CDN used for PDF export
  // pdfCdn: "https://cdn.jsdelivr.net/npm/jspdf@2/dist/jspdf.umd.min.js"
};
```

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
}
```

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

Supported units: `px`, `in`, `cm`, `mm`, `pt`. If you pass a number (or unitless string), it’s treated as pixels unless you set `pageUnit`.

## Export

### JPG / PNG

The “download” button exports each page as an image. The extension matches `downloadFormat`.

### PDF

PDFs are generated using the imposition layout. The PDF page size is derived from your
`pageDPI` / `paperDPI` so the PDF matches the paper dimensions instead of forcing Letter.

For smaller bundle sizes, jsPDF is **lazy‑loaded** from a CDN when you click “download .pdf”.
If you’re offline or want to self‑host, include jsPDF yourself or set `window.zine.pdfCdn`.
You can also use the **full** bundles (`p5.zine.full.js`, `p5.zine.legacy.full.js`) which include jsPDF.

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

If you omit the version, CDN will serve the latest tag (which can include breaking changes).

### UMD via jsDelivr

**p5 2.x (modern):**

```html
<script src="https://cdn.jsdelivr.net/npm/p5.zine"></script>
```

**p5 1.x (legacy):**

```html
<script src="https://cdn.jsdelivr.net/npm/p5.zine/dist/p5.zine.legacy.js"></script>
```

**p5 2.x (modern, full):**

```html
<script src="https://cdn.jsdelivr.net/npm/p5.zine/dist/p5.zine.full.js"></script>
```

**p5 1.x (legacy, full):**

```html
<script src="https://cdn.jsdelivr.net/npm/p5.zine/dist/p5.zine.legacy.full.js"></script>
```

### UMD via UNPKG

**p5 2.x (modern):**

```html
<script src="https://unpkg.com/p5.zine/dist/p5.zine.js"></script>
```

**p5 1.x (legacy):**

```html
<script src="https://unpkg.com/p5.zine/dist/p5.zine.legacy.js"></script>
```

**p5 2.x (modern, full):**

```html
<script src="https://unpkg.com/p5.zine/dist/p5.zine.full.js"></script>
```

**p5 1.x (legacy, full):**

```html
<script src="https://unpkg.com/p5.zine/dist/p5.zine.legacy.full.js"></script>
```

## Architecture (1.x + 2.x addons)

Core addon logic lives in:

- `src/zine.js`
- `src/custom.js`

Adapters bridge to each runtime:

- `src/adapters/p5-2.js` → uses `p5.registerAddon(...)` (p5 2.x)
- `src/adapters/p5-1.js` → patches `p5.prototype` and maps lifecycles to `registerMethod(...)` (p5 1.x)

Entry points:

- `src/index.modern.js` → modern bundle
- `src/index.legacy.js` → legacy bundle

## Internal defaults

```js
const DEFAULTS = {
  maxSinglePageWidth: 400,
  rWidth: 198,
  rHeight: 306,
  pWidth: 800,
  frameRate: 10,
  pixelDensity: 1,
};
```

- `maxSinglePageWidth`: cap for the legacy preview canvas.
- `rWidth` / `rHeight`: reference ratio used to compute page height from width.
- `pWidth`: base width for a single page (pixels).

If you want these exposed as public config, say the word and I’ll wire them up.
