# minetestlauncher

# Creating a pack

# 0. Sources

- https://content.minetest.net/
- GitHub
- https://forum.minetest.net/viewforum.php?f=11

# 1. Creating a MineTest Modlist Simple

The format goes like this

```
!mods
# comment (optional)
https://mod-url
!games
https://github.com/minetest/minetest_game
```

This will pull all the mods, get the metadata (based on url/url type - .tar.gz, git, etc - todo forum, content db - add .git to force https git) like versions, etc and create a minetest_modlist.json

# Minetest mod list

```
{
  "mods": {
    "<id>": {
      "versions": {
        "<version>": {
          "description": "Bla,,",
          "depends": ["ids"],
          "optionalDepends": ["ids"],
          "dl": { "type": "genericFile", "args": ["url"] },

          "provides": {
            "<id>": {
              "depends": ["ids"],
              "optionalDepends": ["ids"],
              "description": "Bla,,"
            }
          }
        }
      }
    }
  },
  "games": {
    "<id>": {
      "versions": {
        "<version>": {
          "description": "Bla,,",
          "dl": { "type": "genericFile", "args": ["url"] },
          "license": "..."
        }
      }
    }
  }
}
```

# Minetest mod json

```
{
  "name": "Unnamed pack",
  "description": "Bla...",
  "license": "...",
  "mods": {
    "id": "<version>"
  },
  "depsResolved": {}, // this is the same as mods, just automatically added for all mods that a mod from mods depends on, so you can change the version
  "optionalDepsInclude": {}, // specify which optional mods to include/exclude (id-><bool>)
  "game": {
    "id": "<id>",
    "version": "<version>"
  },
  "engine": {
    "version": "version"
  }
}
```

(resolve deps by checking package deps, then checking if added already, otherwise check mods_resolved and resolve or take latest and add to mods_resolved - check optional_deps_include or ask user, add as dep)
(for game just download and place into right folder)

- Get all basic metadata
- Versions, etc
- Then get metadata of each latest version (so we have a cache of stuff) and cache the source of the latest

## Metadata mods

ex:
- https://github.com/rael5/minetest-nether-monsters


depends.txt:

```
# this depends
dependency
# this depends optionally
dependency?
```

description.txt:

```
Description, single line, raw text
```

license.text:

```
License
Multi-Line, raw text
```

ex:
- https://github.com/Coder12a/tnt_revamped/blob/master/mod.conf

mod.conf:

```
# kv
name = id
description = raw text desc
optional_depends = sloppy, comma deps
depends = sloppy, comma deps
```

ex:
- https://github.com/stujones11/minetest-3d_armor

modpack.txt:
Means we have a bundle of mods with their own init.lua's

Find all folders with init.lua and analyze their folder's contents with same metadata thing

# Tool

```
mtm addFromUrl mod/game <url>
mtm refresh # updates minetest_modlist.json
mtm install ID
mtm list ID
mtm uninstall ID
mtm check # checks if all optional_deps and deps_resolved things are actually used
mtm build # downloads everything, builds a bundle
mtm play # launches mintest with the bundle
```
