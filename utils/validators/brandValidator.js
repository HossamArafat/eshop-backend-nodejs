import { check } from "express-validator";
import validatorMiddleware from "../../middlewares/express-middleware/validatorMiddleware.js";
import brandModel from "../../models/brandModel.js";

const brandIdValidator = [
  check("id").isMongoId().withMessage("Invalid brand id format."),
  validatorMiddleware,
];

const brandBodyValidator = [
  check("name")
    .trim()
    .notEmpty()
    .withMessage("Brand name required.")
    .custom(async (value, { req }) => {
      const filter = { name: value };
      if (req.method == "PUT") filter._id = { $ne: req.params.id };

      const doc = await brandModel.findOne(filter);
      if (doc) {
        return Promise.reject({message: "Brand name must be unique.", statusCode: 409});
      }
    })
    .bail()
    .isLength({ min: 3 })
    .withMessage("Too short brand name.")
    .isLength({ max: 32 })
    .withMessage("Too long brand name."),
  check("image").custom((value, { req }) => {
    if (!req.file) return Promise.reject("Brand logo is required");
    return true;
  }),

  validatorMiddleware,
];

export { brandIdValidator, brandBodyValidator };
