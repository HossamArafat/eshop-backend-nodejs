// query middleware
const setPopulate = (schema, path, select) => schema.pre(/^find/, function(next) { 
  this.populate({ path: path, select: select ?? "name" });
  next()
});

export default setPopulate