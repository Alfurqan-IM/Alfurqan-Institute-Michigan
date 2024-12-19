const Sequelize = require("sequelize");
module.exports = function (sequelize, DataTypes) {
  const enquiries = sequelize.define(
    "enquiries",
    {
      enq_id: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING(255),
        allowNull: false,
        validate: {
          isEmail: {
            args: true,
            msg: "Please provide a valid email",
          },
        },
      },
      message: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
    },
    {
      sequelize,
      tableName: "enquiries",
      timestamps: true,
      indexes: [
        {
          name: "PRIMARY",
          unique: true,
          using: "BTREE",
          fields: [{ name: "enq_id" }],
        },
      ],
    }
  );
  return enquiries;
};
