const fs = require('fs')
const dotenv = require('dotenv')
const mongoose = require('mongoose')
const Tour = require('../../models/tourModel')

dotenv.config({ path: `./.env` })

const DBString = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
)

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/tours-simple.json`, 'utf-8')
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

async function importDevData() {
  try {
    await Tour.create(tours)
    // eslint-disable-next-line no-console
    console.log('Data successfully loaded!')
    process.exit()
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(err)
  }
  process.exit()
}

async function deleteAllTourData() {
  try {
    await Tour.deleteMany()
    // eslint-disable-next-line no-console
    console.log('Data successfully deleted!')
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(err)
  }
  process.exit()
}

if (process.argv[2] === '--import') {
  importDevData()
} else if (process.argv[2] === '--delete') {
  deleteAllTourData()
}
