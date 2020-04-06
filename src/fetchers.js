'use strict'

const fetch = require('node-fetch')

const cp = require('child_process')
const bl = require('bl')

const fs = require('fs')
const path = require('path')
const rimraf = require('rimraf').sync
const mkdirp = require('mkdirp').sync

const stream = require('stream')
const util = require('util')
const pipeline = util.promisify(stream.pipeline)

const tarCompArgs = {
  gz: '--gzip',
  xz: '--xz'
}

function spawn (cmd, args) {
  return new Promise((resolve, reject) => {
    const p = cp.spawn(cmd, args, { stdio: ['inherit', 'pipe', 'inherit'] })
    p.stdout = p.stdout.pipe(bl())
    p.once('error', (err) => reject(err))
    p.once('exit', (code, sig) => {
      if (code || sig) reject(new Error('Code/Sig ' + (code || sig)))
      else resolve(String(p.stdout))
    })
  })
}

async function unpackGeneric (file, out, name) {
  const split = file.split('.')
  const ext = split.pop()
  const tar = split.pop() === 'tar'

  mkdirp(out)

  let cmd = null
  let args = []

  if (tar) {
    cmd = 'tar'
    args = ['xf', file, tarCompArgs[ext], 'C', out]
  } else if (ext === 'zip') {
    cmd = 'unzip'
    args = [file, '-d', out]
  } else {
    throw new Error('Cannot decompress ' + name)
  }

  return spawn(cmd, args)
}

module.exports = {
  metadata: {
    github: {
      isValid (url, urlParsed) {
        console.log(url)
        return urlParsed.host === 'github.com' && !url.endsWith('.git')
      },
      async fetch (url, urlParsed) {
        const [, owner, repo] = urlParsed.pathname.split('/')
      }
    },
    contentdb: {
      isValid (url, urlParsed) {
        // https://content.minetest.net/packages/USER/ID/
        return urlParsed.host === 'content.minetest.net' && urlParsed.pathname.startsWith('/packages/')
      },
      async fetch (url, urlParsed) {
        const [, user, id] = urlParsed.pathname.split('/')

        const pkg = await (await fetch(`https://content.minetest.net/api/packages/${user}/${id}/`)).json()
        const releases = await (await fetch(`https://content.minetest.net/api/packages/${user}/${id}/releases/`)).json()

        return {
          id,
          description: pkg.short_description,
          license: pkg.license,
          versions: releases.map(release => ({
            id: release.id,
            dl: {
              type: 'genericFile',
              args: [release.url]
            }
          }))
        }
      }
    },
    git: {
      isValid (url, urlParsed) {
        return url.endsWith('.git')
      }
    }
  },
  content: {
    genericFile: {
      async fetch (out, url) {
        const res = await fetch(out)

        await pipeline(
          res.body,
          fs.createWriteStream(out)
        )

        return path.basename(url)
      },
      postProcess: unpackGeneric
    },
    git: {
      fetch (out, remote, commitLike) {

      },
      postProcess (out, newOut) {
        rimraf(out, '.git')
        fs.renameSync(out, newOut)
      }
    }
  }
}
