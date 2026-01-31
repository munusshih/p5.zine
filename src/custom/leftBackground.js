/*---
name: leftBackground
summary: Fill the left half of the page with a color.
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
  cover.leftBackground("#ffcc00");
---*/

export const name = "leftBackground";

export const meta = {
  name,
  summary: "Fill the left half of the page with a color.",
  params: [
    { name: "r", type: "number|string", description: "Red value or CSS color string." },
    { name: "g", type: "number", optional: true, description: "Green value (if using RGB)." },
    { name: "b", type: "number", optional: true, description: "Blue value (if using RGB)." },
  ],
  returns: "void",
  example: "cover.leftBackground(\"#ffcc00\");",
};

export function method(r, g, b) {
  this.push();
  this.noStroke();
  if (typeof r === "string") {
    if (r.indexOf("rgb") > -1) {
      let colorArr = r.slice(r.indexOf("(") + 1, r.indexOf(")")).split(",");
      this.fill(
        colorArr.map((str) => {
          return Number(str);
        })
      );
    } else {
      this.fill(r);
    }
  } else {
    this.fill(r, g, b);
  }
  this.rect(0, 0, this.width / 2, this.height);
  this.pop();
}
