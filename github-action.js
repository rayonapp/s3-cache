const fs = require("fs");
const os = require("os");

/**
 * get github action step input
 */
const getInput = (name) => process.env[`INPUT_${name.toUpperCase()}`];

/**
 * set github action state
 * which can be shared across pre / main / post action scripts
 */
const setState = (name, value) => {
  fs.appendFileSync(
    process.env["GITHUB_STATE"],
    prepareKeyValueMessage(name, value),
    { encoding: "utf8" }
  );
};

/**
 * set github action state
 */
const getState = (name) => process.env[`STATE_${name}`] || "";

/**
 * set github action step output
 */
const setOutput = (name, value) => {
  fs.appendFileSync(
    process.env["GITHUB_OUTPUT"],
    prepareKeyValueMessage(name, value),
    { encoding: "utf8" }
  );
};

/**
 * from https://github.com/actions/toolkit/blob/main/packages/core/src/file-command.ts#L27
 */
const prepareKeyValueMessage = (name, value) => {
  const delimiter = `ghadelimiter_${Math.random().toString()}`;
  return `${name}<<${delimiter}${os.EOL}${value}${os.EOL}${delimiter}${os.EOL}`;
};

module.exports = { getInput, getState, setOutput, setState };
