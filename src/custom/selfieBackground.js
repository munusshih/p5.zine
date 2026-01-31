/*---
name: selfieBackground
summary: Draw the global selfie image mirrored across the canvas.
params:
  - name: r
    type: number
    optional: true
    description: Optional tint red channel.
  - name: g
    type: number
    optional: true
    description: Optional tint green channel.
  - name: b
    type: number
    optional: true
    description: Optional tint blue channel.
returns: void
notes: Requires a global `selfie` image (set by the zine camera flow).
example: |
  cover.selfieBackground();
  cover.selfieBackground(255, 200, 200);
---*/

export const name = "selfieBackground";

export const meta = {
  name,
  summary: "Draw the global selfie image mirrored across the canvas.",
  params: [
    { name: "r", type: "number", optional: true, description: "Optional tint red channel." },
    { name: "g", type: "number", optional: true, description: "Optional tint green channel." },
    { name: "b", type: "number", optional: true, description: "Optional tint blue channel." },
  ],
  returns: "void",
  notes: "Requires a global `selfie` image (set by the zine camera flow).",
  example: "cover.selfieBackground();\ncover.selfieBackground(255, 200, 200);",
};

export function method(r, g, b) {
  this.push();
  this.translate(this.width, 0);
  this.scale(-1, 1);

  if (r != undefined && g != undefined && b != undefined) {
    this.tint(r, g, b);
  }

  if (selfie.height > selfie.width) {
    this.image(
      selfie,
      0,
      0,
      this.width,
      (this.height * selfie.height) / selfie.width
    );
  } else {
    this.image(
      selfie,
      -50,
      0,
      (this.width * selfie.width) / selfie.height,
      this.height
    );
  }
  this.pop();
}
