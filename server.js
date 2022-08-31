const dotenv = require('dotenv')
const mongoose = require('mongoose')

process.on('uncaughtException', (err) => {
  // eslint-disable-next-line no-console
  console.error(err.name, err.message)
  process.exit(1)
})

dotenv.config({ path: `${__dirname}/.env` })
const app = require('./app')

const port = process.env.PORT || 3000

const DBString = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
)

mongoose
  .connect(DBString, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
  })
  .then(() => {
    // eslint-disable-next-line no-console
    console.log('Connection to DB successful!')
  })

const server = app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`listening on port ${port}...`)
})

process.on('unhandledRejection', (err) => {
  // eslint-disable-next-line no-console
  console.error(err.name, err.message)

  server.close(() => {
    process.exit(1)
  })
})
