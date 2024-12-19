const Sequelize = require("sequelize");
module.exports = function (sequelize, DataTypes) {
  const banner = sequelize.define(
    "banner",
    {
      banner_id: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      title: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      image: {
        type: DataTypes.STRING(255),
        allowNull: true,
        defaultValue: "/uploads/example.jpeg",
      },
      image_public_id: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
    },
    {
      sequelize,
      tableName: "banner",
      timestamps: true,
      indexes: [
        {
          name: "PRIMARY",
          unique: true,
          using: "BTREE",
          fields: [{ name: "banner_id" }],
        },
      ],
    }
  );
  return banner;
};
