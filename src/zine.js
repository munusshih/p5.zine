import { jsPDF } from "jspdf";


// cleanup
let myCanvas;

//zine page ratio
const ratioWidth = 198;
const ratioHeight = 306;

//default zine page size
const pWidth = 800;
const pHeight = (pWidth / ratioWidth) * ratioHeight;

// max size of a single page in px
const maxSinglePageWidth = 400;
const maxCanvasWidth = (maxSinglePageWidth * 2) / 0.7;

cover = zinePage.createGraphics();
cover.draw();

let aWidth, aHeight, gap;
let isExporting = true;
p5.prototype.SELFIE = null;
p5.prototype.cover = null;
p5.prototype.one = null;
p5.prototype.two = null;
p5.prototype.three = null;
p5.prototype.back = null;
let fR = 10;
let pD = 2;
p5.prototype.all = [];

//order: setup() (one-time)> initZine()(one-time) > setupZine()(looping) > draw()(looping) > drawZine (looping)
p5.prototype.initZine = function () {
  //create the global canvas
  myCanvas = this.createCanvas(windowWidth - 17, windowWidth * 3.3);
  myCanvas.parent("#myCanvas");
  calculatePageWidth();

  //config
  //define framerate and pixel density
  if (typeof window.zine === "object" && window.zine !== null) {
    fR = typeof zine.frameRate !== "undefined" ? zine.frameRate : fR;
    pD = typeof zine.pixelDensity !== "undefined" ? zine.pixelDensity : pD;
  }

  changeTitle();

  //create graphics for cover, back, and 3 spreads (double width)
  //combine these two section into a function?
  this.cover = this.createGraphics(pWidth, pHeight);
  this.one = this.createGraphics(pWidth * 2, pHeight);
  this.two = this.createGraphics(pWidth * 2, pHeight);
  this.three = this.createGraphics(pWidth * 2, pHeight);
  this.back = this.createGraphics(pWidth, pHeight);

  this.cover.pageSize = "single";
  this.one.pageSize = "spread";
  this.two.pageSize = "spread";
  this.three.pageSize = "spread";
  this.back.pageSize = "single";

  //an array of all the pages
  all.push(this.cover, this.one, this.two, this.three, this.back);

  //why set it here again? px and fr
  this.pixelDensity(2);
  this.frameRate(fR);
  this.angleMode(DEGREES);

  if (
    typeof window.zine !== "undefined" &&
    (zine?.cam === false ||
      zine?.cam === "false" ||
      zine?.cam === "False" ||
      zine?.cam === "FALSE")
  ) {
    // No action needed if cam is explicitly false
  } else {
    // Create capture if cam is not false
    SELFIE = createCapture(VIDEO);
    SELFIE.hide();
  }

  resizeZineCanvas();
};
p5.prototype.registerMethod("afterSetup", p5.prototype.initZine);

p5.prototype.setupZine = function () {
  if (!isExporting) {
    //default pixel density for screen display
    this.pixelDensity(2);
    /* graphic and canvas have separate pixel density
      this is changing "graphic's" pixel density
      graphic is a <canvas> that is not displayed*/
    changePixelDensity(2);
  } else {
    //higher pixel density for exporting & printing
    this.pixelDensity(5);
    changePixelDensity(5);
  }

  //calculate mouse position on big canvas to match graphic's relative position
  calculateMousePos();
};

p5.prototype.registerMethod("pre", p5.prototype.setupZine);

p5.prototype.drawZine = function () {
  if (!isExporting) {
    this.push();

    this.image(cover, width / 2 - aWidth / 2, gap, aWidth, aHeight);
    this.image(
      one,
      width / 2 - aWidth,
      gap + (aHeight + gap),
      aWidth * 2,
      aHeight
    );
    this.image(
      two,
      width / 2 - aWidth,
      gap + (aHeight + gap) * 2,
      aWidth * 2,
      aHeight
    );
    this.image(
      three,
      width / 2 - aWidth,
      gap + (aHeight + gap) * 3,
      aWidth * 2,
      aHeight
    );
    this.image(
      back,
      width / 2 - aWidth / 2,
      gap + (aHeight + gap) * 4,
      aWidth,
      aHeight
    );

    this.noStroke();
    this.fill("#ed225d");
    this.textSize(15);
    this.textFont("monospace");
    this.text("coverPage()", width / 2 - aWidth / 2, gap - 10);
    this.text("onePage()", width / 2 - aWidth, gap + (aHeight + gap) - 10);
    this.text("twoPage()", width / 2 - aWidth, gap + (aHeight + gap) * 2 - 10);
    this.text(
      "threePage()",
      width / 2 - aWidth,
      gap + (aHeight + gap) * 3 - 10
    );
    this.text(
      "backPage()",
      width / 2 - aWidth / 2,
      gap + (aHeight + gap) * 4 - 10
    );

    this.noFill();
    this.stroke("#ed225d");
    this.strokeWeight(1);
    this.rect(width / 2 - aWidth / 2, gap, aWidth, aHeight);
    this.rect(width / 2 - aWidth, gap + (aHeight + gap), aWidth, aHeight);
    this.rect(
      width / 2 - aWidth + aWidth,
      gap + (aHeight + gap),
      aWidth,
      aHeight
    );
    this.rect(width / 2 - aWidth, gap + (aHeight + gap) * 2, aWidth, aHeight);
    this.rect(
      width / 2 - aWidth + aWidth,
      gap + (aHeight + gap) * 2,
      aWidth,
      aHeight
    );
    this.rect(width / 2 - aWidth, gap + (aHeight + gap) * 3, aWidth, aHeight);
    this.rect(
      width / 2 - aWidth + aWidth,
      gap + (aHeight + gap) * 3,
      aWidth,
      aHeight
    );
    this.rect(
      width / 2 - aWidth / 2,
      gap + (aHeight + gap) * 4,
      aWidth,
      aHeight
    );
    this.pop();
  }
};

