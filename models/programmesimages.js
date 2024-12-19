const Sequelize = require("sequelize");
const programmes = require("./programmes");
module.exports = function (sequelize, DataTypes) {
  const programmesimages = sequelize.define(
    "programmesimages",
    {
      img_id: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      programme_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "programmes",
          key: "programme_id",
        },
      },
      image0: {
        type: DataTypes.STRING(255),
        allowNull: true,
        defaultValue: "/uploads/example.jpeg",
      },
      image0_public_id: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      image1: {
        type: DataTypes.STRING(255),
        allowNull: true,
        defaultValue: "/uploads/example.jpeg",
      },
      image1_public_id: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      image2: {
        type: DataTypes.STRING(255),
        allowNull: true,
        defaultValue: "/uploads/example.jpeg",
      },
      image2_public_id: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
    },
    {
      sequelize,
      tableName: "programmesimages",
      timestamps: true,
      indexes: [
        {
          name: "PRIMARY",
          unique: true,
          using: "BTREE",
          fields: [{ name: "img_id" }],
        },
        {
          name: "programme_id",
          using: "BTREE",
          fields: [{ name: "programme_id" }],
        },
      ],
    }
  );

  
  return programmesimages;
};
