const patch = require("./patch");
patch.emscripten({}, {}).then(() => {
  const drop = require("@zorse/drop");
  globalThis.drop = drop;
});

console.log("hello world");
module.exports = function () {};
