'use strict'

const { parseMTMS } = require('./pack-metadata')
const path = require('path')
const fs = require('fs')

const Cache = require('./cache')

const e = (f, ...a) => fs.existsSync(path.join(...a)) ? f(path.join(...a)) : null

module.exports = async (folder) => {
  return {
    mtms: e((f) => parseMTMS(f), folder, 'list.mtms') || { games: [], mods: [] },
    meta: e((f) => JSON.parse(String(fs.readFileSync(f))), folder, 'modpack.json') || {
      name: 'Unnamed game',
      id: 'unnamed',
      description: 'Game description here',
      license: 'License, e.x. GPL3',
      mods: {},
      games: {},
      depsResolved: {},
      optionalDepsInclude: {},
      engine: {
        version: '<version>'
      }
    },
    modlist: e((f) => JSON.parse(String(fs.readFileSync(f))), folder, 'mintest_modlist.json') || { games: {}, mods: {} },
    cache: await Cache(path.join(process.env.HOME, '.mtm_cache')),
    folder
  }
}
