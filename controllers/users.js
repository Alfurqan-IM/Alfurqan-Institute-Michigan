const { NOT_FOUND, BAD_REQUEST } = require("../middleware/customErrors");
const { StatusCodes } = require("http-status-codes");
const { users: USERS } = require("../models");
const { Op, Sequelize } = require("sequelize");
const { checkPermissions } = require("../middleware/authentication");
const cloudinary = require("cloudinary").v2;
const getAllUsers = async (req, res) => {
  const queryObject = {};
  //   console.log(queryObject);
  const totalUsers = await USERS.count();
  const { numberFilter, fields, sort } = req.query;
  const fieldsToCheck = {
    last_name: (value) => ({
      [Sequelize.Op.like]: Sequelize.fn("LOWER", `%${value.toLowerCase()}%`),
    }),
    email: (value) => ({
      [Sequelize.Op.like]: Sequelize.fn("LOWER", `%${value.toLowerCase()}%`),
    }),
    phone: (value) => ({
      [Sequelize.Op.like]: Sequelize.fn("LOWER", `%${value.toLowerCase()}%`),
    }),
    // phone: (value) => value,
    gender: (value) => {
      // console.log(value);
      if (value && value !== "---") return value;
      return null; // Return null to skip adding this filter
    },
    isVerified: (value) => {
      if (value === "---") {
        return { [Sequelize.Op.or]: [true, false] }; // This will include all rows regardless of the 'available' status
      }
      if (value !== "---" && value !== undefined) {
        return value === "true";
      }
      return undefined; // Return undefined to skip adding this filter
    },
    blacklisted: (value) => {
      if (value === "---") {
        return { [Sequelize.Op.or]: [true, false] }; // This will include all rows regardless of the 'available' status
      }
      if (value !== "---" && value !== undefined) {
        return value === "true";
      }
      return undefined; // Return undefined to skip adding this filter
    },
    notification: (value) => {
      if (value === "---") {
        return { [Sequelize.Op.or]: [true, false] }; // This will include all rows regardless of the 'available' status
      }
      if (value !== "---" && value !== undefined) {
        return value === "true";
      }
      return undefined; // Return undefined to skip adding this filter
    },
  };

  Object.keys(req.query).forEach((key) => {
    if (fieldsToCheck[key]) {
      const fieldValue = fieldsToCheck[key](req.query[key]);
      if (fieldValue !== null) {
        queryObject[key] = fieldValue;
      }
    }
  });

  const page = Number(req.query.pages) || 1;
  const limit = Number(req.query.limit) || 5;
  const offset = (page - 1) * limit;
  const numOfPages = Math.ceil(totalUsers / limit);
  let sortList;
  switch (sort) {
    case "female":
      sortList = [["gender", "DESC"]];
      break;
    case "male":
      sortList = [["gender", "ASC"]];
      break;
    case "A-Z":
      sortList = [["last_name", "ASC"]];
      break;
    case "Z-A":
      sortList = [["last_name", "DESC"]];
      break;
    case "admin":
      sortList = [["role", "ASC"]];
      break;
    default:
      sortList = [["createdAt", "ASC"]];
      break;
  }
  const users = await USERS.findAll({
    where: { ...queryObject },
    // logging: console.log,
    attributes: fields ? fields.split(",") : { exclude: ["password"] },
    order: sortList,
    limit,
    offset,
  });
  const genderCount = await USERS.findAll({
    attributes: [
      "gender",
      [Sequelize.fn("COUNT", Sequelize.col("user_id")), "count"],
    ],
    group: ["gender"],
  });

  const verificationCount = await USERS.findAll({
    attributes: [
      "isVerified",
      [Sequelize.fn("COUNT", Sequelize.col("user_id")), "count"],
    ],
    group: ["isVerified"],
  });

  res.status(StatusCodes.OK).json({
    users,
    totalUsers,
    count: users.length,
    numOfPages,
    genderCount,
    verificationCount,
  });
};
const getSingleUser = async (req, res) => {
  const { user_id } = req.params;
  const user = await USERS.findOne({
    where: { user_id },
    attributes: {
      exclude: ["password"], // Exclude the password field
    },
  });
  if (!user) {
    throw new NOT_FOUND(`There is no user with an id of ${user_id}`);
  }
  checkPermissions({ reqUser: req.user, resUser: user.user_id });
  res.status(StatusCodes.OK).json({ user });
};

