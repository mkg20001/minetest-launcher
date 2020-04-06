'use strict'

const [cmd, ...args] = process.argv.slice(2)

switch (cmd) {
  case 'refresh':
    require('./cmd/refresh')(process.cwd(), ...args)
    break
  default: {
    throw new Error('No cmd ' + cmd)
  }
}
