import expressAsyncHandler from "express-async-handler";
import setSlug from "../utils/slugify.js";
import ApiError from "../utils/apiError.js";
import ApiFeatures from "../utils/apiFeatures.js";

const getAll = (model) =>
  expressAsyncHandler(async (req, res) => {
    // Build query
    const apiFeaturesCount = new ApiFeatures(
      req.query,
      model.find(req.filterObj)
    )
      .filter()
      .search(model);
    const filter = apiFeaturesCount.mongoQuery.getFilter();
    const countDoc = await model.countDocuments(filter);

    const apiFeatures = new ApiFeatures(req.query, model.find(req.filterObj))
      .filter()
      .search(model)
      .sort()
      .selectFields()
      .paginate(countDoc);

    const { mongoQuery, pagination } = apiFeatures;
    const documents = await apiFeatures.mongoQuery;
    res.status(200).json({
      pagination,
      totalResults: countDoc,
      pageResults: documents.length,
      data: documents,
    });
  });

const createOne = (model) =>
  expressAsyncHandler(async (req, res) => {
    setSlug(req.body);
    const document = await model.create(req.body);
    res.status(201).json({ data: document });
  });

const getOne = (model) =>
  expressAsyncHandler(async (req, res, next) => {
    const { id } = req.params;
    let filterObject = { _id: id };
    if (req.filterObj) filterObject = { _id: id, user: req.filterObj.user }; // more specific

    const document = await model.findOne(filterObject);
    if (!document) {
      return next(
        new ApiError(
          `No document for this id: ${id}, document: ${document}`,
          404
        )
      );
    }
    res.status(200).json({ data: document });
  });

const updateOne = (model) =>
  expressAsyncHandler(async (req, res, next) => {
    const { id } = req.params;
    setSlug(req.body);

    if (model.modelName == "user") {
      const { password, ...bodyWithoutPass } = req.body;
      req.body = bodyWithoutPass;
    }

    const newDoc = await model.findByIdAndUpdate(id, req.body, { new: true });
    if (!newDoc) {
      return next(
        new ApiError(`No document for this id: ${id}, document: ${newDoc}`, 404)
      );
    }
    newDoc.save(); // to trigger on calculating ratings
    res.status(200).json({ data: newDoc });
  });

const deleteOne = (model) =>
  expressAsyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const document = await model.findByIdAndDelete(id);

    if (!document) {
      return next(
        new ApiError(
          `No document for this id: ${id}, document: ${document}`,
          404
        )
      ); //specific class handler for null document
    }
    res.status(204).send();
  });

export { getAll, createOne, getOne, updateOne, deleteOne };
