import { jsPDF } from "jspdf";
import { resolvePageDimensions } from "./page-size.js";

const PAGE_DEFS = [
  { key: "cover", label: "cover", pageSize: "single", widthMultiplier: 1 },
  { key: "one", label: "one", pageSize: "full", widthMultiplier: 2 },
  { key: "two", label: "two", pageSize: "full", widthMultiplier: 2 },
  { key: "three", label: "three", pageSize: "full", widthMultiplier: 2 },
  { key: "back", label: "back", pageSize: "single", widthMultiplier: 1 },
];

const DEFAULTS = {
  maxSinglePageWidth: 400,
  rWidth: 198,
  rHeight: 306,
  pWidth: 800,
  frameRate: 10,
  pixelDensity: 1,
};

const PREVIEW_MODES = {
  CANVAS: "canvas",
  PAGES: "pages",
};

let activeZine = null;

function resolveP5Instance(candidate) {
  if (typeof window !== "undefined" && candidate === window) {
    if (typeof p5 !== "undefined" && p5.instance) {
      return p5.instance;
    }
  }
  return candidate;
}

class ZinePage {
  constructor(p, def, pWidth, pHeight) {
    this.key = def.key;
    this.label = def.label;
    this.pageSize = def.pageSize;
    this.widthMultiplier = def.widthMultiplier;
    this.graphics = p.createGraphics(pWidth * def.widthMultiplier, pHeight);
    this.graphics.pageSize = def.pageSize;
    this.canvasEl = this.graphics.canvas || this.graphics.elt || null;
    this.wrapper = null;
    this.labelEl = null;
  }
}

class ZineManager {
  constructor(p) {
    this.p = resolveP5Instance(p);
    this.canvas = null;
    this.pages = [];
    this.pageMap = new Map();
    this.graphicsMap = new Map();
    this.pageContainer = null;
    this.borderYes = true;
    this.previewMode = PREVIEW_MODES.PAGES;
    this.lastPointer = null;
    this.pointerBound = false;

    this.maxSinglePageWidth = DEFAULTS.maxSinglePageWidth;
    this.rWidth = DEFAULTS.rWidth;
    this.rHeight = DEFAULTS.rHeight;
    this.pageRatio = this.rWidth / this.rHeight;
    this.pWidth = DEFAULTS.pWidth;
    this.pHeight = this.pWidth / this.pageRatio;
    this.pageDPI = 96;

    this.aWidth = 0;
    this.aHeight = 0;
    this.gap = 0;
    this.frameRate = DEFAULTS.frameRate;
    this.pixelDensity = DEFAULTS.pixelDensity;
    this.downloadBackground = "#ffffff";
    this.downloadFormat = "png";
    this.mousePadding = 0;
    this.clampMouse = true;
  }

  init() {
    this.applyConfig();
    this.createRootCanvas();

    if (this.previewMode === PREVIEW_MODES.CANVAS) {
      this.updateAdaptiveWidth();
    }

    this.createPages();
    this.applyCoreSettings();
    this.updateTitle();
    this.updateDownloadLabels();
    this.initCapture();

    if (this.previewMode === PREVIEW_MODES.CANVAS) {
      this.resizeCanvas();
    } else {
      this.mountPages();
      this.layoutPages();
      this.bindPointerTracking();
    }
  }

