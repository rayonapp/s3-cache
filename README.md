# s3-cache

> Drop in replace for [actions/cache](https://github.com/actions/cache), cache artifact on s3

# Usage

```yaml
steps:
  - uses: rayonapp/s3-cache
    with:
      path: |
        path/to/file/a
        another/file
        a/directory
      key: cache-${{ hashFiles('**/**.rs') }}
      aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
      aws-secret-access-key: ${{ secrets.AWS_ACCESS_SECRET }}
      aws-region: ${{ secrets.AWS_REGION }}
      aws-cache-bucket: ${{ secrets.AWS_CACHE_BUCKET }}
```

# Motivation

Handle cache expiration ourselves.

No restriction based on branches, [github-restrictions-for-accessing-a-cache](https://docs.github.com/en/actions/using-workflows/caching-dependencies-to-speed-up-workflows#restrictions-for-accessing-a-cache)

# Implementation

- zip every file (or directory recursively) in path
- make a zip of all of them
- upload the resulting zip with cache key as name
