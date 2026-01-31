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

function registerModernAddon() {
  if (typeof p5 === "undefined") {
    return;
  }

  if (typeof p5.registerAddon === "function") {
    p5.registerAddon(zineAddon);
    p5.registerAddon(customAddon);
    return;
  }

  const lifecycles = {};
  zineAddon(p5, p5.prototype, lifecycles);
  customAddon(p5, p5.prototype);
  registerLegacyHooks(lifecycles);
}

registerModernAddon();
