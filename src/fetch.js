'use strict'

const {
  metadata,
  content
} = require('./fetchers')

module.exports = (cache) => ({
  fetchMetadataFromURL (url) {
    return cache.withCache(['metadata', url], 0, () => {
      const urlParsed = new URL(url)

      for (const fetcher in metadata) {
        if (metadata[fetcher].isValid(url, urlParsed)) {
          return metadata[fetcher].fetch(url, urlParsed)
        }
      }

      throw new Error('No suitable fetcher. Is URL valid?')
    })
  },
  fetchContentFromDL ({ type, args }) {
    return cache.withCache(['content', type, args], 0, async () => {
      const tmp = await cache.getTmp()
      const out = await cache.getTmp()

      const res = await content[type].fetch(tmp.path, ...args)
      await content[type].postProcess(tmp.path, out.path, res)

      tmp.clear()
      return out
    })
  }
})
