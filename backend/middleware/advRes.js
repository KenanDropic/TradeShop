export const advRes = (model, populate) => async (req, res, next) => {
  let query;

  const reqQuery = { ...req.query };

  if (req.query.search) {
    //$options: 'i' znači da će pretraživanje biti case insensitive
    reqQuery.name = { $regex: req.query.search, $options: "i" };
  }

  // Niz koji sadrži polja koja treba zanemariti prilikom query-a
  const removeFields = ["select", "sort", "limit"];

  removeFields.forEach((param) => delete reqQuery[param]);

  // Create query string
  let queryString = JSON.stringify(reqQuery);
  // Create operators ($gt,$gte,...)
  queryString = queryString.replace(
    /\b(gt|gte|lt|lte|in)\b/g,
    (match) => `$${match}`
  );

  // Finding resource
  query = model.find(JSON.parse(queryString));

  // Select Fields
  if (req.query.select) {
    const fields = req.query.select.split(",").join(" ");
    query = query.select(fields);
  }

  // Sort conditions
  if (req.query.sort) {
    const sortBy = req.query.sort.split(",").join(" ");
    switch (sortBy) {
      case "latest":
        query = query.sort("-createdAt");
        break;
      case "oldest":
        query = query.sort("createdAt");
        break;
      case "a-z":
        query = query.sort("position");
        break;
      case "z-a":
        query = query.sort("-position");
        break;

      default:
        query.sort("-createdAt");
        break;
    }
  }

  // Pagination
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 6;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const total = await model.countDocuments(query); //prebrojava sve dokumente
  const numOfPages = Math.ceil(total / limit);
  query.skip(startIndex).limit(limit);

  // Populate,if something is sent in populate
  if (populate) {
    query = query.populate(populate);
  }

  // Executing query
  const results = await query;

  //Pagination result
  const pagination = {};

  if (endIndex < total) {
    pagination.next = {
      page: page + 1, //next page
      limit: limit, //limit
    };
  }

  if (startIndex > 0) {
    pagination.prev = {
      page: page - 1, //next page
      limit: limit, //limit
    };
  }

  res.advRes = {
    success: true,
    count: total,
    pages: numOfPages,
    page,
    pagination,
    data: results,
  };

  next();
};
