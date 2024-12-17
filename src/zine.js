import { jsPDF } from "jspdf";

let myCanvas;
const maxSinglePageWidth = 400;
const maxCanvasWidth = (maxSinglePageWidth * 2) / 0.7;
const rWidth = 198;
const rHeight = 306;
const pWidth = 800;
const pHeight = (pWidth / rWidth) * rHeight;
let aWidth, aHeight, gap;
let borderYes = true;
p5.prototype.selfie = null;
p5.prototype.cover = null;
p5.prototype.one = null;
p5.prototype.two = null;
p5.prototype.three = null;
p5.prototype.back = null;
let fR = 10;
let pD = 1;
p5.prototype.all = [];

p5.prototype.initZine = function() {
  myCanvas = this.createCanvas(windowWidth - 17, windowWidth * 3.3);
  myCanvas.parent("#myCanvas");
  updateAdaptiveWidth();

  if (typeof window.zine === "object" && window.zine !== null) {
    fR = typeof zine.frameRate !== "undefined" ? zine.frameRate : fR;
    pD = typeof zine.pixelDensity !== "undefined" ? zine.pixelDensity : pD;
  }

  this.cover = this.createGraphics(pWidth, pHeight);
  this.one = this.createGraphics(pWidth * 2, pHeight);
  this.two = this.createGraphics(pWidth * 2, pHeight);
  this.three = this.createGraphics(pWidth * 2, pHeight);
  this.back = this.createGraphics(pWidth, pHeight);

  all.push(this.cover, this.one, this.two, this.three, this.back);

  this.cover.pageSize = "single";
  this.one.pageSize = "full";
  this.two.pageSize = "full";
  this.three.pageSize = "full";
  this.back.pageSize = "single";

  this.pixelDensity(1);
  this.frameRate(fR);
  this.angleMode(DEGREES);
  this.noStroke();
  changeTitle();

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
    selfie = createCapture(VIDEO);
    selfie.hide();
  }

  resizeZineCanvas();
};
p5.prototype.registerMethod("afterSetup", p5.prototype.initZine);

p5.prototype.setupZine = function() {
  if (borderYes) {
    this.pixelDensity(2);
    changePixelDensity(2);
  } else {
    this.pixelDensity(5);
    changePixelDensity(5);
  }

  mousePosition();
};

p5.prototype.registerMethod("pre", p5.prototype.setupZine);

p5.prototype.drawZine = function() {
  if (borderYes) {
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

p5.prototype.mousePosition = function() {
  calMousePos([cover, one, two, three, back]);
};

p5.prototype.changePixelDensity = function(num) {
  all.map((el) => {
    el.pixelDensity(num);
  });
};

p5.prototype.calMousePos = function(arr) {
  const ratioer = pWidth / aWidth;
  arr.map((el, i) => {
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

p5.prototype.changeTitle = function() {
  // Check if 'zine' is defined and is an object
  if (typeof window.zine === "object" && window.zine !== null) {
    // Use optional chaining to safely access properties, with fallback values
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
};

p5.prototype.updateAdaptiveWidth = function() {
  aWidth = Math.min((width / 2) * 0.7, maxSinglePageWidth);
  aHeight = (aWidth / rWidth) * rHeight;
  gap = aWidth / 4;
};

p5.prototype.resizeZineCanvas = function() {
  if (windowWidth >= maxCanvasWidth) {
    this.resizeCanvas(maxCanvasWidth, maxCanvasWidth * 3.3);
  } else {
    this.resizeCanvas(windowWidth - 17, windowWidth * 3.3);
  }
};

p5.prototype.printSetting = function() {
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

p5.prototype.windowResized = function() {
  updateAdaptiveWidth();
  resizeZineCanvas();
};

document.addEventListener("DOMContentLoaded", function() {
  document
    .getElementById("download-jpg")
    .addEventListener("click", downloadJPG);
  document
    .getElementById("download-pdf")
    .addEventListener("click", downloadPDF);
});

function downloadJPG() {
  borderYes = false;
  cover.save("0-genZ" + hour() + minute() + second() + ".jpg");
  one.save("1-genZ" + hour() + minute() + second() + ".jpg");
  two.save("2-genZ" + hour() + minute() + second() + ".jpg");
  three.save("3-genZ" + hour() + minute() + second() + ".jpg");
  back.save("4-genZ" + hour() + minute() + second() + ".jpg");
  borderYes = true;
}

function downloadPDF() {
  borderYes = false;
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

  borderYes = true;
}
