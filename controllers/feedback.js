const {
  feedbackcomplaints: FEEDBACK,
  programmes: PROGRAMMES,
  users: USERS,
} = require("../models");
const { BAD_REQUEST, NOT_FOUND } = require("../middleware/customErrors");
const { StatusCodes } = require("http-status-codes");
const { Op, Sequelize } = require("sequelize");
const { checkPermissions } = require("../middleware/authentication");
const createFeedback = async (req, res) => {
  //   console.log(req.body);
  const { subject, notes } = req.body;
  if (!subject || !notes) {
    throw new BAD_REQUEST("some field inputs are missing");
  }
  req.body.user_id = req.user.user_id;
  await FEEDBACK.create({ ...req.body });
  res.status(StatusCodes.OK).json({ msg: "Feedback created successfully" });
};

const getAllFeedBack = async (req, res) => {
  const queryObject = {};
  const totalFeedback = await FEEDBACK.count();
  const { sort } = req.query;
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 5;
  const offset = (page - 1) * limit;
  const numOfPages = Math.ceil(totalFeedback / limit);
  let sortList;
  switch (sort) {
    case "latest":
      sortList = [["createdAt", "DESC"]];
      break;
    default:
      sortList = [["createdAt", "ASC"]];
      break;
  }
  const feedback = await FEEDBACK.findAll({
    where: { ...queryObject },
    include: [
      {
        model: USERS,
        attributes: ["first_name", "last_name", "email"],
        as: "user",
      },
    ],
    order: sortList,
    limit,
    offset,
  });

  res.status(StatusCodes.OK).json({
    feedback,
    totalFeedback,
    count: feedback.length,
    numOfPages,
  });
};
const updateFeedback = async (req, res) => {
  const { feedback_id } = req.params;
  const feedback = await FEEDBACK.findOne({
    where: { feedback_id },
  });
  if (!feedback) {
    throw new NOT_FOUND(`There is no feedback with an id of ${feedback_id}`);
  }
  const user = await USERS.findOne({
    where: { user_id: feedback.user_id },
  });
  checkPermissions({ reqUser: req.user, resUser: user.user_id });
  await FEEDBACK.update(req.body, {
    where: { feedback_id },
  });
  res.status(StatusCodes.OK).json({ msg: "Feedback updated successfully" });
};
const removeFeedback = async (req, res) => {
  const { feedback_id } = req.params;
  const feedback = await FEEDBACK.findOne({ where: { feedback_id } });
  if (!feedback) {
    throw new NOT_FOUND(`There is no feedback with the id ${feedback_id}`);
  }

  const user = await USERS.findOne({
    where: { user_id: feedback.user_id },
  });
  checkPermissions({ reqUser: req.user, resUser: user.user_id });
  await feedback.destroy(); //remove is deprecated
  res.status(StatusCodes.OK).json({
    msg: `feedback with the id of ${feedback_id} has been deleted successfully`,
  });
};
const getUserFeedback = async (req, res) => {
  const queryObject = { user_id: req.user.user_id };
//   const totalFeedback = await FEEDBACK.count();
  const { sort } = req.query;
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 5;
  const offset = (page - 1) * limit;
  let sortList;
  switch (sort) {
    case "latest":
      sortList = [["createdAt", "DESC"]];
      break;
    default:
      sortList = [["createdAt", "ASC"]];
      break;
  }
  try {
    const feedback = await FEEDBACK.findAll({
      where: { ...queryObject },
      order: sortList,
      limit,
      offset,
    });
    res.status(StatusCodes.OK).json({ feedback });
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: error.message });
  }
};
module.exports = {
  createFeedback,
  getAllFeedBack,
  removeFeedback,
  updateFeedback,
  getUserFeedback,
};
