const { AwsClient } = require("./dependencies/aws4fetch/aws4fetch");
const { getInput } = require("./github-action");

const AWS_ACCESS_KEY_ID = getInput("aws-access-key-id");
const AWS_SECRET_ACCESS_KEY = getInput("aws-secret-access-key");
const AWS_REGION = getInput("aws-region");
const AWS_CACHE_BUCKET = getInput("aws-cache-bucket");

const client = new AwsClient({
  accessKeyId: AWS_ACCESS_KEY_ID,
  secretAccessKey: AWS_SECRET_ACCESS_KEY,
  region: AWS_REGION,
  service: "s3",
});

const put = async (key, body) => {
  const res = await client.fetch(
    `https://${AWS_CACHE_BUCKET}.s3.${AWS_REGION}.amazonaws.com/${key}`,
    {
      method: "PUT",
      body,
    }
  );

  if (!res.ok) throw new Error(res.statusText);
};

const exist = async (key) => {
  const res = await client.fetch(
    `https://${AWS_CACHE_BUCKET}.s3.${AWS_REGION}.amazonaws.com/${key}`,
    { method: "HEAD" }
  );

  if (res.status === 404) return false;

  if (!res.ok) throw new Error(res.statusText);

  return true;
};

const get = async (key) => {
  const res = await client.fetch(
    `https://${AWS_CACHE_BUCKET}.s3.${AWS_REGION}.amazonaws.com/${key}`
  );

  if (res.status === 404) return null;

  if (!res.ok) throw new Error(res.statusText);

  return await res.arrayBuffer();
};

module.exports = { get, put, exist };
