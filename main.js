const { get } = require("./cache");
const { getInput, setState, setOutput } = require("./github-action");

const failOnCacheMiss = getInput("fail-on-cache-miss") === "true";
const key = getInput("key");
const paths = getInput("path")
  .split("\n")
  .filter((f) => f.trim());

const a = Date.now();
console.log("cache get", { key, paths });
get(key, paths).then((res) => {
  console.log("cache get done", res, "  in", Date.now() - a, "ms");

  if (!res.cacheHit) {
    // save those to the state, to use in post step
    setState("key", key);
    setState("path", paths.join("\n"));
  }

  setOutput("cache-hit", res.cacheHit);
  if (res.cacheHit === false && failOnCacheMiss) throw new Error("cache miss");
});
