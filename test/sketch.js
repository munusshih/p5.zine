function setup() {}

function draw() {
  /* Cover */
  cover.randomLayout(["hello world", selfie]);

  /*page One*/
  one.rect(one.mouseX, one.mouseY, 100);

  /*page Two*/
  two.background(random(255), random(255), random(255));
  two.glitchLayout(["hello world", selfie]);

  /*page Three*/
  three.gridLayout(["hello world", selfie]);

  /*back Cover*/
  back.background(random(255), random(255), random(255));
}
