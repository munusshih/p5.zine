/*---
name: randomLayout
summary: Scatter words or images randomly across the page.
params:
  - name: word
    type: Array<string|p5.Image|p5.Graphics>
    optional: true
    description: Items to draw.
  - name: size
    type: number
    optional: true
    description: Base size multiplier.
  - name: num
    type: number
    optional: true
    description: Range multiplier for scatter.
  - name: repeat
    type: number
    optional: true
    description: Number of passes.
  - name: fun
    type: boolean
    optional: true
    description: Randomize text sizes.
returns: void
example: |
  cover.randomLayout(["ZINE", "ZINE"], 7, 5, 10, true);
---*/

export const name = "randomLayout";

export const meta = {
  name,
  summary: "Scatter words or images randomly across the page.",
  params: [
    {
      name: "word",
      type: "Array<string|p5.Image|p5.Graphics>",
      optional: true,
      description: "Items to draw.",
    },
    { name: "size", type: "number", optional: true, description: "Base size multiplier." },
    { name: "num", type: "number", optional: true, description: "Range multiplier for scatter." },
    { name: "repeat", type: "number", optional: true, description: "Number of passes." },
    { name: "fun", type: "boolean", optional: true, description: "Randomize text sizes." },
  ],
  returns: "void",
  example: "cover.randomLayout([\"ZINE\", \"ZINE\"], 7, 5, 10, true);",
};

export function method(
  word = ["word"],
  size = 7,
  num = 5,
  repeat = 20,
  fun = false
) {
  const sizer = size * 10;
  this.push();

  this.translate(this.width / 2, this.height / 2);
  for (let i = 0; i < repeat; i++) {
    for (let j = 0; j < word.length; j++) {
      if (fun) {
        this.textSize(random(20, 100));
      }
      if (typeof word[j] === "string") {
        this.text(
          word[j],
          random(-(this.width / 10) * num, (this.width / 10) * num),
          random(-(this.height / 10) * num, (this.height / 10) * num)
        );
      } else if (typeof word[j] === "object") {
        let ar = word[j].width / word[j].height;
        this.image(
          word[j],
          random(-(this.width / 10) * num, (this.width / 10) * num),
          random(-(this.height / 10) * num, (this.height / 10) * num),
          sizer * ar * 2,
          sizer * 2
        );
      }
    }
  }
  this.pop();
}
