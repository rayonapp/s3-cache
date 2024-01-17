const { get, lookUp } = require("../cache");
const { getInput, setOutput } = require("../github-action");

const key = getInput("key");
const failOnCacheMiss = getInput("fail-on-cache-miss") === "true";
const lookupOnly = getInput("lookup-only") === "true";
const paths = getInput("path")
  .split("\n")
  .filter((f) => f.trim());

if (lookupOnly) {
  console.log("cache lookup", { key });
  lookUp(key).then((res) => {
    console.log("cache lookup done", res);
    setOutput("cache-hit", res.cacheHit);
    if (res.cacheHit === false && failOnCacheMiss)
      throw new Error("cache miss");
  });
} else {
  const a = Date.now();
  console.log("cache get", { key, paths });
  get(key, paths).then((res) => {
    console.log("cache get done", res, "  in", Date.now() - a, "ms");
    setOutput("cache-hit", res.cacheHit);
    if (res.cacheHit === false && failOnCacheMiss)
      throw new Error("cache miss");
  });
}
