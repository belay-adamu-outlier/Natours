class ApiFeatures {
  constructor(query, queryString) {
    this.query = query
    this.queryString = queryString
  }

  filter() {
    let queryObj = { ...this.queryString }
    const excludedFields = ['page', 'sort', 'limit', 'fields']

    excludedFields.forEach((el) => delete queryObj[el])

    // Advanced query

    // queryStrings with greater than or less than etc... operators are written as
    // price[gte]=1000, price[lte]=2000 (/?price[gte]=1000&price[lte]=2000)
    // when accessed from query object they come in the form => price: { gte: 1000, lte: 2000 }
    // we need to convert the keys to $gte and $lte etc... for mongo to reconize them as operators

    let queryStr = JSON.stringify(queryObj)
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`)

    queryObj = JSON.parse(queryStr)
    this.query = this.query.find(queryObj)

    return this
  }

  sort() {
    // mongoose uses field names(strings) for sorting
    // you can use multiple field names separated by a space to sort a query.
    // if there are ties in the sort order, mongoose will use the additional field names to further sort the query.
    // minus sign before the field name indicates descending order
    if (!this.queryString.sort) {
      this.query = this.query.sort('-createdAt')
      return this
    }

    const sortBy = this.queryString.sort.split(',').join(' ')
    this.query = this.query.sort(sortBy)

    return this
  }

  // if the fields parameter is specified, mongoose will only return the fields specified in the fields parameter.

  limitFields() {
    if (!this.queryString.fields) {
      // the minus sign tells mongoose to exclude the fields from the query
      this.query = this.query.select('-__v')
      return this
    }

    const fields = this.queryString.fields.split(',').join(' ')
    this.query = this.query.select(fields)

    return this
  }

  paginate() {
    const page = this.queryString.page * 1 || 1
    const limit = this.queryString.limit * 1 || 100
    const skip = (page - 1) * limit

    this.query = this.query.skip(skip).limit(limit)

    return this
  }
}

module.exports.ApiFeatures = ApiFeatures
