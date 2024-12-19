const Sequelize = require("sequelize");
module.exports = function (sequelize, DataTypes) {
  const programmeoutcomes = sequelize.define(
    "programmeoutcomes",
    {
      outcome_id: {
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
      outcome1: {
        type: DataTypes.STRING(255),
        allowNull: true,
        defaultValue: "/uploads/example.jpeg",
      },
      outcome2: {
        type: DataTypes.STRING(255),
        allowNull: true,
        defaultValue: "/uploads/example.jpeg",
      },
      outcome3: {
        type: DataTypes.STRING(255),
        allowNull: true,
        defaultValue: "/uploads/example.jpeg",
      },
    },
    {
      sequelize,
      tableName: "programmeoutcomes",
      timestamps: true,
      indexes: [
        {
          name: "PRIMARY",
          unique: true,
          using: "BTREE",
          fields: [{ name: "outcome_id" }],
        },
        {
          name: "programme_id",
          using: "BTREE",
          fields: [{ name: "programme_id" }],
        },
      ],
    }
  );
  return programmeoutcomes;
};
