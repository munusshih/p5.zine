import { jsPDF } from "jspdf";

const PAGE_DEFS = [
  {
    key: "cover",
    label: "coverPage()",
    pageSize: "single",
    widthMultiplier: 1,
  },
  { key: "one", label: "onePage()", pageSize: "full", widthMultiplier: 2 },
  { key: "two", label: "twoPage()", pageSize: "full", widthMultiplier: 2 },
  { key: "three", label: "threePage()", pageSize: "full", widthMultiplier: 2 },
  { key: "back", label: "backPage()", pageSize: "single", widthMultiplier: 1 },
];

const DEFAULTS = {
  maxSinglePageWidth: 400,
  rWidth: 198,
  rHeight: 306,
  pWidth: 800,
  frameRate: 30,
  pixelDensity: 1,
};

let activeZine = null;

class ZinePage {
  constructor(p, def, pWidth, pHeight) {
    this.key = def.key;
    this.label = def.label;
    this.pageSize = def.pageSize;
    this.widthMultiplier = def.widthMultiplier;
    this.graphics = p.createGraphics(pWidth * def.widthMultiplier, pHeight);
    this.graphics.pageSize = def.pageSize;
  }
}

class ZineManager {
  constructor(p) {
    this.p = p;
    this.canvas = null;
    this.pages = [];
    this.pageMap = new Map();
    this.borderYes = true;

    this.maxSinglePageWidth = DEFAULTS.maxSinglePageWidth;
    this.rWidth = DEFAULTS.rWidth;
    this.rHeight = DEFAULTS.rHeight;
    this.pWidth = DEFAULTS.pWidth;
    this.pHeight = (this.pWidth / this.rWidth) * this.rHeight;

    this.aWidth = 0;
    this.aHeight = 0;
    this.gap = 0;
    this.frameRate = DEFAULTS.frameRate;
    this.pixelDensity = DEFAULTS.pixelDensity;
  }

  init() {
    const windowW = this.getWindowWidth();
    this.canvas = this.p.createCanvas(windowW - 17, windowW * 3.3);
    this.canvas.parent("#myCanvas");
    this.updateAdaptiveWidth();
    this.applyConfig();
    this.createPages();
    this.applyCoreSettings();
    this.updateTitle();
    this.initCapture();
    this.resizeCanvas();
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
  }

  createPages() {
    this.pages = PAGE_DEFS.map(
      (def) => new ZinePage(this.p, def, this.pWidth, this.pHeight),
    );
    this.pageMap = new Map(this.pages.map((page) => [page.key, page]));

    const graphics = this.pages.map((page) => page.graphics);
    this.pages.forEach((page) => {
      this.p[page.key] = page.graphics;
      if (typeof window !== "undefined") {
        window[page.key] = page.graphics;
      }
    });

    this.p.all = graphics;
  }

  applyCoreSettings() {
    this.p.pixelDensity(1);
    this.p.frameRate(this.frameRate);
    this.p.angleMode(this.p.DEGREES);
    this.p.noStroke();
  }

  updateAdaptiveWidth() {
    this.aWidth = Math.min((this.p.width / 2) * 0.7, this.maxSinglePageWidth);
    this.aHeight = (this.aWidth / this.rWidth) * this.rHeight;
    this.gap = this.aWidth / 4;
  }

  resizeCanvas() {
    const windowW = this.getWindowWidth();
    const maxCanvasWidth = this.getMaxCanvasWidth();

    if (windowW >= maxCanvasWidth) {
      this.p.resizeCanvas(maxCanvasWidth, maxCanvasWidth * 3.3);
    } else {
      this.p.resizeCanvas(windowW - 17, windowW * 3.3);
    }
  }

  updateTitle() {
    if (typeof window !== "undefined") {
      if (typeof window.zine === "object" && window.zine !== null) {
        document.querySelector("#genTitle").innerHTML =
          window.zine?.title || "Default Title";
        document.querySelector("#author").innerHTML = window.zine?.author
          ? `by <a href="${window.zine?.personalUrl || "#"}">${
              window.zine?.author
            }</a>`
          : "by Unknown Author";
        document.querySelector("#des").innerHTML =
          window.zine?.description || "No description available.";
      }
    }
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
    if (typeof window !== "undefined") {
      window.selfie = this.p.selfie;
    }
  }

  getLayout() {
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
    if (!this.borderYes) {
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
    if (this.borderYes) {
      this.p.pixelDensity(2);
      this.setPagesPixelDensity(2);
    } else {
      this.p.pixelDensity(5);
      this.setPagesPixelDensity(5);
    }
  }

  updateMousePositions() {
    const pages = this.pages.map((page) => page.graphics);
    this.updateMousePositionsFor(pages);
  }

  updateMousePositionsFor(pages) {
    if (!pages || pages.length === 0 || this.aWidth === 0) {
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

      page.mouseX = this.p.constrain(
        (this.p.mouseX - baseX) * ratioer,
        -20,
        page.width + 20,
      );
      page.mouseY = this.p.constrain(
        (this.p.mouseY - baseY) * ratioer,
        -20,
        page.height + 20,
      );

      if (
        page.mouseX > 0 &&
        page.mouseX < page.width &&
        page.mouseY > 0 &&
        page.mouseY < page.height
      ) {
        page.mouseHere = true;
      }
    });
  }

