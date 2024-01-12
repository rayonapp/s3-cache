/**
 * this script is executed after the run finishes
 */

const { put } = require("./cache");
const { getState } = require("./github-action");

const key = getState("key");
const paths = getState("path")
  .split("\n")
  .filter((f) => f.trim());

if (key) {
  const a = Date.now();
  console.log("cache put", { key, paths });

  put(key, paths).then((res) => {
    console.log("cache put done", res, "  in", Date.now() - a, "ms");
  });
} else {
  console.log("cache is already set");
}
