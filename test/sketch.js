window.zine = {
  title: "p5.zine test",
  author: "p5.zine",
  preview: "pages",
  cam: false,
  frameRate: 12,
  pixelDensity: 1,
  downloadFormat: "png",
  downloadBackground: "#ffffff",
};

let stamp;

function setup() {
  zinePageSize("1in", "11in", { dpi: 120 });

  stamp = createGraphics(120, 120);
  stamp.background(255);
  stamp.stroke(30);
  stamp.strokeWeight(3);
  stamp.noFill();
  stamp.ellipse(60, 60, 90, 90);
  stamp.line(15, 15, 105, 105);
}

function draw() {
  /* Cover */
  cover.Background("rgb(254, 243, 199)");
  cover.leftBackground("rgb(191, 219, 254)");
  cover.rightBackground("rgb(253, 224, 71)");
  cover.textSet("Helvetica", 30, CENTER, 34, "#111");
  cover.text("p5.zine test", cover.width / 2, 60);
  cover.textSet("Helvetica", 14, LEFT, 18, "#111");
  cover.textBox(
    "This cover tests textBox, background helpers, and layout utilities.\nUse p5 1.x or 2.x.",
    30,
    120,
    220,
    300,
    20,
    true,
  );
  cover.image(stamp, cover.width - 170, 100);

  /* Page One */
  one.background(250);
  one.textSet("Courier New", 16, LEFT, 20, "#aaa");
  one.text("Mouse-aware drawing:", 30, 40);
  one.stroke("#111827");
  one.noFill();
  one.rect(30, 60, one.width - 60, one.height - 120);
  if (one.mouseHere) {
    one.noStroke();
    one.fill("blue");
    one.ellipse(one.mouseX, one.mouseY, 5, 5);
  }
  one.text(`mouseHere: ${one.mouseHere}`, 30, one.height - 40);

  /* Page Two */
  two.background(0);
  two.textSet("Georgia", 18, LEFT, 22, "#fff");
  two.randomLayout(["ZINE", "PRINT", "LAYOUT"], 6, 4, 6, true);
  two.image(stamp, 40, two.height - 180);

  /* Page Three */
  three.background(255);
  three.gridLayout(["GRID", stamp, "GRID", "GRID"]);
  three.textSet("Helvetica", 18, CENTER, 24, "#111");
  three.text("Grid layout + left/right pages", three.width / 2, 40);
  three.leftPage("Left half text", 30, 100);
  three.rightPage("Right half text", 30, 100);

  /* Back Cover */
  back.background("pink");
  back.glitchLayout(["BACK", "COVER", stamp]);
  back.textSet("Helvetica", 14, LEFT, 18, "yellow");
  back.text(`frameRate: ${Math.round(frameRate())} fps`, 30, back.height - 30);
}
