var DataTypes = require("sequelize").DataTypes;
var _token = require("./token");
var _users = require("./users");

function initModels(sequelize) {
  var token = _token(sequelize, DataTypes);
  var users = _users(sequelize, DataTypes);

  token.belongsTo(users, { as: "user_user", foreignKey: "user"});
  users.hasMany(token, { as: "tokens", foreignKey: "user"});

  return {
    token,
    users,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
