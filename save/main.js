const { put } = require("../cache");
const { getInput } = require("../github-action");

const key = getInput("key");
const paths = getInput("path")
  .split("\n")
  .filter((f) => f.trim());

put(key, paths);
