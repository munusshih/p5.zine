/*---
name: Background
summary: Set a background color with RGB values or CSS rgb() string.
params:
  - name: r
    type: number|string
    description: Red value or CSS color string.
  - name: g
    type: number
    optional: true
    description: Green value (if using RGB).
  - name: b
    type: number
    optional: true
    description: Blue value (if using RGB).
returns: void
example: |
  cover.Background(255);
  cover.Background("rgb(255, 0, 0)");
---*/

export const name = "Background";

export const meta = {
  name,
  summary: "Set a background color with RGB values or CSS rgb() string.",
  params: [
    { name: "r", type: "number|string", description: "Red value or CSS color string." },
    { name: "g", type: "number", optional: true, description: "Green value (if using RGB)." },
    { name: "b", type: "number", optional: true, description: "Blue value (if using RGB)." },
  ],
  returns: "void",
  example: "cover.Background(255);\ncover.Background(\"rgb(255, 0, 0)\");",
};

export function method(r, g, b) {
  if (typeof r === "string") {
    if (r.indexOf("rgb") > -1) {
      let colorArr = r.slice(r.indexOf("(") + 1, r.indexOf(")")).split(",");
      this.background(
        colorArr.map((str) => {
          return Number(str);
        })
      );
    } else {
      this.background(r);
    }
  }
  this.background(r, g, b);
}
