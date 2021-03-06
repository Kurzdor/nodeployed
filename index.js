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
const validator = require('./lib/validator')

validator(args)

const TOKEN = args.token || 'nodeployed'
const PORT = args.port // This boy is required
const DIR = args.dir // This boy is required
const BRANCH = args.branch || 'master'
const COMMAND = args.command || 'bash ./deploy.sh'
const commandsList = []

// Split commands if there are any of them by "AND" symbol
// and split by space as it needs execa to work with

COMMAND &&
  COMMAND.split(' && ').forEach(el => {
    const splittedCommand = el.split(' ')
    commandsList.push(splittedCommand)
  })

// Handle main POST route

fastify.post('/', async (request, reply) => {
  // Get token from request query string
  const SENT_TOKEN = request.query.token // ?token=MY_TOKEN

  // Validate our token
  if (SENT_TOKEN && SENT_TOKEN === TOKEN) {
    try {
      // cd to working directory
      // thats because we use an absolute path
      process.chdir(path.resolve(DIR))

      console.log(`Trying to checkout branch ${BRANCH}`)

      // First checkout required branch
      await execa('git', ['checkout', BRANCH], {
        stdio: 'inherit',
      })

      console.log(`Pulling from remote repository...`)

      // Next is to pull all changes
      await execa('git', ['pull'], {
        stdio: 'inherit',
      })

      // If any commands then run them in a order as the user gave us
      if (commandsList.length) {
        console.log(commandsList)
        for (const command of commandsList) {
          const commandArgs = command.slice(1)
          console.log(
            `[INFO] Running ${command[0]} with arguments ${commandArgs.join(
              ' '
            )}`
          )
          // Execute each command synchronously just as user ordered
          await execa(command[0], commandArgs, {
            stdio: 'inherit',
          })
        }
      }
    } catch (error) {
      console.log(`${red('✖')} ${error}`)

      await reply
        .code(403)
        .header('Content-Type', 'application/json; charset=utf-8')
        .send({
          result: false,
          reason: error,
        })
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
        reason: "Tokens don't match. Please recheck your tokens",
      })
  }
})

// Handle main GET route to show that script and server are working properly
fastify.get('/', async (request, reply) => {
  return 'Nodeployed is working! You should set this link in your Webhooks configuration for your repository!'
})

// Start server
const startNodeployed = async () => {
  try {
    // Listen for any requests on --port [port]
    await fastify.listen(PORT)
  } catch (err) {
    // Throw a log on any error and shutdown the server
    fastify.log.error(err)

    process.exit(1)
  }
}

startNodeployed()
