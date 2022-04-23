// zine-----------------------------------------
// customized functions
p5.prototype.Background = function (r, g, b) {
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
      (this.height * selfie.height) / selfie.width
    );
  } else {
    this.image(
      selfie,
      -50,
      0,
      (this.width * selfie.width) / selfie.height,
      this.height
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
    (this.width * capture.height) / capture.width
  );
};

p5.prototype.randomLayout = function (
  word = ["word"],
  num = 5,
  repeat = 20,
  fun = false
) {
  let sizer = 10;
  this.push();
  this.translate(this.width / 2, this.height / 2);
  for (let i = 0; i < repeat; i++) {
    for (let j = 0; j < word.length; j++) {
      if (fun) {
        this.textSize(random(5, 50));
      }
      if (typeof word[j] === "string") {
        this.text(
          word[j],
          random(-(this.width / 20) * num, (this.width / 20) * num),
          random(-(this.height / 20) * num, (this.height / 20) * num)
        );
      } else if (typeof word[j] === "object") {
        let ar = word[j].width / word[j].height;
        this.image(
          word[j],
          random(-(this.width / 20) * num, (this.width / 20) * num),
          random(-(this.height / 20) * num, (this.height / 20) * num),
          sizer * ar * 2,
          sizer * 2
        );
      }
    }
  }
  this.pop();
};

p5.prototype.gridLayout = function (
  word = ["word"],
  columnNum = 5,
  repeat = 20,
  fun = false
) {
  this.push();
  this.translate(10, 30);
  let row = 0,
    column = 0;
  let num = 0;
  let size = 20;
  let sizer = size;

  for (let i = 0; i < repeat; i++) {
    for (let j = 0; j < word.length; j++) {
      if (fun) {
        let rowNum = int(random(5, 10));
        row = floor(num / rowNum);
        column = num % columnNum;
      } else {
        row = floor(num / columnNum);
        column = num % columnNum;
      }

      if (typeof word[j] === "string") {
        this.text(word[j], column * size * 2.5, row * size * 2.5);
      } else if (typeof word[j] === "object") {
        let ar = word[j].width / word[j].height;
        this.image(
          word[j],
          column * size * 2.5 - size / 2,
          row * size * 2.5 - size,
          sizer * ar * 2,
          sizer * 2
        );
      }
      num++;
    }
  }
  this.pop();
};

p5.prototype.glitchLayout = function (
  word = ["word"],
  num = 5,
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
    for (let j = 0; j < word.length; j++) {
      let w = random(this.width);
      let h = random(this.height);

      for (let n = 0; n < num; n++) {
        if (typeof word[j] === "string") {
          this.text(word[j], w + n * 5, h + sin(n * wave) * 10);
        } else if (typeof word[j] === "object") {
          let ar = word[j].width / word[j].height;
          this.image(word[j], w, h, 10 * ar * 2, 10 * 2);
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
        })
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
  theAlign = "LEFT",
  theLead = theSize
) {
  this.textFont(theFont);
  this.textSize(theSize);
  this.textAlign(theAlign.toUpperCase());
  this.textLeading(theLead);
};
