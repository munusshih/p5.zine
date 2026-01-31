/*---
name: gridLayout
summary: Arrange words or images in a grid layout.
params:
  - name: word
    type: Array<string|p5.Image|p5.Graphics>
    optional: true
    description: Items to draw.
  - name: size
    type: number
    optional: true
    description: Base size multiplier.
  - name: columnNum
    type: number
    optional: true
    description: Number of columns.
  - name: repeat
    type: number
    optional: true
    description: Number of passes.
  - name: fun
    type: boolean
    optional: true
    description: Randomize row count per pass.
returns: void
example: |
  cover.gridLayout(["A", "B", "C"], 7, 5, 12, false);
---*/

export const name = "gridLayout";

export const meta = {
  name,
  summary: "Arrange words or images in a grid layout.",
  params: [
    {
      name: "word",
      type: "Array<string|p5.Image|p5.Graphics>",
      optional: true,
      description: "Items to draw.",
    },
    { name: "size", type: "number", optional: true, description: "Base size multiplier." },
    { name: "columnNum", type: "number", optional: true, description: "Number of columns." },
    { name: "repeat", type: "number", optional: true, description: "Number of passes." },
    { name: "fun", type: "boolean", optional: true, description: "Randomize row count per pass." },
  ],
  returns: "void",
  example: "cover.gridLayout([\"A\", \"B\", \"C\"], 7, 5, 12, false);",
};

export function method(
  word = ["word"],
  size = 7,
  columnNum = 5,
  repeat = 15,
  fun = false
) {
  this.push();
  this.translate(10, 30);
  let row = 0,
    column = 0;
  let num = 0;
  let sizer = size * 10;

  for (let i = 0; i < repeat; i++) {
    for (let j = 0; j < word.length; j++) {
      if (fun) {
        const rowNum = int(random(5, 10));
        row = floor(num / rowNum);
        column = num % columnNum;
      } else {
        row = floor(num / columnNum);
        column = num % columnNum;
      }

      if (typeof word[j] === "string") {
        this.text(word[j], column * sizer * 2.5, row * sizer * 2.5);
      } else if (typeof word[j] === "object") {
        let ar = word[j].width / word[j].height;
        this.image(
          word[j],
          column * sizer * 2.5 - sizer / 2,
          row * sizer * 2.5 - sizer,
          sizer * ar * 2,
          sizer * 2
        );
      }
      num++;
    }
  }
  this.pop();
}
