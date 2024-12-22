p5.prototype.createZine = function (width, height, renderer) {
  // Call createGraphics to get a new graphics object
  let pg = this.createGraphics(width, height, renderer);

  const originalText = pg.text;

  // Add or override methods
  pg.customBehavior = function () {
    this.fill(255, 255, 255);
    this.text("Zine Mode!", width / 2, height / 2);
  };

  pg.setup = function () {
    this.textAlign(LEFT, CENTER);
    //default change to center
  };

  pg.draw = function () {
    this.elt.style.display = "block";
  };

  pg.text = function (str, x, y) {
    originalText.call(this, str, x, y);

    const canvasX = this.elt.offsetLeft;
    const canvasY = this.elt.offsetTop;

    // Create a paragraph element and position it
    const p = createP(str);
    p.position(canvasX + x, canvasY + y);
    p.style("font-family", "Arial");
    p.style("font-size", "12px");
    p.style("line-height", "0");
    p.style("margin", "0px");
    p.style("padding", "0px");
    p.style("color", "blue"); // Optional: Style the text
  };

  return pg;
};
