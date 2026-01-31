import * as Background from "./custom/Background.js";
import * as selfieBackground from "./custom/selfieBackground.js";
import * as rightCamera from "./custom/rightCamera.js";
import * as randomLayout from "./custom/randomLayout.js";
import * as gridLayout from "./custom/gridLayout.js";
import * as glitchLayout from "./custom/glitchLayout.js";
import * as leftBackground from "./custom/leftBackground.js";
import * as rightBackground from "./custom/rightBackground.js";
import * as fullPage from "./custom/fullPage.js";
import * as leftPage from "./custom/leftPage.js";
import * as rightPage from "./custom/rightPage.js";
import * as textSet from "./custom/textSet.js";
import * as textBox from "./custom/textBox.js";

const CUSTOM_METHODS = [
  Background,
  selfieBackground,
  rightCamera,
  randomLayout,
  gridLayout,
  glitchLayout,
  leftBackground,
  rightBackground,
  fullPage,
  leftPage,
  rightPage,
  textSet,
  textBox,
];

export const CUSTOM_FUNCTIONS = CUSTOM_METHODS.map((method) => method.meta);

// customized functions
export function customAddon(p5, fn) {
  const applyMethod = (name, method) => {
    fn[name] = method;
    if (p5?.Graphics?.prototype) {
      p5.Graphics.prototype[name] = method;
    }
  };

  CUSTOM_METHODS.forEach((method) => {
    if (!method || typeof method.method !== "function") {
      return;
    }
    const methodName = method.name || method.meta?.name;
    if (!methodName) {
      return;
    }
    applyMethod(methodName, method.method);
  });
}
