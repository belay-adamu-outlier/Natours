const mongoose = require('mongoose')
const slugify = require('slugify')

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A tour should have a name'],
      unique: true,
      trim: true
    },
    slug: String,
    duration: {
      type: Number,
      required: [true, 'A tour must have a duration']
    },
    maxGroupSize: {
      type: Number,
      required: [true, 'A tour must have group size']
    },
    difficulty: {
      type: 'String',
      required: [true, 'A tour must have a difficulty']
    },
    price: {
      type: Number,
      required: [true, 'A tour should have a price']
    },
    ratingsAverage: {
      type: Number,
      default: 4.5
    },
    ratingsQuantity: {
      type: Number,
      default: 0
    },
    priceDiscount: Number,
    summary: {
      type: String,
      trim: true,
      required: [true, 'A tour must have a summary']
    },
    description: {
      type: String,
      trim: true
    },
    imageCover: {
      type: String,
      required: [true, 'A tour must have a cover image']
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false // this will not be returned in the query
    },
    startDates: [Date]
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
)

// this is a virtual field, it is not stored in the database
// can be useful when a field can be drived from other fields

tourSchema.virtual('durationWeeks').get(function () {
  return Math.ceil(this.duration / 7)
})

// Document middleware: runs before .save() and .create()
// tourSchema.pre('save', function (next) {
//   this.slug = slugify(this.name, { lower: true })
//   next()
// })

// tourSchema.post('save', (doc, next) => {
//   //eslint-disable-next-line no-console
//   console.log(doc)
//   next()
// })

const Tour = mongoose.model('Tour', tourSchema)

module.exports = Tour
