
var DataTypes = require("sequelize").DataTypes;
var _token = require("./token");
var _users = require("./users");
var _banner = require("./banner");
var _enquiries = require("./enquiries");
var _programmes = require("./programmes");
var _programmesimages = require("./programmesimages");
var _programmeoutcomes = require("./programmeoutcomes");
var _programme_reg = require("./programme_reg");
var _quran_surahs = require("./quran_surahs");
var _feedbackcomplaints = require("./feedbackcomplaints");
var _campaigns_aim = require("./campaigns_aim");
var _events = require("./events");
function initModels(sequelize) {
  var token = _token(sequelize, DataTypes);
  var users = _users(sequelize, DataTypes);
  var banner = _banner(sequelize, DataTypes);
  var enquiries = _enquiries(sequelize, DataTypes);
  var programmes = _programmes(sequelize, DataTypes);
  var programmesimages = _programmesimages(sequelize, DataTypes);
  var programmeoutcomes = _programmeoutcomes(sequelize, DataTypes);
  var quran_surahs = _quran_surahs(sequelize, DataTypes);
  var programme_reg = _programme_reg(sequelize, DataTypes);
  var feedbackcomplaints = _feedbackcomplaints(sequelize, DataTypes);
  var campaigns_aim = _campaigns_aim(sequelize, DataTypes);
  var events = _events(sequelize, DataTypes);
  token.belongsTo(users, { as: "user_user", foreignKey: "user" });
  users.hasMany(token, { as: "tokens", foreignKey: "user" });

  programmesimages.belongsTo(programmes, {
    as: "programme",
    foreignKey: "programme_id",
  });
  programmes.hasMany(programmesimages, {
    as: "programmesimages",
    foreignKey: "programme_id",
  });

  programmeoutcomes.belongsTo(programmes, {
    as: "programme",
    foreignKey: "programme_id",
  });
  programmes.hasMany(programmeoutcomes, {
    as: "programmeoutcomes",
    foreignKey: "programme_id",
  });

  programme_reg.belongsTo(programmes, {
    as: "linkedProgramme", // Changed alias
    foreignKey: "programme_id",
  });
  programmes.hasMany(programme_reg, {
    as: "programmeRegs", // Changed alias
    foreignKey: "programme_id",
  });

  programme_reg.belongsTo(users, { as: "user", foreignKey: "user_id" });
  users.hasMany(programme_reg, { as: "programme_regs", foreignKey: "user_id" });

  feedbackcomplaints.belongsTo(programmes, {
    as: "programme",
    foreignKey: "programme_id",
  });
  // programmes.hasMany(feedbackcomplaints, {
  //   as: "feedbackcomplaints",
  //   foreignKey: "programme_id",
  // });

  feedbackcomplaints.belongsTo(users, { as: "user", foreignKey: "user_id" });
  users.hasMany(feedbackcomplaints, {
    as: "feedbackcomplaints",
    foreignKey: "user_id",
  });

  return {
    token,
    users,
    banner,
    enquiries,
    programmes,
    programmesimages,
    programmeoutcomes,
    programme_reg,
    quran_surahs,
    feedbackcomplaints,
    campaigns_aim,
    events,
  };
}

module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