  applyConfig() {
    if (typeof window === "undefined") {
      return;
    }

    if (typeof window.zine === "object" && window.zine !== null) {
      this.frameRate =
        typeof window.zine.frameRate !== "undefined"
          ? window.zine.frameRate
          : this.frameRate;
      this.pixelDensity =
        typeof window.zine.pixelDensity !== "undefined"
          ? window.zine.pixelDensity
          : this.pixelDensity;
    }

    const { width, height, dpi } = resolvePageDimensions(window.zine || {}, {
      width: this.pWidth,
      height: this.pHeight,
      ratio: this.pageRatio,
    });

    if (typeof width === "number" && typeof height === "number") {
      this.pWidth = width;
      this.pHeight = height;
      this.pageRatio = width / height;
    }
    if (typeof dpi === "number") {
      this.pageDPI = dpi;
    }

    const previewMode = window.zine?.preview;
    if (previewMode === PREVIEW_MODES.CANVAS) {
      this.previewMode = PREVIEW_MODES.CANVAS;
    } else if (previewMode === PREVIEW_MODES.PAGES || previewMode === "dom") {
      this.previewMode = PREVIEW_MODES.PAGES;
    }

    if (typeof window.zine?.downloadBackground !== "undefined") {
      this.downloadBackground = window.zine.downloadBackground;
    }

    if (typeof window.zine?.downloadFormat === "string") {
      const format = window.zine.downloadFormat.toLowerCase();
      if (format === "png" || format === "jpg" || format === "jpeg") {
        this.downloadFormat = format === "jpeg" ? "jpg" : format;
      }
    }

    if (typeof window.zine?.mousePadding === "number") {
      this.mousePadding = window.zine.mousePadding;
    }

    if (typeof window.zine?.mouseClamp === "boolean") {
      this.clampMouse = window.zine.mouseClamp;
    }
  }

  createRootCanvas() {
    if (this.previewMode === PREVIEW_MODES.CANVAS) {
      const windowW = this.getWindowWidth();
      this.canvas = this.p.createCanvas(windowW - 17, windowW * 3.3);
      this.canvas.parent("#myCanvas");
      return;
    }

    this.canvas = this.p.createCanvas(1, 1);
    this.canvas.hide();
  }

  getWindowWidth() {
    if (typeof windowWidth !== "undefined") {
      return windowWidth;
    }
    if (typeof this.p.windowWidth !== "undefined") {
      return this.p.windowWidth;
    }
    if (typeof window !== "undefined") {
      return window.innerWidth;
    }
    return this.p.width || 0;
  }

  getMaxCanvasWidth() {
    return (this.maxSinglePageWidth * 2) / 0.7;
  }

  createPages() {
    this.pages = PAGE_DEFS.map(
      (def) => new ZinePage(this.p, def, this.pWidth, this.pHeight),
    );
    this.pageMap = new Map(this.pages.map((page) => [page.key, page]));
    this.graphicsMap = new Map(this.pages.map((page) => [page.graphics, page]));

    this.pages.forEach((page) => {
      if (typeof page.graphics.pixelDensity === "function") {
        page.graphics.pixelDensity(this.pixelDensity);
      }
      if (typeof page.graphics.frameRate === "function") {
        page.graphics.frameRate(this.frameRate);
      }
    });

    const graphics = this.pages.map((page) => page.graphics);
    this.pages.forEach((page) => {
      this.p[page.key] = page.graphics;
    });

    this.p.all = graphics;
  }

  mountPages() {
    if (typeof document === "undefined") {
      return;
    }

    const container = document.querySelector("#myCanvas") || document.body;
    this.pageContainer = container;
    container.classList.add("zine-pages");

    container.querySelectorAll(".zine-page").forEach((node) => node.remove());

    this.pages.forEach((page) => {
      const canvasEl =
        page.canvasEl || page.graphics.canvas || page.graphics.elt;
      if (!canvasEl) {
        return;
      }

      const wrapper = document.createElement("div");
      wrapper.className = "zine-page";

      const label = document.createElement("div");
      label.className = "zine-page-label";
      label.textContent = page.label || "";

      canvasEl.classList.add("zine-page-canvas");
      canvasEl.style.display = "block";

      wrapper.appendChild(label);
      wrapper.appendChild(canvasEl);
      container.appendChild(wrapper);

      page.canvasEl = canvasEl;
      page.wrapper = wrapper;
      page.labelEl = label;
    });

    this.setPreviewChromeVisible(this.borderYes);
  }

