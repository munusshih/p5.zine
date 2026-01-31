/*---
name: glitchLayout
summary: Create a glitchy sine-wave layout of words or images.
params:
  - name: word
    type: Array<string|p5.Image|p5.Graphics>
    optional: true
    description: Items to draw.
  - name: sizer
    type: number
    optional: true
    description: Base size multiplier.
  - name: numMax
    type: number
    optional: true
    description: Max repeats per item.
  - name: repeat
    type: number
    optional: true
    description: Number of passes.
  - name: fun
    type: boolean
    optional: true
    description: Use larger wave values.
returns: void
example: |
  cover.glitchLayout(["GLITCH"], 7, 5, 20, true);
---*/

export const name = "glitchLayout";

export const meta = {
  name,
  summary: "Create a glitchy sine-wave layout of words or images.",
  params: [
    {
      name: "word",
      type: "Array<string|p5.Image|p5.Graphics>",
      optional: true,
      description: "Items to draw.",
    },
    { name: "sizer", type: "number", optional: true, description: "Base size multiplier." },
    { name: "numMax", type: "number", optional: true, description: "Max repeats per item." },
    { name: "repeat", type: "number", optional: true, description: "Number of passes." },
    { name: "fun", type: "boolean", optional: true, description: "Use larger wave values." },
  ],
  returns: "void",
  example: "cover.glitchLayout([\"GLITCH\"], 7, 5, 20, true);",
};

export function method(
  word = ["word"],
  sizer = 7,
  numMax = 5,
  repeat = 20,
  fun = false
) {
  let wave;
  if (fun) {
    wave = random(100);
  } else {
    wave = random(10, 20);
  }

  for (let i = 0; i < repeat; i++) {
    const num = random(1, numMax);

    for (let j = 0; j < word.length; j++) {
      const w = random(this.width);
      const h = random(this.height);

      for (let n = 0; n < num; n++) {
        if (typeof word[j] === "string") {
          this.text(word[j], w + n * 20, h + sin(n * wave) * 30);
        } else if (typeof word[j] === "object") {
          let ar = word[j].width / word[j].height;
          this.image(
            word[j],
            w + n * 30,
            h + sin(n * wave) * 40,
            10 * ar * 2 * sizer + n * 5,
            10 * 2 * sizer
          );
        }
      }
    }
  }
}
