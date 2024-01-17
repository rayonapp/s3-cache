const { put } = require("../cache");
const { getInput } = require("../github-action");

const key = getInput("key");
const paths = getInput("path")
  .split("\n")
  .filter((f) => f.trim());

const a = Date.now();
console.log("cache put", { key, paths });
put(key, paths).then((res) => {
  console.log("cache put done", res, "  in", Date.now() - a, "ms");
});
