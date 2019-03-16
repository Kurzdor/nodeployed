const red = require('ansi-red')

module.exports = args => {
  // Validate port: it must be a valid IPv4 port
  if (!args.port || typeof args.port !== 'number' || args.port >= 65536) {
    console.error(red(`ERROR! The argument --port is invalid!`))
    process.exit(1)
  }

  // Validate working directory: it needs to be a valid string and passed by user.
  // Otherwise just throw and error and quit
  if (!args.dir || typeof args.dir !== 'string') {
    console.error(red(`ERROR! The argument --dir is invalid!`))
    process.exit(1)
  }

  // handle and validate commands that we need to run
  if (typeof args.command !== 'string') {
    console.error(red(`ERROR! The argument --command is invalid!`))
    process.exit(1)
  }
}
