const Sequelize = require("sequelize");
module.exports = function (sequelize, DataTypes) {
  const programmes = sequelize.define(
    "programmes",
    {
      programme_id: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      title: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      heading: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      about: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      time: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      year: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      start_date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      end_date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
    },
    {
      sequelize,
      tableName: "programmes",
      timestamps: true,
      indexes: [
        {
          name: "PRIMARY",
          unique: true,
          using: "BTREE",
          fields: [{ name: "programme_id" }],
        },
      ],
    }
  );
  programmes.associate = function (models) {
    programmes.hasMany(models.programmesimages, { foreignKey: "programme_id" });
    programmes.hasMany(models.programmeoutcomes, {
      foreignKey: "programme_id",
    });

    // Define hooks within the associate function
    programmes.beforeDestroy(async (programmeInstance, options) => {
      const { programme_id } = programmeInstance;

      const programme_imagesTBD = await models.programmesimages.findOne({
        where: { programme_id },
      });
      const programme_outcomeTBD = await models.programmeoutcomes.findOne({
        where: { programme_id },
      });

      if (programme_imagesTBD) {
        await programme_imagesTBD.destroy();
      } else {
        console.warn(
          `No programme image found for programme_id: ${programme_id}`
        );
      }

      if (programme_outcomeTBD) {
        await programme_outcomeTBD.destroy();
      } else {
        console.warn(
          `No programme outcome found for programme_id: ${programme_id}`
        );
      }
    });

    programmes.afterCreate(async (programmeInstance) => {
      const { programme_id } = programmeInstance;
      await models.programmesimages.create({
        programme_id,
        image1: "/uploads/default.jpeg",
        image1_public_id: "default_public_id",
        image2: "/uploads/default.jpeg",
        image2_public_id: "default_public_id",
        image3: "/uploads/default.jpeg",
        image3_public_id: "default_public_id",
      });

      await models.programmeoutcomes.create({
        programme_id,
        outcome1: "placeholder benefit 1",
        outcome2: "placeholder benefit 2",
        outcome3: "placeholder benefit 3",
      });

      console.log(
        `Default images and outcomes created for programme ID: ${programme_id}`
      );
    });
  };
  return programmes;
};
