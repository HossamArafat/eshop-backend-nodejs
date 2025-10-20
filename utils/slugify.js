import slugify from "slugify";

const setSlug = (body) => {
  if (body.title) body.slug = slugify(body.title);
  if (body.name) body.slug = slugify(body.name);
};

export default setSlug
