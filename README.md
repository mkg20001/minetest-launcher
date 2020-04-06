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
          "provides": ["ids"],
          "depends": ["ids"],
          "optionalDepends": ["ids"],
          "description": "Bla,,"
        }
      }
    }
  },
  "games": {
    "<id>": {
      "versions": {
        "<version>": {
          "description": "Bla,,",
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
  "game": {
    "id": "<id>",
    "version": "<version>"
  },
  "engine": {
    "version": "version"
  }
}
```

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

