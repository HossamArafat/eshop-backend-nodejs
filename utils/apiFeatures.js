import QueryString from "qs";

class ApiFeatures {
  constructor(queryString, mongoQuery) {
    this.queryString = queryString;
    this.mongoQuery = mongoQuery;
  }
  filter() {
    // Excluding some query strings for using in other ways
    let queryObj = { ...this.queryString };
    const excludesFields = ["page", "limit", "sort", "fields", "keyword"];
    excludesFields.forEach((field) => delete queryObj[field]);
    const queryParse = QueryString.parse(queryObj); // parse to query string

    // Filter using comparison [eq, gt, gete, lt, lte]
    let queryStr = JSON.stringify(queryParse);
    queryStr = queryStr.replace(
      /\b(eq|gt|gte|lt|lte)\b/g,
      (match) => `$${match}`
    );
    queryObj = JSON.parse(queryStr);
    this.mongoQuery = this.mongoQuery.find(queryObj);

    return this;
  }

  sort() {
    if (this.queryString.sort) {
      const sorting = this.queryString.sort.split(",").join(" ");
      this.mongoQuery = this.mongoQuery.sort(sorting);
    } else this.mongoQuery = this.mongoQuery.sort("-createdAt");

    return this;
  }

  selectFields() {
    if (this.queryString.fields) {
      const selecting = this.queryString.fields.split(",").join(" ");
      this.mongoQuery = this.mongoQuery.select(selecting);
    } else this.mongoQuery = this.mongoQuery.select("-__v");

    return this;
  }

  search(model) {
    if (this.queryString.keyword) {
      const obj = { $regex: this.queryString.keyword, $options: "i" };
      let searching = {};
      if (model.modelName == "product") {
        searching = {
          $or: [{ title: obj }, { description: obj }],
        };
      } else searching = { name: obj };
      this.mongoQuery = this.mongoQuery.find(searching);
    }

    return this;
  }

  paginate(countDoc) {
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 5;
    const skip = (page - 1) * limit;
    const endIndex = limit * page; // endDocIndexInCurrPage

    // Pagination results
    const result = {};
    result.numOfPages = Math.ceil(countDoc / limit);

    if (result.numOfPages) {
      result.limit = limit;
      result.currentPage = page;
    }
    if (endIndex < countDoc) result.next = page + 1;
    if (page > 1) result.prev = page - 1;

    this.pagination = result;
    this.mongoQuery = this.mongoQuery.skip(skip).limit(limit);

    return this;
  }
}

export default ApiFeatures;
