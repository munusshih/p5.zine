/*---
name: textBox
summary: Flow multiline text into columns within a bounding box.
params:
  - name: inputText
    type: string
    description: Text to layout.
  - name: startX
    type: number
    optional: true
    description: Box start X.
  - name: startY
    type: number
    optional: true
    description: Box start Y.
  - name: boxWidth
    type: number
    optional: true
    description: Column width.
  - name: boxHeight
    type: number
    optional: true
    description: Column height.
  - name: gapX
    type: number
    optional: true
    description: Gap between columns.
  - name: showBox
    type: boolean
    optional: true
    description: Draw outline boxes.
returns: void
example: |
  cover.textBox("hello world", 20, 30, 200, 300, 20, true);
---*/

export const name = "textBox";

export const meta = {
  name,
  summary: "Flow multiline text into columns within a bounding box.",
  params: [
    { name: "inputText", type: "string", description: "Text to layout." },
    { name: "startX", type: "number", optional: true, description: "Box start X." },
    { name: "startY", type: "number", optional: true, description: "Box start Y." },
    { name: "boxWidth", type: "number", optional: true, description: "Column width." },
    { name: "boxHeight", type: "number", optional: true, description: "Column height." },
    { name: "gapX", type: "number", optional: true, description: "Gap between columns." },
    { name: "showBox", type: "boolean", optional: true, description: "Draw outline boxes." },
  ],
  returns: "void",
  example: "cover.textBox(\"hello world\", 20, 30, 200, 300, 20, true);",
};

export function method(
  inputText,
  startX = 0,
  startY = 0,
  boxWidth = this.width,
  boxHeight = this.height,
  gapX = 50,
  showBox = false
) {
  let paragraphs = inputText.split("\n");
  let lineHeight = this.textAscent() + this.textDescent();
  let currentY = startY;
  let currentX = startX;
  let textAlignMode = this.textAlign().horizontal;
  let textVerticalAlignMode = this.textAlign().vertical;

  let linesInColumn = [];
  let currentColumn = 0;
  let linesCount = 0;

  // Calculate the total number of lines in each column
  for (const paragraph of paragraphs) {
    let words = paragraph.split(" ");
    let currentLine = words[0];

    for (let i = 1; i < words.length + 1; i++) {
      let word = words[i];
      let nextLine = currentLine + " " + word;

      if (i < words.length && ceil(this.textWidth(nextLine)) < boxWidth) {
        currentLine = nextLine;
      } else {
        linesCount++;
        currentY += lineHeight;

        if (currentY + lineHeight > startY + boxHeight) {
          linesInColumn[currentColumn] = linesCount;
          linesCount = 0;
          currentY = startY;
          currentX += boxWidth + gapX;
          currentColumn++;
        }

        currentLine = word;
      }
    }
  }

  linesInColumn[currentColumn] = linesCount;

  // Draw the text with the correct alignment
  currentY = startY;
  currentX = startX;
  currentColumn = 0;
  linesCount = 0;

  for (const paragraph of paragraphs) {
    let words = paragraph.split(" ");
    let currentLine = words[0];

    for (let i = 1; i < words.length + 1; i++) {
      let word = words[i];
      let nextLine = currentLine + " " + word;

      if (i < words.length && ceil(this.textWidth(nextLine)) < boxWidth) {
        currentLine = nextLine;
      } else {
        let offsetX = 0;
        let offsetY = 0;

        // Calculate horizontal offset based on textAlign
        if (textAlignMode === this.CENTER) {
          offsetX = boxWidth / 2;
        } else if (textAlignMode === this.RIGHT) {
          offsetX = boxWidth;
        }

        // Calculate vertical offset based on textBaseline
        if (textVerticalAlignMode === this.CENTER) {
          offsetY = ceil(
            (boxHeight - (linesInColumn[currentColumn] - 1) * lineHeight) / 2
          );
        } else if (textVerticalAlignMode === this.BOTTOM) {
          offsetY = ceil(
            boxHeight - (linesInColumn[currentColumn] - 1) * lineHeight
          );
        }

        this.text(currentLine, currentX + offsetX, currentY + offsetY);

        currentY += lineHeight;

        if (currentY + lineHeight > startY + boxHeight) {
          currentY = startY;
          currentX += boxWidth + gapX;
          currentColumn++;
        }

        currentLine = word;
      }
    }
  }

  // Draw outlines for text boxes
  if (showBox === true) {
    this.push();
    this.stroke(0, 0, 255);
    this.strokeWeight(1);
    this.noFill();
    let numColumns = Math.ceil((currentX - startX) / (boxWidth + gapX)) + 1;
    for (let i = 0; i < numColumns; i++) {
      this.rect(startX + i * (boxWidth + gapX), startY, boxWidth, boxHeight);
    }
    this.pop();
  }
}
