// const { Buffer } = require("buffer");
// const path = require("path-browserify");
// const { MemFs } from "./filesystem";
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
  globalThis.define("fs", () => fs);
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
  // globalThis.zorse_require = (mod) => {
  //   switch (mod) {
  //     case "console":
  //     case "path":
  //       return require("path-browserify");
  //     case "process":
  //       return process;
  //     case "crypto":
  //       return require("crypto-browserify");
  //     case "fs":
  //       return fs;
  //     // case "busybox_unstripped.wasm":
  //     //   return modules.busyBox.path;
  //     default:
  //       throw new Error(`${mod} is not defined`);
  //   }
  // };
}

module.exports = {
  emscripten,
};
