const Sequelize = require("sequelize");
module.exports = function (sequelize, DataTypes) {
  const events = sequelize.define(
    "events",
    {
      event_id: {
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
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      event_date: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      location: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      organizer: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      contact_email: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      contact_phone: {
        type: DataTypes.STRING(20),
        allowNull: true,
      },
      event_url: {
        type: DataTypes.STRING(500),
        allowNull: false,
        defaultValue: "https://donorbox.org/events",
      },
      status: {
        type: DataTypes.ENUM("upcoming", "ongoing", "completed"),
        allowNull: true,
        defaultValue: "upcoming",
      },
    },
    {
      sequelize,
      tableName: "events",
      timestamps: true,
      indexes: [
        {
          name: "PRIMARY",
          unique: true,
          using: "BTREE",
          fields: [{ name: "event_id" }],
        },
      ],
    }
  );
  return events;
};
