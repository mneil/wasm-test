// Set to true to use proxy module objects for debugging
const debugModules = true;

const console2 = new Promise((resolve, reject) => {
  if (typeof define === "function") {
    globalThis.define("console", () => {
      return {
        log(...args) {
          console.log(...args);
        },
        warn(...args) {
          console.log(...args);
        },
        error(...args) {
          console.log(...args);
        },
        debug(...args) {
          console.log(...args);
        },
        stdout(...args) {
          console.log(...args);
        },
        stderr(...args) {
          console.log(...args);
        },
      };
    });
    globalThis.requirejs(["console"], () => {
      resolve();
    });
  }
});

const process = new Promise((resolve, reject) => {
  const process = require("process");
  // trick emscripten into thinking this is Node
  process.versions.node = "true";
  process.platform = "linux";
  process.binding = () => {
    return require("constants-browserify");
  };
  process.exit = (code) => {
    console.log("Exiting process", code);
  };
  globalThis.define("process", () => process);
  globalThis.requirejs(["process"], () => {
    resolve();
  });
});

const fs = new Promise((resolve, reject) => {
  const { fs } = require("memfs");

  function proxy() {
    return new Proxy(fs, {
      get(target, prop, receiver) {
        const value = Reflect.get(target, prop, receiver);
        if (typeof value === "function") {
          return (...args) => {
            console.log("ProxyFs", prop, "with", ...args);
            if (prop === "writeSync") {
              console.log("what are we even writing that's so big?");
              console.log(args[1].toString());
            }
            try {
              return value.apply(target, args);
            } catch (e) {
              if (typeof prop === "string" && e.name === "TypeError" && e.message === "callback must be a function") {
                const syncProp = `${prop}Sync`;
                if (Object.keys(target).includes(syncProp) && typeof target[syncProp] === "function") {
                  return Reflect.get(target, syncProp, receiver).apply(target, args);
                }
              }
              throw e;
            }
          };
        }
        return value;
      },
    });
  }

  const whichFs = debugModules ? proxy() : fs;
  globalThis.fs = whichFs;

  globalThis.define("fs", () => whichFs);
  globalThis.requirejs(["fs"], () => {
    resolve();
  });
});

const path = new Promise((resolve, reject) => {
  const path = require("path-browserify");
  globalThis.define("path", () => path);
  globalThis.requirejs(["path"], () => {
    resolve();
  });
});

function emscripten() {
  return Promise.all([console2, process, fs, path]);
}

module.exports = {
  emscripten,
};
