const fs = require("fs");
const os = require("os");

const getInput = (name) => process.env[`INPUT_${name.toUpperCase()}`];

const getState = (name) => process.env[`STATE_${name}`] || "";

const setState = (name, value) => {
  fs.appendFileSync(
    process.env["GITHUB_STATE"],
    prepareKeyValueMessage(name, value),
    { encoding: "utf8" }
  );
};

const setOutput = (name, value) => {
  fs.appendFileSync(
    process.env["GITHUB_OUTPUT"],
    prepareKeyValueMessage(name, value),
    { encoding: "utf8" }
  );
};

const prepareKeyValueMessage = (name, value) => {
  const delimiter = `ghadelimiter_${Math.random().toString()}`;
  return `${name}<<${delimiter}${os.EOL}${value}${os.EOL}${delimiter}${os.EOL}`;
};

module.exports = { getInput, getState, setOutput, setState };
