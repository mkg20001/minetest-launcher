'use strict'

const fs = require('fs')
const path = require('path')

const exists = (...a) => fs.existsSync(path.join(...a))
const read = (...a) => String(fs.readFileSync(path.join(...a)))

const KV_RE = /^([a-z0-9]+) *= *(.+)$/gmi
const COMMA_RE = / *, */gmi

const debug = require('debug')

function getMetadata (folder) {
  const log = debug(`mtm:meta:${folder}`)

  const out = {
    id: null,
    description: null,
    depends: [],
    optionalDepends: []
  }

  if (exists(folder, 'description.txt')) {
    log('read description.txt')
    out.description = read(folder, 'description.txt')
  }

  if (exists(folder, 'depends.txt')) {
    log('read depends.txt')
    const deps = read(folder, 'depends.txt').split('\n').map(str => str.trim()).filter(Boolean)
    out.depends = deps.filter(d => !d.endsWith('?'))
    out.optionalDepends = deps.filter(d => d.endsWith('?')).map(s => s.replace(/\?$/, ''))
  }

  if (exists(folder, 'mod.conf')) {
    const kv = getMatches(read(folder, 'mod.conf'), KV_RE).reduce((line, out) => {
      const [_, key, value] = line

      if (value.endsWith('depends')) {
        out[key] = value.split(COMMA_RE)
      } else {
        out[key] = value
      }

      return out
    }, {})

    log('kv %o', kv)

    if (kv.name) { out.id = kv.name }
    if (kv.depends) { out.depends = kv.depends }
    if (kv.optional_depends) { out.optionalDepends = kv.optional_depends }
  }
}

module.exports = {
  getMetadata
}
