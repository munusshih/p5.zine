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
      exposeWritableGlobal(key, instance[key]);
    }
  });

  if (instance.selfie) {
    exposeWritableGlobal("selfie", instance.selfie);
  }

  if (instance.all) {
    exposeWritableGlobal("all", instance.all);
  }
}

function exposeWritableGlobal(key, value) {
  const descriptor = Object.getOwnPropertyDescriptor(window, key);
  if (
    !descriptor ||
    descriptor.writable ||
    typeof descriptor.set === "function"
  ) {
    window[key] = value;
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

function installLegacySketchCallbacks() {
  const pages = ["cover", "one", "two", "three", "back"];
  const setupCallbacks = ["setupPage", ...pages.map((page) => page + "Set")];
  const drawCallbacks = [
    "drawPage",
    ...pages.map((page) => page + "Page"),
    ...pages.map((page) => page + "Draw"),
  ];
  const hasCallback = (names) =>
    names.some((name) => typeof window[name] === "function");
  const runCallbacks = (names) => {
    for (const name of names) {
      if (typeof window[name] === "function") {
        window[name]();
      }
    }
  };

  if (!hasCallback(setupCallbacks) && !hasCallback(drawCallbacks)) {
    return;
  }

  // Classic sketches also used a top-level const or let for their settings.
  if (!window.zine && typeof zine !== "undefined") {
    window.zine = zine;
  }

  if (typeof window.setup !== "function" && hasCallback(setupCallbacks)) {
    window.setup = () => runCallbacks(setupCallbacks);
  }
  if (typeof window.draw !== "function" && hasCallback(drawCallbacks)) {
    window.draw = () => runCallbacks(drawCallbacks);
  }
}

registerUniversalAddon();
window.addEventListener("p5Ready", installLegacySketchCallbacks, { once: true });