p5.prototype.registerMethod("post", p5.prototype.drawZine);

p5.prototype.changePixelDensity = function (num) {
  all.map((el) => {
    el.pixelDensity(num);
  });
};

p5.prototype.calculateMousePos = function () {
  const ratioer = pWidth / aWidth;
  all.map((el, i) => {
    if (i === 0 || i === 4) {
      el.mouseX = constrain(
        (mouseX - (width / 2 - aWidth / 2)) * ratioer,
        -20,
        el.width + 20
      );
    } else {
      el.mouseX = constrain(
        (mouseX - (width / 2 - aWidth)) * ratioer,
        -20,
        el.width + 20
      );
    }
    el.mouseY = constrain(
      (mouseY - (gap + (aHeight + gap) * i)) * ratioer,
      -20,
      el.height + 20
    );

    if (
      el.mouseX > 0 &&
      el.mouseX < el.width &&
      el.mouseY > 0 &&
      el.mouseY < el.height
    ) {
      el.mouseHere = true;
    }
  });
};

p5.prototype.changeTitle = function () {
  // Check if 'zine' is defined and is an object
  if (typeof window.zine === "object" && window.zine !== null) {
    // Use optional chaining to safely access properties, with fallback values
    document.querySelector("#genTitle").innerHTML =
      window.zine?.title || "Default Title";
    document.querySelector("#author").innerHTML = window.zine?.author
      ? `by <a href="${window.zine?.personalUrl || "#"}">${window.zine?.author
      }</a>`
      : "by Unknown Author";
    document.querySelector("#des").innerHTML =
      window.zine?.description || "No description available.";
  }
};

p5.prototype.calculatePageWidth = function () {
  aWidth = Math.min((width / 2) * 0.7, maxSinglePageWidth);
  aHeight = (aWidth / ratioWidth) * ratioHeight;
  gap = aWidth / 4;
};

//can you talk about the numbers here?
p5.prototype.resizeZineCanvas = function () {
  if (windowWidth >= maxCanvasWidth) {
    this.resizeCanvas(maxCanvasWidth, maxCanvasWidth * 3.3);
  } else {
    this.resizeCanvas(windowWidth - 17, windowWidth * 3.3);
  }
};

p5.prototype.printSetting = function () {
  const printRotate = angleMode() === "degrees" ? 90 : HALF_PI;
  changePixelDensity(pD);

  push();
  resizeCanvas(pHeight * 2, pWidth * 4);
  clear();
  background(255);
  push();
  rotate(printRotate);
  translate(height - pWidth, -pHeight);
  image(cover, 0, 0);
  pop();
  push();
  rotate(-printRotate);
  translate(-height, pHeight);
  image(one, 0, 0);
  pop();
  push();
  rotate(-printRotate);
  translate(-height / 2, pHeight);
  image(two, 0, 0);
  pop();
  push();
  rotate(printRotate);
  translate(0, -pHeight);
  image(three, 0, 0);
  pop();
  push();
  rotate(printRotate);
  translate(height - pWidth * 2, -pHeight);
  image(back, 0, 0);
  pop();
  pop();
};

p5.prototype.windowResized = function () {
  calculatePageWidth();
  resizeZineCanvas();
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
  isExporting = true;
  cover.save("0-genZ" + hour() + minute() + second() + ".jpg");
  one.save("1-genZ" + hour() + minute() + second() + ".jpg");
  two.save("2-genZ" + hour() + minute() + second() + ".jpg");
  three.save("3-genZ" + hour() + minute() + second() + ".jpg");
  back.save("4-genZ" + hour() + minute() + second() + ".jpg");
  isExporting = false;
}

function downloadPDF() {
  isExporting = true;
  printSetting();
  const imgData = canvas.toDataURL("image/jpeg", 1.0);
  const pdf = new jsPDF("p", "in", [8.5, 11]);
  pdf.addImage(imgData, "JPEG", 0, 0, 8.5, 11);

  let filename;
  if (
    typeof window.zine !== "undefined" &&
    typeof window.zine !== null &&
    zine?.title !== "undefined"
  ) {
    fileName = zine.title;
  } else {
    fileName = "(gen)zine.pdf";
  }

  if (
    /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(
      navigator.userAgent.toLowerCase()
    )
  ) {
    window.open(pdf.output("bloburl", { filename: fileName }));
  } else {
    pdf.save(fileName + ".pdf");
  }

  isExporting = false;
}
