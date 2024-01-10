const { get, lookUp } = require("../cache");

const key = process.env.INPUT_KEY;
const lookupOnly = process.env["INPUT_LOOKUP-ONLY"];
const paths = process.env.INPUT_PATH?.split("\n").filter((f) => f.trim());

if (lookupOnly) lookUp(key);
else get(key, paths);