  layoutPages() {
    if (!this.pageContainer) {
      return;
    }

    const containerWidth =
      this.pageContainer.clientWidth ||
      (typeof window !== "undefined" ? window.innerWidth : 0);
    const padding = 32;
    const availableWidth = Math.max(0, containerWidth - padding);

    this.pages.forEach((page) => {
      const canvasEl = page.canvasEl;
      if (!canvasEl) {
        return;
      }

      const scale =
        availableWidth > 0
          ? Math.min(1, availableWidth / page.graphics.width)
          : 1;
      const width = Math.round(page.graphics.width * scale);
      const height = Math.round(page.graphics.height * scale);

      canvasEl.style.width = `${width}px`;
      canvasEl.style.height = `${height}px`;

      if (page.wrapper) {
        page.wrapper.style.width = `${width}px`;
      }
    });
  }

  setPreviewChromeVisible(isVisible) {
    if (!this.pageContainer) {
      return;
    }

    this.pageContainer.classList.toggle("zine-preview-hidden", !isVisible);
  }

  bindPointerTracking() {
    if (this.pointerBound || typeof window === "undefined") {
      return;
    }

    this.pointerBound = true;
    const handler = (event) => {
      this.lastPointer = { x: event.clientX, y: event.clientY };
    };

    window.addEventListener("pointermove", handler);
    window.addEventListener("pointerdown", handler);
    this.pointerHandler = handler;
  }

  applyCoreSettings() {
    this.p.pixelDensity(this.pixelDensity);
    this.p.frameRate(this.frameRate);
    this.p.angleMode(this.p.DEGREES);
    this.p.noStroke();
  }

  updateAdaptiveWidth() {
    if (this.previewMode !== PREVIEW_MODES.CANVAS) {
      return;
    }

    this.aWidth = Math.min((this.p.width / 2) * 0.7, this.maxSinglePageWidth);
    this.aHeight = this.pageRatio ? this.aWidth / this.pageRatio : this.aWidth;
    this.gap = this.aWidth / 4;
  }

  resizeCanvas() {
    if (this.previewMode !== PREVIEW_MODES.CANVAS) {
      this.layoutPages();
      return;
    }

    const windowW = this.getWindowWidth();
    const maxCanvasWidth = this.getMaxCanvasWidth();

    if (windowW >= maxCanvasWidth) {
      this.p.resizeCanvas(maxCanvasWidth, maxCanvasWidth * 3.3);
    } else {
      this.p.resizeCanvas(windowW - 17, windowW * 3.3);
    }
  }

  updateTitle() {
    if (typeof window === "undefined") {
      return;
    }

    if (typeof window.zine === "object" && window.zine !== null) {
      const titleEl = document.querySelector("#genTitle");
      const authorEl = document.querySelector("#author");
      const descEl = document.querySelector("#des");

      if (titleEl) {
        titleEl.innerHTML = window.zine?.title || "Default Title";
      }
      if (authorEl) {
        authorEl.innerHTML = window.zine?.author
          ? `by <a href="${window.zine?.personalUrl || "#"}">${
              window.zine?.author
            }</a>`
          : "by Unknown Author";
      }
      if (descEl) {
        descEl.innerHTML =
          window.zine?.description || "No description available.";
      }
    }
  }

  updateDownloadLabels() {
    if (typeof document === "undefined") {
      return;
    }

    const downloadButton = document.getElementById("download-jpg");
    if (!downloadButton) {
      return;
    }

    const extension = this.downloadFormat === "png" ? "png" : "jpg";
    downloadButton.value = `*download .${extension}*`;
  }

  initCapture() {
    if (typeof window === "undefined") {
      return;
    }

    if (
      typeof window.zine !== "undefined" &&
      (window.zine?.cam === false ||
        window.zine?.cam === "false" ||
        window.zine?.cam === "False" ||
        window.zine?.cam === "FALSE")
    ) {
      return;
    }

    this.p.selfie = this.p.createCapture(this.p.VIDEO);
    this.p.selfie.hide();
  }

