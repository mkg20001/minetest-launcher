'use strict'

const fs = require('fs')
const path = require('path')
const mkdirp = require('mkdirp').sync
const rimraf = require('rimraf').sync

const p = (a) => a.map(a => Array.isArray(a) ? p(a) : String(a)).join('_')

module.exports = (folder) => {
  mkdirp(folder)

  return {
    async withCache (id, expire, real) {
      const fsID = path.join(folder, p(id).replace(/\//g, '_'))
      if (!fs.existsSync(fsID)) {
        const out = await real()
        if (out._cache_tmp) {
          fs.renameSync(out.path, fsID)
          return fsID
        } else {
          fs.writeFileSync(fsID, JSON.stringify(out))
          return out
        }
      }

      if (fs.statSync(fsID).isDirectory()) {
        return fsID
      } else {
        return JSON.parse(String(fs.readFileSync(fsID)))
      }
    },
    getTmp () {
      const path = '/tmp/' + String(Math.random())

      return {
        path,
        _cache_tmp: true,
        clear: () => rimraf(path)
      }
    }
  }
}
