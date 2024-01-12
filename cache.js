const s3 = require("./s3");
const { join: path_join } = require("path");
const fs = require("fs");
const { execSync, execFileSync } = require("child_process");

/**
 * check if the cache exist
 */
const lookUp = async (key) => {
  return { cacheHit: await s3.exist(key) };
};

/**
 * push files to the cache
 *
 * for each path, create a zip file in a tmp dir
 * then zip all of them
 * and push the resulting file to s3 with the cache key as name
 */
const put = async (key, paths) => {
  const tmpDir = fs.mkdtempSync("s3-cache");

  try {
    for (const path of paths) {
      if (!fs.existsSync(path)) throw new Error(`file don't exist: ${path}`);

      const pathKey = path.replace(/\//g, "_") + ".zip";

      execFileSync("zip", [path_join(tmpDir, pathKey), "-r", path]);
    }

    execFileSync("zip", ["__payload.zip", "-r", "."], { cwd: tmpDir });

    const payload = fs.readFileSync(path_join(tmpDir, "__payload.zip"));

    await s3.put(key, payload);

    return {
      payloadSize:
        (new Uint8Array(payload).length / 1024 / 1024).toFixed(3) + "Mb",
    };
  } finally {
    fs.rmSync(tmpDir, { recursive: true });
  }
};

/**
 * get files from the cache
 */
const get = async (key, paths) => {
  const payload = await s3.get(key);

  if (payload) {
    const tmpDir = fs.mkdtempSync("s3-cache");

    try {
      fs.writeFileSync(
        path_join(tmpDir, "__payload.zip"),
        Buffer.from(payload)
      );

      execFileSync("unzip", ["__payload.zip"], { cwd: tmpDir });

      for (const filename of paths) {
        const pathKey = filename.replace(/\//g, "_") + ".zip";

        if (!fs.existsSync(path_join(tmpDir, pathKey)))
          throw new Error(`file don't exist in the cache: ${filename}`);

        execFileSync("unzip", ["-o", path_join(tmpDir, pathKey)]);
      }

      return {
        cacheHit: true,
        payloadSize:
          (new Uint8Array(payload).length / 1024 / 1024).toFixed(3) + "Mb",
      };
    } finally {
      fs.rmSync(tmpDir, { recursive: true });
    }
  }
  return { cacheHit: false };
};

module.exports = { get, put, lookUp };
