var DataTypes = require("sequelize").DataTypes;
var _token = require("./token");
var _users = require("./users");
var _banner = require("./banner");
var _enquiries = require("./enquiries");
var _programmes = require("./programmes");
var _programmesimages = require("./programmesimages");
var _programmeoutcomes = require("./programmeoutcomes");

function initModels(sequelize) {
  var token = _token(sequelize, DataTypes);
  var users = _users(sequelize, DataTypes);
  var banner = _banner(sequelize, DataTypes);
  var enquiries = _enquiries(sequelize, DataTypes);
  var programmes = _programmes(sequelize, DataTypes);
  var programmesimages = _programmesimages(sequelize, DataTypes);
  var programmeoutcomes = _programmeoutcomes(sequelize, DataTypes);
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
  return {
    token,
    users,
    banner,
    enquiries,
    programmes,
    programmesimages,
    programmeoutcomes,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
