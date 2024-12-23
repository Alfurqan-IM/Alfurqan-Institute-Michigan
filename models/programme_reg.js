const Sequelize = require("sequelize");
module.exports = function (sequelize, DataTypes) {
  const programme_reg = sequelize.define(
    "programme_reg",
    {
      reg_id: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      programme_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "programmes",
          key: "programme_id",
        },
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "users",
          key: "user_id",
        },
      },
      programme: {
        type: DataTypes.ENUM(
          "Ta-afiz Alquran",
          "Arabic Language studies",
          "Vocational Training",
          "Islamic studies",
          "Islamic Conference",
          "Free Iftar Meal"
        ),
        allowNull: false,
      },
      category: {
        type: DataTypes.ENUM("Youth", "Adult"),
        allowNull: false,
      },
      discovery_method: {
        type: DataTypes.ENUM(
          "Masjid",
          "Social Media",
          "Email Campaign",
          "Referral",
          "Website",
          "Event/Workshop",
          "Advertisement",
          "Friends",
          "Other"
        ),
        allowNull: false,
      },
    },
    {
      sequelize,
      tableName: "programme_reg",
      timestamps: true,
      indexes: [
        {
          name: "PRIMARY",
          unique: true,
          using: "BTREE",
          fields: [{ name: "reg_id" }],
        },
        {
          name: "programme_id",
          using: "BTREE",
          fields: [{ name: "programme_id" }],
        },
        {
          name: "user_id",
          using: "BTREE",
          fields: [{ name: "user_id" }],
        },
      ],
    }
  );
  programme_reg.associate = function (models) {
    programme_reg.belongsTo(models.programmes, {
      foreignKey: "programme_id",
      as: "linkedProgramme", // Optional: Alias for the association
    });

    programme_reg.belongsTo(models.users, {
      foreignKey: "user_id",
      as: "user", // Optional: Alias for the association
    });
  };
  return programme_reg;
};