  getLayout() {
    if (this.previewMode !== PREVIEW_MODES.CANVAS) {
      return [];
    }

    const canvasWidth = this.p.width;
    return this.pages.map((page, index) => {
      const isSingle = page.pageSize === "single";
      const width = this.aWidth * (isSingle ? 1 : 2);
      const height = this.aHeight;
      const x = canvasWidth / 2 - (isSingle ? this.aWidth / 2 : this.aWidth);
      const y = this.gap + (this.aHeight + this.gap) * index;
      return { page, index, x, y, width, height, isSingle };
    });
  }

  drawPreview() {
    if (this.previewMode !== PREVIEW_MODES.CANVAS || !this.borderYes) {
      return;
    }

    const p = this.p;
    const layout = this.getLayout();

    p.push();

    layout.forEach((item) => {
      p.image(item.page.graphics, item.x, item.y, item.width, item.height);
    });

    p.noStroke();
    p.fill("#ed225d");
    p.textSize(15);
    p.textFont("monospace");
    layout.forEach((item) => {
      if (item.page.label) {
        p.text(item.page.label, item.x, item.y - 10);
      }
    });

    p.noFill();
    p.stroke("#ed225d");
    p.strokeWeight(1);
    layout.forEach((item) => {
      if (item.isSingle) {
        p.rect(item.x, item.y, this.aWidth, this.aHeight);
      } else {
        p.rect(item.x, item.y, this.aWidth, this.aHeight);
        p.rect(item.x + this.aWidth, item.y, this.aWidth, this.aHeight);
      }
    });

    p.pop();
  }

  setPagesPixelDensity(num) {
    this.pages.forEach((page) => {
      page.graphics.pixelDensity(num);
    });
  }

  applyPreviewPixelDensity() {
    const target = this.pixelDensity;
    if (
      typeof this.p.pixelDensity === "function" &&
      this.p.pixelDensity() !== target
    ) {
      this.p.pixelDensity(target);
    }

    this.pages.forEach((page) => {
      if (typeof page.graphics.pixelDensity === "function") {
        if (page.graphics.pixelDensity() !== target) {
          page.graphics.pixelDensity(target);
        }
      }
      if (typeof page.graphics.frameRate === "function") {
        page.graphics.frameRate(this.frameRate);
      }
    });
  }

  updateMousePositions() {
    const pages = this.pages.map((page) => page.graphics);
    this.updateMousePositionsFor(pages);
  }

  updateMousePositionsFor(pages) {
    if (!pages || pages.length === 0) {
      return;
    }

    const padding = this.mousePadding ?? 0;

    if (this.previewMode === PREVIEW_MODES.CANVAS) {
      if (this.aWidth === 0) {
        return;
      }

      const ratioer = this.pWidth / this.aWidth;

      pages.forEach((page, index) => {
        if (!page) {
          return;
        }

        const isSingle = page.width === this.pWidth;
        const baseX =
          this.p.width / 2 - (isSingle ? this.aWidth / 2 : this.aWidth);
        const baseY = this.gap + (this.aHeight + this.gap) * index;

        const minOffset = this.clampMouse ? 0 : -padding;
        const maxX = this.clampMouse ? page.width : page.width + padding;
        const maxY = this.clampMouse ? page.height : page.height + padding;

        const localX = (this.p.mouseX - baseX) * ratioer;
        const localY = (this.p.mouseY - baseY) * ratioer;
        const isInside =
          localX >= 0 &&
          localX <= page.width &&
          localY >= 0 &&
          localY <= page.height;

        page.mouseHere = isInside;
        if (!isInside) {
          page.mouseX = null;
          page.mouseY = null;
          return;
        }

        page.mouseX = this.p.constrain(localX, minOffset, maxX);
        page.mouseY = this.p.constrain(localY, minOffset, maxY);
      });

      return;
    }

    this.updateMousePositionsFromPointer(pages);
  }

