const {
  programmes: PROGRAMMES,
  programmeoutcomes: OUTCOMES,
  programmesimages: IMAGES,
} = require("../models");
const {
  BAD_REQUEST,
  NOT_FOUND,
  UNAUTHORIZED,
} = require("../middleware/customErrors");
const { Op, Sequelize } = require("sequelize");
const { StatusCodes } = require("http-status-codes");
const cloudinary = require("cloudinary").v2;
const createProgrammes = async (req, res) => {
  const {
    title,
    description,
    about,
    time,
    year,
    start_date,
    end_date,
    heading,
  } = req.body;
  if (
    !title ||
    !description ||
    !time ||
    !year ||
    !start_date ||
    !end_date ||
    !heading
  ) {
    throw new BAD_REQUEST("some input fields are missing");
  }
  await PROGRAMMES.create({ ...req.body });
  res.status(StatusCodes.OK).json({ msg: "Programme created succesfully" });
};

const deleteProgramme = async (req, res) => {
  const { programme_id } = req.params;
  const programme = await PROGRAMMES.findOne({ where: { programme_id } });
  if (!programme) {
    throw new NOT_FOUND(`There is no programme with an id of ${programme_id}`);
  }
  await programme.destroy();
  res.status(StatusCodes.OK).json({
    msg: `Product details with the id:${programme_id} removed permanently`,
  });
};
const uploadPrgrammeImages = async (req, res) => {
  const { programme_id } = req.params;
  const programmeImages = Object.values(req.files || {});

  console.log("Total number of uploaded files:", programmeImages.length);
  console.log("Files array:", programmeImages); // Logging the entire array structure

  if (programmeImages.length === 0) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      error: "No files were uploaded. Please upload at least one image.",
    });
  }
  const maxImages = 3; // Adjust this based on your schema
  if (programmeImages.length > maxImages) {
    throw new UNAUTHORIZED(
      `you can only upload maximum of 3 files per programme`
    );
  }

  try {
    // Fetch existing image record for the programme
    const image = await IMAGES.findOne({ where: { programme_id } });
    // console.log(image);
    if (!image) {
      throw new UNAUTHORIZED(
        `The programme with id ${programme_id} has not been created. Please create the programme first!!!`
      );
    }

    // Adding a log before mapping to ensure the array hasn't been altered
    console.log("Mapping through programme images...");

    // Validate and upload images
    const uploadedImages = await Promise.all(
      programmeImages.map(async (programmeImage, i) => {
        // Logging the current programmeImage at the beginning of each iteration
        console.log(`File ${i + 1}/${programmeImages.length}:`, programmeImage);

        if (!programmeImage) {
          console.warn(`File at index ${i} is undefined or null, skipping...`);
          return null;
        }

        // Check if mimetype is defined before calling startsWith
        if (
          !programmeImage.mimetype ||
          !programmeImage.mimetype.startsWith("image")
        ) {
          console.warn(`File ${i + 1} is not a valid image, skipping...`);
          return null;
        }

        // Validate file size
        const maxSize = 4000 * 6000; // 12MB
        if (programmeImage.size > maxSize) {
          console.warn(`File ${i + 1} exceeds size limit, skipping...`);
          return null;
        }

        // Delete existing image on Cloudinary if it exists
        const currentPublicId = image[`image${i}_public_id`];
        console.log(currentPublicId, "here");
        if (currentPublicId) {
          await cloudinary.uploader.destroy(currentPublicId);
        }

        // Upload new image to Cloudinary
        const result = await cloudinary.uploader.upload(
          programmeImage.tempFilePath,
          {
            use_filename: true,
            folder: "AIM programmes Images",
          }
        );

        // Update image record in the database
        image[`image${i}`] = result.secure_url;
        image[`image${i}_public_id`] = result.public_id;
        await image.save();

        // Return details of the uploaded image
        return {
          id: result.public_id,
          src: result.secure_url,
        };
      })
    );
    console.log(uploadedImages);
    // Filter out any null results (skipped files)
    const validUploadedImages = uploadedImages.filter(Boolean);

    // Send response with uploaded images
    res.status(StatusCodes.OK).json({
      images: validUploadedImages,
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: error.message,
    });
  } finally {
    // Clean up all temporary files
    programmeImages.forEach((programmeImage) => {
      if (
        programmeImage &&
        programmeImage.tempFilePath &&
        fs.existsSync(programmeImage.tempFilePath)
      ) {
        fs.unlinkSync(programmeImage.tempFilePath);
      }
    });
  }
};

const updateProgrammeOutcome = async (req, res) => {
  const { programme_id } = req.params;
  const outcome = await OUTCOMES.findOne({ where: { programme_id } });
  if (!outcome) throw new BAD_REQUEST("This programme does not exist");
  await outcome.update(req.body);
  res.status(StatusCodes.OK).json({
    msg: "pogramme outcome updated successfully",
  });
};
const getAllProgrammes = async (req, res) => {
  const queryObject = {};
  const totalProgrammes = await PROGRAMMES.count();
  const fieldsToCheck = {
    title: (value) => ({
      [Sequelize.Op.like]: Sequelize.fn("LOWER", `%${value.toLowerCase()}%`),
    }),
  };
  Object.keys(req.query).forEach((key) => {
    if (fieldsToCheck[key]) {
      queryObject[key] = fieldsToCheck[key](req.query[key]);
    }
  });
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 5;
  const offset = (page - 1) * limit;
  const numOfPages = Math.ceil(totalProgrammes / limit);
  const programmes = await PROGRAMMES.findAll({
    where: { ...queryObject },
    limit,
    offset,
    include: [
      {
        model: IMAGES,
        required: false,
      },
      {
        model: OUTCOMES,
        required: false,
      },
    ],
  });
  res
    .status(StatusCodes.OK)
    .json({
      programmes,
      numOfPages,
      totalProgrammes,
      currentCount: programmes.length,
    });
};
const getSingleProgramme = async (req, res) => {
  const { programme_id } = req.params;
  const programme = await PROGRAMMES.findOne({
    where: { programme_id },
    include: [
      {
        model: IMAGES,
        required: false,
      },
      {
        model: OUTCOMES,
        required: false,
      },
    ],
  });
  if (!programme) {
    throw new NOT_FOUND(`There is no programme with an id of ${programme_id}`);
  }
  res.status(StatusCodes.OK).json({ programme });
};
const updateProgramme = async (req, res) => {
  const { programme_id } = req.params;
  const programme = await PROGRAMMES.findOne({ where: { programme_id } });
  if (!programme) {
    throw new NOT_FOUND(`There is no programme with an id of ${programme_id}`);
  }
  await PROGRAMMES.update(req.body, {
    where: { programme_id },
  });
  res.status(StatusCodes.OK).json({ msg: "Programme updated successfully" });
};
module.exports = {
  createProgrammes,
  deleteProgramme,
  uploadPrgrammeImages,
  updateProgrammeOutcome,
  getAllProgrammes,
  getSingleProgramme,
  updateProgramme,
};
