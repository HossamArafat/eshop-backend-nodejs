import { check } from "express-validator";
import validatorMiddleware from "../../middlewares/express-middleware/validatorMiddleware.js";
import categoryModel from "../../models/categoryModel.js";
import subCategoryModel from "../../models/subCategoryModel.js";

const productIdValidator = [
  check("id").isMongoId().withMessage("Invalid product id format."),
  validatorMiddleware,
];

const productBodyValidator = [
  check("title")
    .trim()
    .notEmpty()
    .withMessage("Product title is required.")
    .bail()
    .isLength({ min: 3 })
    .withMessage("Too short Product title.")
    .isLength({ max: 100 })
    .withMessage("Too long Product title."),
  check("description")
    .trim()
    .notEmpty()
    .withMessage("Product description is required.")
    .bail()
    .isLength({ min: 20 })
    .withMessage("Too short Product description.")
    .isLength({ max: 2000 })
    .withMessage("Too long Product description."),
  check("quantity")
    .optional()
    .isNumeric()
    .withMessage("Product quantity must be a number.")
    .isFloat({ min: 1 })
    .withMessage("Invalid quantity"),
  check("sold")
    .optional()
    .isNumeric()
    .withMessage("Sold quantity must be a number.")
    .isFloat({ min: 0 })
    .withMessage("Sold quantity cannot be negative."),
  check("price")
    .notEmpty()
    .withMessage("Product price is required.")
    .bail()
    .isNumeric() //Accept numbers whether 123 or '123', but '1b2' is not number but string.
    .withMessage("Product price must be a number.")
    .bail()
    .isFloat({ min: 0 })
    .withMessage("Price cannot be negative.")
    .isFloat({ max: 1000000 })
    .withMessage("Too long Product price."),
  check("priceAfterDiscount")
    .optional()
    .isNumeric()
    .withMessage("Price after discount must be a number.")
    .bail()
    .isFloat({ min: 0 })
    .withMessage("priceAfterDiscount cannot be negative.")
    .toFloat()
    .custom((value, { req }) => value < req.body.price)
    .withMessage("Price after discount must be lower than price."),
  check("colors")
    .optional()
    .isArray()
    .withMessage("Product colors must be array of string."),
  check("images")
    .optional()
    .isArray()
    .withMessage("Product images must be an array.")
    .bail()
    .custom((arr) => arr.every((el) => typeof el === "string"))
    .withMessage("Each image must be a string."),
  check("imageCover").custom((value, { req }) => {
    if (!req.files.imageCover) return Promise.reject("Image cover is required");
    return true;
  }),
  check("ratingsAverage")
    .optional()
    .isNumeric()
    .withMessage("Rating average must be a number.")
    .bail()
    .isFloat({ min: 1, max: 5 })
    .withMessage("Rating average must be between 1.0 and 5.0"),
  check("ratingsQuantity")
    .optional()
    .isNumeric()
    .withMessage("Rating quantity must be a number.")
    .bail()
    .isFloat({ min: 0 })
    .withMessage("Ratings quantity cannot be negative."),
  check("category")
    .notEmpty()
    .withMessage("Category must belong to category.")
    .bail()
    .isMongoId()
    .withMessage("Invalid category id format.")
    .bail()
    .custom((value) => {
      categoryModel.findById(value).then((category) => {
        if (!category)
          return Promise.reject({
            message: `No category for this id: ${value}`,
            statusCode: 404,
          });
      });
      return true;
    }),
  check("subCategories")
    .optional()
    .isArray()
    .withMessage("Sub category must be an array.")
    .bail()
    .isMongoId()
    .withMessage("Invalid sub category id format.")
    .bail()
    .custom((values) =>
      subCategoryModel.find({ _id: { $in: values } }).then((val) => {
        if (val.length != values.length)
          return Promise.reject({
            message: "No subCategory for one or more of these ids.",
            statusCode: 404,
          });
      })
    )
    .bail()
    .custom((values, { req }) =>
      subCategoryModel.find({ category: req.body.category }).then((val) => {
        const validIds = val.map((v) => String(v._id));
        const condtion = values.every((va) => validIds.includes(va));
        if (!condtion)
          return Promise.reject({
            message: "One or more of these SubCategories not belong.",
            statusCode: 404,
          });
      })
    ),
  ,
  check("brand").optional().isMongoId().withMessage("Invalid brand id format."),

  validatorMiddleware,
];

export { productIdValidator, productBodyValidator };
