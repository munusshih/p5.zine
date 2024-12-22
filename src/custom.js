// customized functions
p5.prototype.Background = function (r, g, b) {
  if (typeof r === "string") {
    if (r.indexOf("rgb") > -1) {
      let colorArr = r.slice(r.indexOf("(") + 1, r.indexOf(")")).split(",");
      this.background(
        colorArr.map((str) => {
          return Number(str);
        }),
      );
    } else {
      this.background(r);
    }
  }
  this.background(r, g, b);
};

p5.prototype.selfieBackground = function (r, g, b) {
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
      (this.height * selfie.height) / selfie.width,
    );
  } else {
    this.image(
      selfie,
      -50,
      0,
      (this.width * selfie.width) / selfie.height,
      this.height,
    );
  }
  this.pop();
};

p5.prototype.rightCamera = function () {
  image(
    capture,
    0,
    0,
    this.width,
    (this.width * capture.height) / capture.width,
  );
};

p5.prototype.randomLayout = function (
  word = ["word"],
  size = 7,
  num = 5,
  repeat = 20,
  fun = false,
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
          random(-(this.height / 10) * num, (this.height / 10) * num),
        );
      } else if (typeof word[j] === "object") {
        let ar = word[j].width / word[j].height;
        this.image(
          word[j],
          random(-(this.width / 10) * num, (this.width / 10) * num),
          random(-(this.height / 10) * num, (this.height / 10) * num),
          sizer * ar * 2,
          sizer * 2,
        );
      }
    }
  }
  this.pop();
};

p5.prototype.gridLayout = function (
  word = ["word"],
  size = 7,
  columnNum = 5,
  repeat = 15,
  fun = false,
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
          sizer * 2,
        );
      }
      num++;
    }
  }
  this.pop();
};

p5.prototype.glitchLayout = function (
  word = ["word"],
  sizer = 7,
  numMax = 5,
  repeat = 20,
  fun = false,
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
            10 * 2 * sizer,
          );
        }
      }
    }
  }
};

p5.prototype.leftBackground = function (r, g, b) {
  this.push();
  this.noStroke();
  if (typeof r === "string") {
    if (r.indexOf("rgb") > -1) {
      let colorArr = r.slice(r.indexOf("(") + 1, r.indexOf(")")).split(",");
      this.fill(
        colorArr.map((str) => {
          return Number(str);
        }),
      );
    } else {
      this.fill(r);
    }
  } else {
    this.fill(r, g, b);
  }
  this.rect(0, 0, this.width / 2, this.height);
  this.pop();
};

p5.prototype.rightBackground = function (r, g, b) {
  this.push();
  this.noStroke();
  if (typeof r === "string") {
    if (r.indexOf("rgb") > -1) {
      let colorArr = r.slice(r.indexOf("(") + 1, r.indexOf(")")).split(",");
      this.fill(
        colorArr.map((str) => {
          return Number(str);
        }),
      );
    } else {
      this.fill(r);
    }
  } else {
    this.fill(r, g, b);
  }
  this.rect(this.width / 2, 0, this.width / 2, this.height);
  this.pop();
};

p5.prototype.fullPage = function (material) {
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
};

p5.prototype.leftPage = function (material, offsetX, offsetY) {
  this.push();
  this.translate(offsetX, offsetY);
  if (typeof material === "object") {
    this.push();
    if (material.width > material.height) {
      size = this.height;
      let ar = material.width / material.height;
      this.image(material, 0, 0, size * ar, size);
    } else {
      size = this.width / 2;
      let ar = material.height / material.width;
      this.image(material, 0, 0, size, size * ar);
    }
    this.pop();
  } else {
    this.push();

    if (typeof material === "string") {
      this.text(material, 10, 10, this.width / 2 - 20);
    }
    this.pop();
  }
  this.pop();
};

p5.prototype.rightPage = function (material, offsetX, offsetY) {
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
};

p5.prototype.textSet = function (
  theFont = "Averia Libre",
  theSize = 20,
  theAlign = LEFT,
  theLead = theSize,
  theColor,
) {
  if (typeof theColor !== "undefined" && typeof theColor !== null) {
    this.fill(theColor);
  }
  this.textFont(theFont);
  this.textSize(theSize);
  this.textAlign(theAlign);
  this.textLeading(theLead);
};

p5.prototype.textBox = function (
  inputText,
  startX = 0,
  startY = 0,
  boxWidth = this.width,
  boxHeight = this.height,
  gapX = 50,
  showBox = false,
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
            (boxHeight - (linesInColumn[currentColumn] - 1) * lineHeight) / 2,
          );
        } else if (textVerticalAlignMode === this.BOTTOM) {
          offsetY = ceil(
            boxHeight - (linesInColumn[currentColumn] - 1) * lineHeight,
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

  // console.log(linesInColumn);

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
};
