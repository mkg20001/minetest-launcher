'use strict'

const Repo = require('../repo')
const Fetch = require('../fetch')

module.exports = async (folder) => {
  const repo = await Repo(folder)
  const fetch = Fetch(repo.cache)

  const { games, mods } = repo.mtms

  for (let i = 0; i < games.length; i++) {
    const game = games[i]
    const metadata = await fetch.fetchMetadataFromURL(game)
    // TODO
  }

  for (let i = 0; i < mods.length; i++) {
    const game = games[i]
    const metadata = await fetch.fetchMetadataFromURL(game)
    // TODO
  }
}
