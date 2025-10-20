// For creating docs whether nested or direct
const setIdToBody = (parentFieldName) => (req, res, next) => {
  req.body.user = req.user._id;
  const { parentId } = req.params;
  if (parentId) req.body[parentFieldName] = parentId;
  next();
};

//In getAll feature

// For getting data whether nested or all data
const filterObject = (parentFieldName) => (req, res, next) => {
  const { id } = req.params;
  let filterObject = {};
  if (id) filterObject = { [parentFieldName]: id };
  req.filterObj = filterObject;
  next();
};

// For getting all orders whether only logged user or other users
const filterOrder = (req, res, next) => {
  console.log("debug: done")
  if (req.user.role == "user") req.filterObj = { user: req.user._id };
  next()
};

export { setIdToBody, filterObject, filterOrder };
