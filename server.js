const dotenv = require('dotenv')
const mongoose = require('mongoose')

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
    useUnifiedTopology: true,
  })
  .then(() => console.log('Connection to DB successful!'))

app.listen(port, () => {
  console.log(`listening on ${port}...`)
})
