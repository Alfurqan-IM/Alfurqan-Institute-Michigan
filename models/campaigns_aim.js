const Sequelize = require("sequelize");
module.exports = function (sequelize, DataTypes) {
  const campaigns_aim = sequelize.define(
    "campaigns_aim",
    {
      campaign_id: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      title: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      image_url: {
        type: DataTypes.STRING(500),
        allowNull: false,
        defaultValue: "/uploads/example.jpeg",
      },
      image_public_id: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      donation_url: {
        type: DataTypes.STRING(500),
        allowNull: false,
        defaultValue: " https://donorbox.org/embed",
      },
      start_date: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: Sequelize.Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      end_date: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      status: {
        type: DataTypes.ENUM("active", "completed", "pending"),
        allowNull: true,
        defaultValue: "active",
      },
    },
    {
      sequelize,
      tableName: "campaigns_aim",
      timestamps: false,
      indexes: [
        {
          name: "PRIMARY",
          unique: true,
          using: "BTREE",
          fields: [{ name: "campaign_id" }],
        },
      ],
    }
  );
  return campaigns_aim;
};
