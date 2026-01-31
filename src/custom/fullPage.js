/*---
name: fullPage
summary: Draw text or an image to fill the full page.
params:
  - name: material
    type: string|p5.Image|p5.Graphics
    description: Text or image to draw.
returns: void
example: |
  cover.fullPage("hello");
---*/

export const name = "fullPage";

export const meta = {
  name,
  summary: "Draw text or an image to fill the full page.",
  params: [
    {
      name: "material",
      type: "string|p5.Image|p5.Graphics",
      description: "Text or image to draw.",
    },
  ],
  returns: "void",
  example: "cover.fullPage(\"hello\");",
};

export function method(material) {
  let size;

  if (typeof material === "object") {
    if (material.width > material.height) {
      size = this.height;
      let ar = material.width / material.height;
      this.image(material, 0, 0, size * ar, size);
    } else {
      size = this.width;
      let ar = material.height / material.width;
      this.image(material, 0, 0, size, size * ar);
    }
  } else {
    this.text(material, 10, 10, this.width - 20);
  }
}
