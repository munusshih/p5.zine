/*---
name: rightCamera
summary: Draw the global capture feed fitted to the page width.
returns: void
notes: Requires a global `capture` video (p5.createCapture()).
example: |
  cover.rightCamera();
---*/

export const name = "rightCamera";

export const meta = {
  name,
  summary: "Draw the global capture feed fitted to the page width.",
  returns: "void",
  notes: "Requires a global `capture` video (p5.createCapture()).",
  example: "cover.rightCamera();",
};

export function method() {
  image(
    capture,
    0,
    0,
    this.width,
    (this.width * capture.height) / capture.width
  );
}
