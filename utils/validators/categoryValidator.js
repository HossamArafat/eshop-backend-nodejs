import { check } from "express-validator";
import validatorMiddleware from "../../middlewares/express-middleware/validatorMiddleware.js";
import categoryModel from "../../models/categoryModel.js";

// validation layer (middleware) , checking and customizing
const categoryIdValidator = [
  check("id").isMongoId().withMessage("Invalid category id format."), //rules
  validatorMiddleware,                                   // error middleawre catch this error of rules
];

const categoryBodyValidator = [
  check("name")
    .trim()
    .notEmpty()
    .withMessage("Category name is required.")
    .custom(async (value, { req }) => {
      const filter = { name: value };
      if (req.method == "PUT") filter._id = { $ne: req.params.id };
      const doc = await categoryModel.findOne(filter);
      if (doc) {
        return Promise.reject({message: "Category name must be unique.", statusCode: 409});
      }
    })
    .bail()
    .isLength({ min: 3 })
    .withMessage("Too short category name.")
    .isLength({ max: 32 })
    .withMessage("Too long category name."),
    check("image").custom((value, { req }) => {
    if (!req.file) return Promise.reject("Category image is required");
    return true;
  }),
    
  validatorMiddleware,
];

export {
   categoryIdValidator,
   categoryBodyValidator
}