  updateMousePositionsFromPointer(pages) {
    if (!this.lastPointer) {
      return;
    }

    const padding = this.mousePadding ?? 0;

    pages.forEach((graphics) => {
      const page = this.graphicsMap.get(graphics);
      const canvasEl = page?.canvasEl;
      if (!canvasEl) {
        return;
      }

      const rect = canvasEl.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) {
        return;
      }

      const scaleX = graphics.width / rect.width;
      const scaleY = graphics.height / rect.height;
      const localX = (this.lastPointer.x - rect.left) * scaleX;
      const localY = (this.lastPointer.y - rect.top) * scaleY;

      const minOffset = this.clampMouse ? 0 : -padding;
      const maxX = this.clampMouse ? graphics.width : graphics.width + padding;
      const maxY = this.clampMouse
        ? graphics.height
        : graphics.height + padding;

      const isInside =
        this.lastPointer.x >= rect.left &&
        this.lastPointer.x <= rect.right &&
        this.lastPointer.y >= rect.top &&
        this.lastPointer.y <= rect.bottom;

      graphics.mouseHere = isInside;
      if (!isInside) {
        graphics.mouseX = null;
        graphics.mouseY = null;
        return;
      }

      graphics.mouseX = this.p.constrain(localX, minOffset, maxX);
      graphics.mouseY = this.p.constrain(localY, minOffset, maxY);
    });
  }

  getPage(key) {
    return this.pageMap.get(key)?.graphics || null;
  }

  getDownloadBackground() {
    if (
      this.downloadBackground === null ||
      this.downloadBackground === false ||
      this.downloadBackground === "transparent" ||
      this.downloadBackground === "none"
    ) {
      return null;
    }

    return this.downloadBackground || "#ffffff";
  }

  buildPageExportGraphic(source) {
    const pg = this.p.createGraphics(source.width, source.height);
    pg.pixelDensity(this.pixelDensity);

    const bg = this.getDownloadBackground();
    if (bg) {
      pg.background(bg);
    } else {
      pg.clear();
    }

    pg.image(source, 0, 0);
    return pg;
  }

  drawPrintLayout(target, useDegrees) {
    const printRotate = useDegrees ? 90 : target.HALF_PI;
    const cover = this.getPage("cover");
    const one = this.getPage("one");
    const two = this.getPage("two");
    const three = this.getPage("three");
    const back = this.getPage("back");

    target.push();
    target.rotate(printRotate);
    target.translate(target.height - this.pWidth, -this.pHeight);
    target.image(cover, 0, 0);
    target.pop();

    target.push();
    target.rotate(-printRotate);
    target.translate(-target.height, this.pHeight);
    target.image(one, 0, 0);
    target.pop();

    target.push();
    target.rotate(-printRotate);
    target.translate(-target.height / 2, this.pHeight);
    target.image(two, 0, 0);
    target.pop();

    target.push();
    target.rotate(printRotate);
    target.translate(0, -this.pHeight);
    target.image(three, 0, 0);
    target.pop();

    target.push();
    target.rotate(printRotate);
    target.translate(target.height - this.pWidth * 2, -this.pHeight);
    target.image(back, 0, 0);
    target.pop();
  }

  buildPrintGraphics() {
    const pg = this.p.createGraphics(this.pHeight * 2, this.pWidth * 4);
    const useDegrees = this.p.angleMode() === "degrees";

    pg.angleMode(useDegrees ? pg.DEGREES : pg.RADIANS);
    pg.pixelDensity(this.pixelDensity);
    const bg = this.getDownloadBackground();
    if (bg) {
      pg.background(bg);
    } else {
      pg.clear();
    }

    this.drawPrintLayout(pg, useDegrees);

    return pg;
  }

  printSetting() {
    const p = this.p;
    const useDegrees = p.angleMode() === "degrees";
    const previousSize = { width: p.width, height: p.height };

    p.push();
    p.resizeCanvas(this.pHeight * 2, this.pWidth * 4);
    p.clear();
    p.background(255);

    this.drawPrintLayout(p, useDegrees);

    p.pop();

    if (this.previewMode !== PREVIEW_MODES.CANVAS) {
      p.resizeCanvas(previousSize.width, previousSize.height);
    }
  }

  downloadJPG() {
    this.borderYes = false;
    this.setPreviewChromeVisible(false);

    const stamp = `${this.p.hour()}${this.p.minute()}${this.p.second()}`;
    const extension = this.downloadFormat === "png" ? "png" : "jpg";
    const pages = [
      { page: this.getPage("cover"), index: 0 },
      { page: this.getPage("one"), index: 1 },
      { page: this.getPage("two"), index: 2 },
      { page: this.getPage("three"), index: 3 },
      { page: this.getPage("back"), index: 4 },
    ];

    pages.forEach(({ page, index }) => {
      if (!page) {
        return;
      }

      const exportGraphic = this.buildPageExportGraphic(page);
      exportGraphic.save(`${index}-genZ${stamp}.${extension}`);
      if (typeof exportGraphic.remove === "function") {
        exportGraphic.remove();
      }
    });

    this.borderYes = true;
    this.setPreviewChromeVisible(true);
  }

  downloadPDF() {
    this.borderYes = false;
    this.setPreviewChromeVisible(false);

    try {
      const printGraphics = this.buildPrintGraphics();
      const canvasEl =
        printGraphics?.canvas || printGraphics?.elt || printGraphics;

      if (!canvasEl) {
        return;
      }

      const imgData = canvasEl.toDataURL("image/jpeg", 1.0);
      const paperWidthPx = this.pHeight * 2;
      const paperHeightPx = this.pWidth * 4;
      const dpi = this.pageDPI || 96;
      const paperWidthIn = paperWidthPx / dpi;
      const paperHeightIn = paperHeightPx / dpi;
      const orientation = paperWidthIn > paperHeightIn ? "l" : "p";

      const pdf = new jsPDF({
        orientation,
        unit: "in",
        format: [paperWidthIn, paperHeightIn],
      });
      pdf.addImage(imgData, "JPEG", 0, 0, paperWidthIn, paperHeightIn);

      let fileName;
      if (
        typeof window !== "undefined" &&
        typeof window.zine === "object" &&
        window.zine !== null &&
        typeof window.zine?.title !== "undefined"
      ) {
        fileName = window.zine.title;
      } else {
        fileName = "(gen)zine";
      }

      if (
        /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(
          navigator.userAgent.toLowerCase(),
        )
      ) {
        window.open(pdf.output("bloburl", { filename: fileName }));
      } else {
        pdf.save(`${fileName}.pdf`);
      }

      if (typeof printGraphics?.remove === "function") {
        printGraphics.remove();
      }
    } finally {
      this.borderYes = true;
      this.setPreviewChromeVisible(true);
    }
  }
}

