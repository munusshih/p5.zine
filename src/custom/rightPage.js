/*---
name: rightPage
summary: Draw text or an image on the right half of the page.
params:
  - name: material
    type: string|p5.Image|p5.Graphics
    description: Text or image to draw.
  - name: offsetX
    type: number
    optional: true
    description: X offset before drawing.
  - name: offsetY
    type: number
    optional: true
    description: Y offset before drawing.
returns: void
example: |
  cover.rightPage("right text", 10, 20);
---*/

export const name = "rightPage";

export const meta = {
  name,
  summary: "Draw text or an image on the right half of the page.",
  params: [
    {
      name: "material",
      type: "string|p5.Image|p5.Graphics",
      description: "Text or image to draw.",
    },
    { name: "offsetX", type: "number", optional: true, description: "X offset before drawing." },
    { name: "offsetY", type: "number", optional: true, description: "Y offset before drawing." },
  ],
  returns: "void",
  example: "cover.rightPage(\"right text\", 10, 20);",
};

export function method(material, offsetX, offsetY) {
  let size;

  this.push();
  this.translate(offsetX, offsetY);
  if (typeof material === "object") {
    this.push();
    this.translate(this.width / 2, 0);

    if (typeof material === "object") {
      if (material.width > material.height) {
        size = this.height;
        let ar = material.width / material.height;
        this.image(material, 0, 0, size * ar, size);
      } else {
        size = this.width / 2;
        let ar = material.height / material.width;
        this.image(material, 0, 0, size, size * ar);
      }
    }
    this.pop();
  } else {
    this.push();
    this.translate(this.width / 2, 0);

    if (typeof material === "string") {
      this.text(material, 10, 10, this.width / 2 - 20);
    }
    this.pop();
  }
  this.pop();
}
