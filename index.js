#!/usr/bin/env node

const path = require('path')
const args = require('minimist')(process.argv.slice(2))
const logger = require('pino')({
  prettyPrint: true,
  level: 'info',
})
const fastify = require('fastify')({ logger })
const execa = require('execa')
const red = require('ansi-red')

if (!args.port || !typeof args.port === 'number' || args.port >= 65536) {
  console.error(red(`ERROR! The argument --port is invalid!`))
  process.exit(1)
}

if (!typeof args.token === 'string') {
  console.error(red(`ERROR! The argument --token is invalid!`))
  process.exit(1)
}

if (!args.dir || !typeof args.dir === 'string') {
  console.error(red(`ERROR! The argument --dir is invalid!`))
  process.exit(1)
}

if (!typeof args.branch === 'string') {
  console.error(red(`ERROR! The argument --branch is invalid!`))
  process.exit(1)
}

const TOKEN = args.token || 'nodeployed'
const PORT = args.port
const DIR = args.dir
const BRANCH = args.branch || 'master'

fastify.post('/', async (request, reply) => {
  console.log(request)

  const SENT_TOKEN = request.query.token

  if (SENT_TOKEN && SENT_TOKEN === TOKEN) {
    try {
      process.chdir(path.resolve(DIR))

      await execa('git', ['checkout', BRANCH], {
        stdio: 'inherit',
      })

      await execa('git', ['pull'], {
        stdio: 'inherit',
      })
    } catch (error) {
      console.log(`${red('✖')} ${error}`)

      await reply
        .code(403)
        .header('Content-Type', 'application/json; charset=utf-8')
        .send({
          result: false,
          reason: error,
        })

      process.exit(1)
    }

    await reply
      .code(200)
      .header('Content-Type', 'application/json; charset=utf-8')
      .send({ result: true })
  } else {
    await reply
      .code(403)
      .header('Content-Type', 'application/json; charset=utf-8')
      .send({
        result: false,
        reason: "Tokens doens't match. Please recheck your tokens",
      })
  }
})

fastify.get('/', async (request, reply) => {
  return 'Nodeployed is working! You should set this link in your Webhooks configuration for your repository!'
})

const startNodeployed = async () => {
  try {
    await fastify.listen(PORT)
  } catch (err) {
    fastify.log.error(err)

    process.exit(1)
  }
}

startNodeployed()
