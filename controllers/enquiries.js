const { enquiries: Enquiries } = require("../models");
const { BAD_REQUEST, NOT_FOUND } = require("../middleware/customErrors");
const { StatusCodes } = require("http-status-codes");
const { Op, Sequelize } = require("sequelize");
const createEnquiry = async (req, res) => {
  const { name, email, message } = req.body;
  if (!name || !email || !message) {
    throw new BAD_REQUEST("some field inputs are missing");
  }
  await Enquiries.create({ ...req.body });
  res.status(StatusCodes.OK).json({ msg: "Enquiry created successfully" });
};
const getAllEnquiries = async (req, res) => {
  const queryObject = {};
  const totalEnq = await Enquiries.count();
  const { sort } = req.query;

  const fieldsToCheck = {
    name: (value) => ({
      [Sequelize.Op.like]: Sequelize.fn("LOWER", `%${value.toLowerCase()}%`),
    }),
    email: (value) => ({
      [Sequelize.Op.like]: Sequelize.fn("LOWER", `%${value.toLowerCase()}%`),
    }),
  };

  Object.keys(req.query).forEach((key) => {
    if (fieldsToCheck[key]) {
      queryObject[key] = fieldsToCheck[key](req.query[key]);
    }
  });

  const page = Number(req.query.pages) || 1;
  const limit = Number(req.query.limit) || 5;
  const offset = (page - 1) * limit;
  const numOfPages = Math.ceil(totalEnq / limit);
  let sortList;
  switch (sort) {
    case "A-Z":
      sortList = [["name", "DESC"]];
      break;
    case "Z-A":
      sortList = [["name", "ASC"]];
      break;
    default:
      sortList = [["createdAt", "ASC"]];
      break;
  }
  const enquiries = await Enquiries.findAll({
    where: { ...queryObject },
    // attributes: fields ? fields.split(",") : undefined,
    order: sortList,
    limit,
    offset,
  });

  res.status(StatusCodes.OK).json({
    enquiries,
    totalEnq,
    count: enquiries.length,
    numOfPages,
  });
};
const removeEnquiry = async (req, res) => {
  const { enq_id } = req.params;
  const enquiry = await Enquiries.findOne({ enq_id });
  if (!enquiry) {
    throw new NOT_FOUND(`There is no enquiry with the id ${enq_id}`);
  }
  await enquiry.destroy(); //remove is deprecated
  res.status(StatusCodes.OK).json({
    msg: `enquiry with the id of ${enq_id} has been deleted successfully`,
  });
};
module.exports = { createEnquiry, getAllEnquiries, removeEnquiry };
