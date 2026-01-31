import { zineAddon } from "../zine.js";
import { customAddon } from "../custom.js";

function registerLegacyHooks(lifecycles) {
  if (typeof p5 === "undefined") {
    return;
  }
  if (typeof p5.prototype.registerMethod !== "function") {
    return;
  }

  if (lifecycles.presetup) {
    p5.prototype.registerMethod("beforeSetup", lifecycles.presetup);
  }
  if (lifecycles.postsetup) {
    p5.prototype.registerMethod("afterSetup", lifecycles.postsetup);
  }
  if (lifecycles.predraw) {
    p5.prototype.registerMethod("pre", lifecycles.predraw);
  }
  if (lifecycles.postdraw) {
    p5.prototype.registerMethod("post", lifecycles.postdraw);
  }
  if (lifecycles.remove) {
    p5.prototype.registerMethod("remove", lifecycles.remove);
  }
}

function exposeGlobals(instance) {
  if (typeof window === "undefined") {
    return;
  }

  const pages = ["cover", "one", "two", "three", "back"];
  pages.forEach((key) => {
    if (instance[key]) {
      window[key] = instance[key];
    }
  });

  if (instance.selfie) {
    window.selfie = instance.selfie;
  }

  if (instance.all) {
    window.all = instance.all;
  }
}

function patchInitZineForGlobals() {
  if (typeof p5 === "undefined") {
    return;
  }

  const proto = p5.prototype;
  if (!proto || typeof proto.initZine !== "function") {
    return;
  }

  if (proto.initZine._zineGlobalsWrapped) {
    return;
  }

  const originalInitZine = proto.initZine;
  const wrappedInitZine = function () {
    const result = originalInitZine.call(this);
    exposeGlobals(this);
    return result;
  };
  wrappedInitZine._zineGlobalsWrapped = true;
  proto.initZine = wrappedInitZine;
}

function registerUniversalAddon() {
  if (typeof p5 === "undefined") {
    return;
  }

  if (typeof p5.registerAddon === "function") {
    p5.registerAddon(zineAddon);
    p5.registerAddon(customAddon);
  } else {
    const lifecycles = {};
    zineAddon(p5, p5.prototype, lifecycles);
    customAddon(p5, p5.prototype);
    registerLegacyHooks(lifecycles);
  }

  patchInitZineForGlobals();
}

registerUniversalAddon();
