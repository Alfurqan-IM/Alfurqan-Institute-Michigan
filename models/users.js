const Sequelize = require("sequelize");
module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    "users",
    {
      user_id: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      fisrt_name: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      last_name: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      user_name: {
        type: DataTypes.STRING(50),
        allowNull: true,
        defaultValue: "---",
        unique: "user_name",
      },
      email: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: "email",
      },
      password: {
        type: DataTypes.STRING(30),
        allowNull: false,
      },
      role: {
        type: DataTypes.ENUM("admin", "user"),
        allowNull: true,
        defaultValue: "user",
      },
      phone: {
        type: DataTypes.STRING(30),
        allowNull: false,
        unique: "phone",
      },
      image: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      gender: {
        type: DataTypes.ENUM("male", "female"),
        allowNull: true,
        defaultValue: "female",
      },
      address: {
        type: DataTypes.STRING(1000),
        allowNull: false,
        defaultValue: "please update your address",
      },
      city: {
        type: DataTypes.STRING(50),
        allowNull: false,
        defaultValue: "please update your city",
      },
      state: {
        type: DataTypes.STRING(50),
        allowNull: false,
        defaultValue: "please update your state",
      },
      country: {
        type: DataTypes.STRING(50),
        allowNull: false,
        defaultValue: "please update your country",
      },
      notification: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: 0,
      },
      blacklisted: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: 0,
      },
      verificationString: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      isVerified: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: 0,
      },
      verified: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      passwordToken: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      passwordExpirationDate: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      sequelize,
      tableName: "users",
      hasTrigger: true,
      timestamps: true,
      indexes: [
        {
          name: "PRIMARY",
          unique: true,
          using: "BTREE",
          fields: [{ name: "user_id" }],
        },
        {
          name: "email",
          unique: true,
          using: "BTREE",
          fields: [{ name: "email" }],
        },
        {
          name: "phone",
          unique: true,
          using: "BTREE",
          fields: [{ name: "phone" }],
        },
        {
          name: "user_name",
          unique: true,
          using: "BTREE",
          fields: [{ name: "user_name" }],
        },
      ],
    }
  );
};
