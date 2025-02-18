const { events: Events } = require("../models");
const { BAD_REQUEST, NOT_FOUND } = require("../middleware/customErrors");
const { StatusCodes } = require("http-status-codes");
const cloudinary = require("cloudinary").v2;

const createEvent = async (req, res) => {
  const { title, description, event_url } = req.body;
  if (!title || !description || !event_url) {
    throw new BAD_REQUEST("some field inputs are missing");
  }
  await Events.create({ ...req.body });
  res.status(StatusCodes.OK).json({ msg: "event created successfully" });
};
const getAllEvents = async (req, res) => {
  const totalEvents = await Events.count();
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 5;
  const offset = (page - 1) * limit;
  const numOfPages = Math.ceil(totalEvents / limit);
  const events = await Events.findAll({ limit, offset });
  res
    .status(StatusCodes.OK)
    .json({
      events,
      currentCount: events.length,
      numOfPages,
      totalEvents,
    });
};

const uploadEventImg = async (req, res) => {
  const event_img = req.files.image;
  //   console.log(event_img);
  const { event_id } = req.params;
  //   console.log(event_img);
  if (!event_img.mimetype.startsWith("image")) {
    throw new BAD_REQUEST("please upload an image");
  }
  const maxSize = 2000 * 3000;
  if (event_img.size > maxSize) {
    throw new BAD_REQUEST("uploaded files should not be more than 18mb");
  }
  const event = await Events.findOne({
    where: { event_id },
  });
  if (!event)
    throw new NOT_FOUND(
      `Events with id ${event_id} does not exist, create event first !!! `
    );
  const currentPublicId = event.image_public_id;
  if (currentPublicId) {
    await cloudinary.uploader.destroy(currentPublicId);
  }
  const result = await cloudinary.uploader.upload(
    req.files.image.tempFilePath,
    {
      use_filename: true,
      folder: "AIM Event's Images",
    }
  );
  // console.log(result);
  event.image_url = result.secure_url;
  event.image_public_id = result.public_id;
  await event.save();
  res.status(StatusCodes.OK).json({
    image_url: {
      src: result.secure_url,
    },
  });
  fs.unlinkSync(req.files.image.tempFilePath);
};
const updateEvent = async (req, res) => {
  const { event_id } = req.params;
  const event = await Events.findOne({ where: { event_id } });
  if (!event) {
    throw new NOT_FOUND(`There is no event with an id of ${event_id}`);
  }
  await Events.update(req.body, {
    where: { event_id },
  });
  res.status(StatusCodes.OK).json({ msg: "Events updated successfully" });
};
const removeEvent = async (req, res) => {
  const { event_id } = req.params;
  const event = await Events.findOne({ event_id });
  if (!event) {
    throw new NOT_FOUND(`There is no event with the is ${event_id}`);
  }
  await event.destroy(); //remove is deprecated
  res.status(StatusCodes.OK).json({
    msg: `event with the id of ${event_id} has been deleted successfully`,
  });
};

module.exports = {
  getAllEvents,
  createEvent,
  uploadEventImg,
  updateEvent,
  removeEvent,
};