export function zineAddon(p5, fn, lifecycles) {
  fn.selfie = null;
  PAGE_DEFS.forEach((def) => {
    fn[def.key] = null;
  });
  fn.all = [];

  fn.initZine = function () {
    const instance = resolveP5Instance(this);
    instance._zine = new ZineManager(instance);
    activeZine = instance._zine;
    instance._zine.init();
  };

  fn.setupZine = function () {
    const instance = resolveP5Instance(this);
    if (!instance._zine) {
      return;
    }
    instance._zine.applyPreviewPixelDensity();
    instance._zine.updateMousePositions();
  };

  fn.drawZine = function () {
    const instance = resolveP5Instance(this);
    if (!instance._zine) {
      return;
    }
    instance._zine.drawPreview();
  };

  fn.mousePosition = function () {
    const instance = resolveP5Instance(this);
    if (!instance._zine) {
      return;
    }
    instance._zine.updateMousePositions();
  };

  fn.changePixelDensity = function (num) {
    const instance = resolveP5Instance(this);
    if (!instance._zine) {
      return;
    }
    instance._zine.setPagesPixelDensity(num);
  };

  fn.zinePageSize = function (width, height, options = {}) {
    if (typeof window === "undefined") {
      return;
    }

    if (this._zine) {
      console.warn(
        "zinePageSize() should be called before setup; reload to apply changes.",
      );
      return;
    }

    window.zine =
      typeof window.zine === "object" && window.zine !== null ? window.zine : {};

    if (typeof width !== "undefined") {
      window.zine.pageWidth = width;
    }
    if (typeof height !== "undefined") {
      window.zine.pageHeight = height;
    }

    delete window.zine.paperWidth;
    delete window.zine.paperHeight;
    delete window.zine.paperSize;

    if (options && typeof options === "object") {
      if (typeof options.dpi === "number") {
        window.zine.pageDPI = options.dpi;
      }
      if (typeof options.unit === "string") {
        window.zine.pageUnit = options.unit;
      }
    }
  };

  fn.zinePaperSize = function (width, height, options = {}) {
    if (typeof window === "undefined") {
      return;
    }

    if (this._zine) {
      console.warn(
        "zinePaperSize() should be called before setup; reload to apply changes.",
      );
      return;
    }

    window.zine =
      typeof window.zine === "object" && window.zine !== null ? window.zine : {};

    if (typeof width !== "undefined") {
      window.zine.paperWidth = width;
    }
    if (typeof height !== "undefined") {
      window.zine.paperHeight = height;
    }

    delete window.zine.pageWidth;
    delete window.zine.pageHeight;
    delete window.zine.pageSize;

    if (options && typeof options === "object") {
      if (typeof options.dpi === "number") {
        window.zine.paperDPI = options.dpi;
      }
      if (typeof options.unit === "string") {
        window.zine.paperUnit = options.unit;
      }
    }
  };

  fn.calMousePos = function (arr) {
    const instance = resolveP5Instance(this);
    if (!instance._zine) {
      return;
    }
    instance._zine.updateMousePositionsFor(
      arr || instance._zine.pages.map((p) => p.graphics),
    );
  };

  fn.changeTitle = function () {
    const instance = resolveP5Instance(this);
    if (!instance._zine) {
      return;
    }
    instance._zine.updateTitle();
  };

  fn.updateAdaptiveWidth = function () {
    const instance = resolveP5Instance(this);
    if (!instance._zine) {
      return;
    }
    instance._zine.updateAdaptiveWidth();
  };

  fn.resizeZineCanvas = function () {
    const instance = resolveP5Instance(this);
    if (!instance._zine) {
      return;
    }
    instance._zine.resizeCanvas();
  };

  fn.printSetting = function () {
    const instance = resolveP5Instance(this);
    if (!instance._zine) {
      return;
    }
    instance._zine.printSetting();
  };

  fn.windowResized = function () {
    const instance = resolveP5Instance(this);
    if (!instance._zine) {
      return;
    }

    if (instance._zine.previewMode === PREVIEW_MODES.CANVAS) {
      instance._zine.updateAdaptiveWidth();
    }
    instance._zine.resizeCanvas();
  };

  if (lifecycles) {
    lifecycles.postsetup = function () {
      if (typeof this.initZine === "function") {
        this.initZine();
      }
    };
    lifecycles.predraw = function () {
      if (typeof this.setupZine === "function") {
        this.setupZine();
      }
    };
    lifecycles.postdraw = function () {
      if (typeof this.drawZine === "function") {
        this.drawZine();
      }
    };
  }
}

document.addEventListener("DOMContentLoaded", function () {
  document
    .getElementById("download-jpg")
    .addEventListener("click", downloadJPG);
  document
    .getElementById("download-pdf")
    .addEventListener("click", downloadPDF);
});

function downloadJPG() {
  if (activeZine) {
    activeZine.downloadJPG();
  }
}

function downloadPDF() {
  if (activeZine) {
    activeZine.downloadPDF();
  }
}
