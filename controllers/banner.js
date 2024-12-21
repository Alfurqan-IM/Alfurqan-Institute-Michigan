const { banner: Banner } = require("../models");
const { BAD_REQUEST, NOT_FOUND } = require("../middleware/customErrors");
const { StatusCodes } = require("http-status-codes");
const cloudinary = require("cloudinary").v2;

const createBanner = async (req, res) => {
  const { title, description } = req.body;
  if (!title || !description) {
    throw new BAD_REQUEST("some field inputs are missing");
  }
  await Banner.create({ ...req.body });
  res.status(StatusCodes.OK).json({ msg: "banner created successfully" });
};
const getAllBanners = async (req, res) => {
  const banner = await Banner.findAll({});
  res.status(StatusCodes.OK).json({ banner, count: banner.length });
};

const uploadBannerImg = async (req, res) => {
  const banner_img = req.files.image;
//   console.log(banner_img);
  const { banner_id } = req.params;
  //   console.log(banner_img);
  if (!banner_img.mimetype.startsWith("image")) {
    throw new BAD_REQUEST("please upload an image");
  }
  const maxSize = 2000 * 3000;
  if (banner_img.size > maxSize) {
    throw new BAD_REQUEST("uploaded files should not be more than 18mb");
  }
  const banner = await Banner.findOne({
    where: { banner_id },
  });
  if (!banner)
    throw new NOT_FOUND(
      `Banner with id ${banner_id} does not exist, create banner first !!! `
    );
  const currentPublicId = banner.image_public_id;
  if (currentPublicId) {
    await cloudinary.uploader.destroy(currentPublicId);
  }
  const result = await cloudinary.uploader.upload(
    req.files.image.tempFilePath,
    {
      use_filename: true,
      folder: "AIM banner's Images",
    }
  );
  // console.log(result);
  banner.image = result.secure_url;
  banner.image_public_id = result.public_id;
  await banner.save();
  res.status(StatusCodes.OK).json({
    image: {
      src: result.secure_url,
    },
  });
  fs.unlinkSync(req.files.image.tempFilePath);
};
const updateBanner = async (req, res) => {
  const { banner_id } = req.params;
  const banner = await Banner.findOne({ where: { banner_id } });
  if (!banner) {
    throw new NOT_FOUND(`There is no banner with an id of ${banner_id}`);
  }
  await Banner.update(req.body, {
    where: { banner_id },
  });
  res.status(StatusCodes.OK).json({ msg: "Banner updated successfully" });
};
const removeBanner = async (req, res) => {
  const { banner_id } = req.params;
  const banner = await Banner.findOne({ banner_id });
  if (!banner) {
    throw new NOT_FOUND(`There is no banner with the is ${banner_id}`);
  }
  await banner.destroy(); //remove is deprecated
  res.status(StatusCodes.OK).json({
    msg: `banner with the id of ${banner_id} has been deleted successfully`,
  });
};

module.exports = {
  getAllBanners,
  createBanner,
  uploadBannerImg,
  updateBanner,
  removeBanner,
};
