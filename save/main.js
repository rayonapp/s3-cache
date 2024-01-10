const { put } = require("../cache");

const key = process.env.INPUT_KEY;
const paths = process.env.INPUT_PATH?.split("\n").filter((f) => f.trim());

put(key, paths);