const updateUser = async (req, res) => {
  const { user_id } = req.params;
console.log(user_id,'heeeeeeeeer')
  // Find the user
  const user = await USERS.findOne({ where: { user_id } });
  if (!user) {
    throw new NOT_FOUND(`There is no user with an id of ${user_id}`);
  }

  // Check user permissions
  checkPermissions({ reqUser: req.user, resUser: user.user_id });

  // Define the fields that are allowed to be updated
  const allowedUpdates = [
    "first_name",
    "last_name",
    "user_name",
    "phone",
    "gender",
    "address",
    "city",
    "state",
    "country",
  ];
  const updates = Object.keys(req.body);

  // Filter req.body to include only allowed fields
  const filteredUpdates = updates.reduce((acc, key) => {
    if (allowedUpdates.includes(key)) {
      acc[key] = req.body[key];
    }
    return acc;
  }, {});

  // Ensure there are fields to update
  if (Object.keys(filteredUpdates).length === 0) {
    throw new BAD_REQUEST("No valid fields provided for update");
  }

  // Update the user with the filtered data
  await USERS.update(filteredUpdates, {
    where: { user_id },
  });

  res.status(StatusCodes.OK).json({ msg: "User details updated successfully" });
};
const uploadAvatar = async (req, res) => {
  const userImage = req.files.image;
  //   console.log(userImage);
  if (!userImage.mimetype.startsWith("image")) {
    throw new BAD_REQUEST("please upload an image");
  }
  const maxSize = 2000 * 3000;
  if (userImage.size > maxSize) {
    throw new BAD_REQUEST("uploaded files should not be more than 18mb");
  }
  const user = await USERS.findOne({ where: { user_id: req.user.user_id } });
  if (!user)
    throw new NOT_FOUND(
      `User with id ${req.user.user_id} does not exist, complete registeration first !!! `
    );
  const currentPublicId = user.img_public_id;
  if (currentPublicId) {
    await cloudinary.uploader.destroy(currentPublicId);
  }
  const result = await cloudinary.uploader.upload(
    req.files.image.tempFilePath,
    {
      use_filename: true,
      folder: "AIM user's Avatars",
    }
  );
  //   console.log(result);
  user.image = result.secure_url;
  user.img_public_id = result.public_id;
  await user.save();
  res.status(StatusCodes.OK).json({
    image: {
      src: result.secure_url,
    },
  });
  fs.unlinkSync(req.files.image.tempFilePath);
};
const subscribeToEmail = async (req, res) => {
  const { subscribe } = req.body;
  const { user_id } = req.params;
  const user = await USERS.findOne({ where: { user_id } });
  if (subscribe !== true) {
    throw new BAD_REQUEST(`Click on the mail icon first !!!`);
  }
  checkPermissions({ reqUser: req.user, resUser: user.user_id });
  await USERS.update(
    { notification: true },
    {
      where: { user_id },
    }
  );

  res.status(StatusCodes.OK).json({
    msg: `${user.last_name} has been subscribed to Email notifications`,
  });
};
const unSubscribeToEmail = async (req, res) => {
  const { unSubscribe } = req.body;
  const { user_id } = req.params;
  const user = await USERS.findOne({ where: { user_id } });
  if (unSubscribe !== true) {
    throw new BAD_REQUEST(`subscription status is not set to true`);
  }
  checkPermissions({ reqUser: req.user, resUser: user.user_id });
  await USERS.update(
    { notification: false },
    {
      where: { user_id },
    }
  );
  res.status(StatusCodes.OK).json({
    msg: `${user.last_name} has been removed from Email notifications list`,
  });
};

module.exports = {
  getAllUsers,
  getSingleUser,
  updateUser,
  uploadAvatar,
  subscribeToEmail,
  unSubscribeToEmail,
};
