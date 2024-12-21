const Sequelize = require("sequelize");
module.exports = function (sequelize, DataTypes) {
  const quran_surahs = sequelize.define(
    "quran_surahs",
    {
      surah_id: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      surah: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      verse: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      translation: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      transliteration: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    },
    {
      sequelize,
      tableName: "quran_surahs",
      timestamps: true,
      indexes: [
        {
          name: "PRIMARY",
          unique: true,
          using: "BTREE",
          fields: [{ name: "surah_id" }],
        },
      ],
    }
  );
  return quran_surahs;
};
