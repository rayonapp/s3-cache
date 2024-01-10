/**
 * this script is executed after the run finishes
 */

const { put } = require("./cache");
const { exist } = require("./s3");

const key = process.env.INPUT_KEY;
const paths = process.env.INPUT_PATH?.split("\n").filter((f) => f.trim());

exist(key).then((cacheHit) => {
  if (!cacheHit) put(key, paths);
});
