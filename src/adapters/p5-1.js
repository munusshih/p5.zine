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

function registerLegacyAddon() {
  if (typeof p5 === "undefined") {
    return;
  }

  const lifecycles = {};
  zineAddon(p5, p5.prototype, lifecycles);
  customAddon(p5, p5.prototype);
  const originalInitZine = p5.prototype.initZine;
  p5.prototype.initZine = function() {
    if (typeof originalInitZine === "function") {
      originalInitZine.call(this);
    }

    if (typeof window === "undefined") {
      return;
    }

    const pages = ["cover", "one", "two", "three", "back"];
    pages.forEach((key) => {
      if (this[key]) {
        window[key] = this[key];
      }
    });

    if (this.selfie) {
      window.selfie = this.selfie;
    }

    if (this.all) {
      window.all = this.all;
    }
  };
  registerLegacyHooks(lifecycles);
}

registerLegacyAddon();
