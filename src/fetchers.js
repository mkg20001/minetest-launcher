'use strict'

const assert = require('assert')
const fetch = require('node-fetch')
const fs = require('fs')
const rimraf = require('rimraf')

async function unpackGeneric (file, out) {

}

module.exports = {
  fetchers: {
    metadata: {
      github: {
        isValid: (url, urlParsed) => {
          assert(urlParsed.host === 'github.com')
        }
      }
    },
    content: {
      genericFile: {
        fetch: async (out, url) => {

        },
        postProcess: unpackGeneric
      },
      git: {
        fetch: async (out, remote, commitLike) => {

        },
        postProcess: async (out, newOut) => {
          await rimraf(out, '.git')
          fs.renameSync(out, newOut)
        }
      }
    }
  }
}
