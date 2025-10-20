import multer from "multer";
import ApiError from "../../utils/apiError.js";
import expressAsyncHandler from "express-async-handler";
import { v4 as uuidv4 } from "uuid";
import sharp from "sharp";
import path from "path";
import fs from "fs";
import pluralize from "pluralize";

const createFolderPath = (folderName) => {
  const uploadPath = path.join("uploads", folderName);
  if (!fs.existsSync(uploadPath)) fs.mkdirSync(uploadPath, { recursive: true }); // as if upload not exist, it will create it instead of throwing error
};

// parse img
const upload = () => {
  const storage = multer.memoryStorage(); // storage
  function filter(req, file, cb) {
    if (file.mimetype.startsWith("image")) cb(null, true);
    else cb(new ApiError("Only images allowed", 400), false);
  }

  return multer({ storage: storage, fileFilter: filter });
};

// Single
const uploadSingleImg = upload().single("image");
const uploadProfileImg = upload().single("profileImg");
const storeProcessImg = expressAsyncHandler(async (req, res, next) => {
  const folderName = pluralize(req.folderName);
  const fileName = `${req.folderName}-${uuidv4()}-${Date.now()}.jpg`;
  createFolderPath(folderName);
  if (req.file) {
    await sharp(req.file.buffer)
      .resize(600, 600)
      .toFormat("jpeg")
      .toFile(`uploads/${folderName}/${fileName}`);

    if (!req.body.email) req.body.image = fileName; // save image name to your db
    if (req.body.email) req.body.profileImg = fileName;
  }
  next();
});

// Mix
const uploadMixImg = upload().fields([
  {
    name: "imageCover",
    maxCount: 1,
  },
  {
    name: "images",
    maxCount: 5,
  },
]);

const storeProcessMixImg = expressAsyncHandler(async (req, res, next) => {
  const folderName = pluralize(req.folderName);
  createFolderPath(folderName);

  if (req.files.imageCover) {
    const fileName = `${req.folderName}-${uuidv4()}-${Date.now()}-cover.jpeg`;

    await sharp(req.files.imageCover[0].buffer)
      .resize(2000, 1333)
      .toFormat("jpeg")
      .jpeg({ quality: 95 })
      .toFile(`uploads/${folderName}/${fileName}`);

    req.body.imageCover = fileName;
  }

  if (req.files.images) {
    req.body.images = [];
    await Promise.all(
      req.files.images.map(async (image, index) => {
        const fileName = `${req.folderName}-${uuidv4()}-${Date.now()}-${index + 1}.jpeg`;

        await sharp(image.buffer)
          .resize(2000, 1333)
          .toFormat("jpeg")
          .jpeg({ quality: 95 })
          .toFile(`uploads/${folderName}/${fileName}`);

        req.body.images.push(fileName);
      })
    );
  }

  next();
});

export {
  uploadSingleImg,
  uploadProfileImg,
  uploadMixImg,
  storeProcessImg,
  storeProcessMixImg,
};
