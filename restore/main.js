const { get, lookUp } = require("../cache");
const { getInput, setOutput } = require("../github-action");

const key = getInput("key");
const lookupOnly = getInput("lookup-only");
const paths = getInput("path")
  .split("\n")
  .filter((f) => f.trim());

if (lookupOnly) lookUp(key).then((res) => setOutput("cache-hit", res.cacheHit));
else get(key, paths).then((res) => setOutput("cache-hit", res.cacheHit));
