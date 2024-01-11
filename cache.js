const s3 = require("./s3");
const { join: path_join } = require("path");
const fs = require("fs");
const { execSync, execFileSync } = require("child_process");

/**
 * set the cache-hit output
 * cache-hit=true if a cache if found for this key
 */
const lookUp = async (key) => {
  console.log("look up", { key });

  const cacheHit = await s3.exist(key);

  console.log("cacheHit=", cacheHit.toString());

  execSync(`echo "cache-hit=${cacheHit.toString()}" >> $GITHUB_OUTPUT`);
};

/**
 * push files to the cache
 *
 * for each path, create a zip file in a tmp dir
 * then zip all of them
 * and push the resulting file to s3 with the cache key as name
 */
const put = async (key, paths) => {
  const a = Date.now();
  console.log("put", { key, paths });

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

    const payloadSize =
      (new Uint8Array(payload).length / 1024 / 1024).toFixed(3) + "Mb";
    console.log("uploaded in", Date.now() - a, "ms  ", payloadSize);
  } finally {
    fs.rmSync(tmpDir, { recursive: true });
  }
};

/**
 * get files from the cache
 */
const get = async (key, paths) => {
  const a = Date.now();
  console.log("get", { key, paths });

  const payload = await s3.get(key);

  if (payload) {
    const tmpDir = fs.mkdtempSync("s3-cache");

    try {
      fs.writeFileSync(
        path_join(tmpDir, "__payload.zip"),
        Buffer.from(payload)
      );

      {
        const payloadSize =
          (new Uint8Array(payload).length / 1024 / 1024).toFixed(3) + "Mb";
        console.log(`cache hit ${payloadSize}`);
      }

      execFileSync("unzip", ["__payload.zip"], { cwd: tmpDir });

      for (const filename of paths) {
        const pathKey = filename.replace(/\//g, "_") + ".zip";

        if (!fs.existsSync(path_join(tmpDir, pathKey)))
          throw new Error(`file don't exist in the cache: ${filename}`);

        execFileSync("unzip", ["-o", path_join(tmpDir, pathKey)]);
      }

      execSync(`echo "cache-hit=true" >> $GITHUB_OUTPUT`);

      console.log("downloaded in", Date.now() - a, "ms");
    } finally {
      fs.rmSync(tmpDir, { recursive: true });
    }
  }
};

module.exports = { get, put, lookUp };
