/*---
name: textSet
summary: Set font, size, alignment, leading, and optional fill color.
params:
  - name: theFont
    type: string
    optional: true
    description: Font name.
  - name: theSize
    type: number
    optional: true
    description: Font size.
  - name: theAlign
    type: number
    optional: true
    description: p5 text alignment constant (LEFT, CENTER, RIGHT).
  - name: theLead
    type: number
    optional: true
    description: Line height.
  - name: theColor
    type: any
    optional: true
    description: Fill color.
returns: void
example: |
  cover.textSet("Averia Libre", 24, CENTER, 26, "#111");
---*/

export const name = "textSet";

export const meta = {
  name,
  summary: "Set font, size, alignment, leading, and optional fill color.",
  params: [
    { name: "theFont", type: "string", optional: true, description: "Font name." },
    { name: "theSize", type: "number", optional: true, description: "Font size." },
    {
      name: "theAlign",
      type: "number",
      optional: true,
      description: "p5 text alignment constant (LEFT, CENTER, RIGHT).",
    },
    { name: "theLead", type: "number", optional: true, description: "Line height." },
    { name: "theColor", type: "any", optional: true, description: "Fill color." },
  ],
  returns: "void",
  example: "cover.textSet(\"Averia Libre\", 24, CENTER, 26, \"#111\");",
};

export function method(
  theFont = "Averia Libre",
  theSize = 20,
  theAlign = LEFT,
  theLead = theSize,
  theColor
) {
  if (typeof theColor !== "undefined" && typeof theColor !== null) {
    this.fill(theColor);
  }
  this.textFont(theFont);
  this.textSize(theSize);
  this.textAlign(theAlign);
  this.textLeading(theLead);
}