  getPage(key) {
    return this.pageMap.get(key)?.graphics || null;
  }

  printSetting() {
    const p = this.p;
    const printRotate = p.angleMode() === "degrees" ? 90 : p.HALF_PI;

    this.setPagesPixelDensity(this.pixelDensity);

    p.push();
    p.resizeCanvas(this.pHeight * 2, this.pWidth * 4);
    p.clear();
    p.background(255);

    const cover = this.getPage("cover");
    const one = this.getPage("one");
    const two = this.getPage("two");
    const three = this.getPage("three");
    const back = this.getPage("back");

    p.push();
    p.rotate(printRotate);
    p.translate(p.height - this.pWidth, -this.pHeight);
    p.image(cover, 0, 0);
    p.pop();

    p.push();
    p.rotate(-printRotate);
    p.translate(-p.height, this.pHeight);
    p.image(one, 0, 0);
    p.pop();

    p.push();
    p.rotate(-printRotate);
    p.translate(-p.height / 2, this.pHeight);
    p.image(two, 0, 0);
    p.pop();

    p.push();
    p.rotate(printRotate);
    p.translate(0, -this.pHeight);
    p.image(three, 0, 0);
    p.pop();

    p.push();
    p.rotate(printRotate);
    p.translate(p.height - this.pWidth * 2, -this.pHeight);
    p.image(back, 0, 0);
    p.pop();

    p.pop();
  }

  downloadJPG() {
    this.borderYes = false;

    const stamp = `${this.p.hour()}${this.p.minute()}${this.p.second()}`;
    const cover = this.getPage("cover");
    const one = this.getPage("one");
    const two = this.getPage("two");
    const three = this.getPage("three");
    const back = this.getPage("back");

    cover?.save(`0-genZ${stamp}.jpg`);
    one?.save(`1-genZ${stamp}.jpg`);
    two?.save(`2-genZ${stamp}.jpg`);
    three?.save(`3-genZ${stamp}.jpg`);
    back?.save(`4-genZ${stamp}.jpg`);

    this.borderYes = true;
  }

  downloadPDF() {
    this.borderYes = false;

    try {
      this.printSetting();
      const canvasEl =
        this.p.canvas ||
        (typeof document !== "undefined"
          ? document.querySelector("canvas")
          : null);

      if (!canvasEl) {
        return;
      }

      const imgData = canvasEl.toDataURL("image/jpeg", 1.0);
      const pdf = new jsPDF("p", "in", [8.5, 11]);
      pdf.addImage(imgData, "JPEG", 0, 0, 8.5, 11);

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
    } finally {
      this.borderYes = true;
    }
  }
}

p5.prototype.selfie = null;
PAGE_DEFS.forEach((def) => {
  p5.prototype[def.key] = null;
});
p5.prototype.all = [];

p5.prototype.initZine = function () {
  this._zine = new ZineManager(this);
  activeZine = this._zine;
  this._zine.init();
};
p5.prototype.registerMethod("afterSetup", p5.prototype.initZine);

p5.prototype.setupZine = function () {
  if (!this._zine) {
    return;
  }
  this._zine.applyPreviewPixelDensity();
  this._zine.updateMousePositions();
};
p5.prototype.registerMethod("pre", p5.prototype.setupZine);

p5.prototype.drawZine = function () {
  if (!this._zine) {
    return;
  }
  this._zine.drawPreview();
};
p5.prototype.registerMethod("post", p5.prototype.drawZine);

p5.prototype.mousePosition = function () {
  if (!this._zine) {
    return;
  }
  this._zine.updateMousePositions();
};

p5.prototype.changePixelDensity = function (num) {
  if (!this._zine) {
    return;
  }
  this._zine.setPagesPixelDensity(num);
};

p5.prototype.calMousePos = function (arr) {
  if (!this._zine) {
    return;
  }
  this._zine.updateMousePositionsFor(
    arr || this._zine.pages.map((p) => p.graphics),
  );
};

p5.prototype.changeTitle = function () {
  if (!this._zine) {
    return;
  }
  this._zine.updateTitle();
};

p5.prototype.updateAdaptiveWidth = function () {
  if (!this._zine) {
    return;
  }
  this._zine.updateAdaptiveWidth();
};

p5.prototype.resizeZineCanvas = function () {
  if (!this._zine) {
    return;
  }
  this._zine.resizeCanvas();
};

p5.prototype.printSetting = function () {
  if (!this._zine) {
    return;
  }
  this._zine.printSetting();
};

p5.prototype.windowResized = function () {
  if (!this._zine) {
    return;
  }
  this._zine.updateAdaptiveWidth();
  this._zine.resizeCanvas();
};

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
