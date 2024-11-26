const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('token', {
    token_id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    refreshToken: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    ip: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    userAgent: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    isValid: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    },
    user: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'users',
        key: 'user_id'
      }
    }
  }, {
    sequelize,
    tableName: 'token',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "token_id" },
        ]
      },
      {
        name: "user",
        using: "BTREE",
        fields: [
          { name: "user" },
        ]
      },
    ]
  });
};
