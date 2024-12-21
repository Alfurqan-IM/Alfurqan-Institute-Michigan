const {
  programme_reg: REG,
  programmes: PROGRAMMES,
  users: USERS,
} = require("../models");
const {
  BAD_REQUEST,
  NOT_FOUND,
  UNAUTHORIZED,
} = require("../middleware/customErrors");
const { StatusCodes } = require("http-status-codes");
const { checkPermissions } = require("../middleware/authentication");
const createReg = async (req, res) => {
  const { programme, discovery_method, category } = req.body;

  // Validate input fields
  if (!programme || !discovery_method || !category) {
    throw new BAD_REQUEST("Some input fields are missing");
  }

  try {
    // Fetch the corresponding programme_id from the database
    const programmeData = await PROGRAMMES.findOne({
      where: { title: programme },
      attributes: ["programme_id"], // Fetch only the programme_id
    });
    // console.log(programmeData);
    if (!programmeData) {
      throw new BAD_REQUEST("Invalid programme name selected");
    }

    // Extract programme_id
    const { programme_id } = programmeData;

    // Add programme_id and user_id to the request body
    const registrationData = {
      programme_id,
      discovery_method,
      user_id: req.user.user_id,
      category,
      programme,
    };
    const existingReg = await REG.findOne({
      where: { programme_id, user_id: req.user.user_id },
    });
    if (existingReg) {
      throw new BAD_REQUEST("you have already registered for this programme ");
    }
    // Create the registration record
    await REG.create(registrationData);

    // Respond to the client
    res
      .status(StatusCodes.OK)
      .json({ msg: "Programme registration created successfully" });
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: error.message });
  }
};
const editReg = async (req, res) => {
  const { reg_id } = req.params; // Registration ID from URL params
  const { programme, discovery_method, category } = req.body;

  if (!programme || !discovery_method || !category) {
    throw new BAD_REQUEST("Some input fields are missing");
  }

  try {
    // Fetch the corresponding programme_id from the database
    const programmeData = await PROGRAMMES.findOne({
      where: { title: programme },
      attributes: ["programme_id"],
    });

    if (!programmeData) {
      throw new BAD_REQUEST("Invalid programme name selected");
    }

    const { programme_id } = programmeData;

    // Update the registration record
    const updatedReg = await REG.update(
      { programme_id, discovery_method, category, programme },
      { where: { reg_id, user_id: req.user.user_id }, returning: true }
    );

    if (!updatedReg) {
      throw new NOT_FOUND("Registration not found or not authorized");
    }

    res
      .status(StatusCodes.OK)
      .json({ msg: "Registration updated successfully" });
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: error.message });
  }
};
const deleteReg = async (req, res) => {
  const { reg_id } = req.params;
  const registration = await REG.findOne({
    where: { reg_id },
  });
  if (!registration) {
    throw new NOT_FOUND(`There is no registeration with an id of ${reg_id}`);
  }
  const user = await USERS.findOne({
    where: { user_id: registration.user_id },
  });
  checkPermissions({ reqUser: req.user, resUser: user.user_id });
  try {
    // Delete the registration record
    const deleted = await REG.destroy({
      where: { reg_id },
    });

    if (!deleted) {
      throw new NOT_FOUND("Registration not found or not authorized");
    }

    res
      .status(StatusCodes.OK)
      .json({ msg: "Registration deleted successfully" });
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: error.message });
  }
};
const getUserRegistrations = async (req, res) => {
  try {
    // Retrieve all registrations for the logged-in user
    const registrations = await REG.findAll({
      where: { user_id: req.user.user_id },
      include: [
        { model: PROGRAMMES, attributes: ["title"], as: "linkedProgramme" }, // Include programme details
      ],
    });

    res.status(StatusCodes.OK).json({ registrations });
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: error.message });
  }
};
const getAllRegistrations = async (req, res) => {
  try {
    // Retrieve all registrations across all users
    const registrations = await REG.findAll({
      include: [
        {
          model: USERS,
          attributes: [
            "user_id",
            "first_name",
            "last_name",
            "email",
            "gender",
            "phone",
          ],
          as: "user",
        }, // Include user details

        { model: PROGRAMMES, attributes: ["title"], as: "linkedProgramme" }, // Include programme details
      ],
    });

    res.status(StatusCodes.OK).json({ registrations });
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: error.message });
  }
};

module.exports = {
  createReg,
  editReg,
  deleteReg,
  getAllRegistrations,
  getUserRegistrations,
};
