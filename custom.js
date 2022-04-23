let cover, one, two, three, back;
let borderYes = true;
let selfie;

function setup() {
  myCanvas = createCanvas(windowWidth - 17, 1800);
  myCanvas.parent("#myCanvas");
  cover = createGraphics(198, 306);
  one = createGraphics(396, 306);
  two = createGraphics(396, 306);
  three = createGraphics(396, 306);
  back = createGraphics(198, 306);
  frameRate(5);
  angleMode(DEGREES);
  noStroke()
  
  selfie = createCapture(VIDEO);
  selfie.hide();
}

function draw() {
  if (borderYes) {
    pixelDensity(2);
    cover.pixelDensity(2);
    one.pixelDensity(2);
    two.pixelDensity(2);
    three.pixelDensity(2);
    back.pixelDensity(2);
  } else {
    pixelDensity(5);
    cover.pixelDensity(5);
    one.pixelDensity(5);
    two.pixelDensity(5);
    three.pixelDensity(5);
    back.pixelDensity(5);
  }

  coverPage();
  onePage();
  twoPage();
  threePage();
  backPage();

  if (borderYes) {
    drawBorder();
  }
  // downloadPDF()
}

function preSet() {
  resizeCanvas(windowWidth - 17, 1800);
  background("white");
  push();
  textSize(20);
  textFont("monospace");
  rotate(45);
  translate(500, -500);
  for (let i = 0; i < 30; i++) {
    for (let j = 0; j < 5; j++) {
      fill(0, 50);
      noStroke();
      text("*", j * 130 + (i % 4) * 100, i * 80 + j * 10);
      noFill();
      line(
        j * 130 + (i % 4) * 100,
        i * 80 + j * 10 + 5,
        j * 130 + (i % 4) * 100 + random(30, 100),
        i * 80 + j * 10 + 5
      );
    }
  }
  pop();
}

function printSetting() {
  resizeCanvas(612, 792);
  clear();
  push();
  rotate(90);
  translate(height - 198, -306);
  image(cover, 0, 0);
  pop();
  push();
  rotate(-90);
  translate(-height, 306);
  image(one, 0, 0);
  pop();
  push();
  rotate(-90);
  translate(-height / 2, 306);
  image(two, 0, 0);
  pop();
  push();
  rotate(90);
  translate(0, -306);
  image(three, 0, 0);
  pop();
  push();
  rotate(90);
  translate(height - 198 * 2, -306);
  image(back, 0, 0);
  pop();
}

function drawBorder() {
  preSet();

  image(cover, width / 2, 50);
  image(one, width / 2 - 396 / 2, 400);
  image(two, width / 2 - 396 / 2, 750);
  image(three, width / 2 - 396 / 2, 1100);
  image(back, width / 2 - 396 / 2, 1450);

  push();
  noFill();
  stroke(255, 0, 0);
  strokeWeight(1);
  rect(width / 2, 50, 198, 306);
  rect(width / 2 - 396 / 2, 400, 198, 306);
  rect(width / 2, 400, 198, 306);
  rect(width / 2 - 396 / 2, 750, 198, 306);
  rect(width / 2, 750, 198, 306);
  rect(width / 2 - 396 / 2, 1100, 198, 306);
  rect(width / 2, 1100, 198, 306);
  rect(width / 2 - 396 / 2, 1450, 198, 306);
  pop();
}

function windowResized() {
  resizeCanvas(windowWidth - 17, 1800);
}

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
  var imgData = canvas.toDataURL("image/jpeg", 1.0);
  var pdf = new jsPDF("p", "in", [8.5, 11]);
  pdf.addImage(imgData, "JPEG", 0, 0, 8.5, 11);
  pdf.save("genZ.pdf");
  borderYes = true;
}

function randomColor() {
  return [random(255), random(255), random(255)];
}
