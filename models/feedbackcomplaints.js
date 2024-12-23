const Sequelize = require("sequelize");
module.exports = function (sequelize, DataTypes) {
  const feedbackcomplaints = sequelize.define(
    "feedbackcomplaints",
    {
      feedback_id: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "users",
          key: "user_id",
        },
      },
      subject: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      notes: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
    },
    {
      sequelize,
      tableName: "feedbackcomplaints",
      timestamps: true,
      indexes: [
        {
          name: "PRIMARY",
          unique: true,
          using: "BTREE",
          fields: [{ name: "feedback_id" }],
        },
        {
          name: "user_id",
          using: "BTREE",
          fields: [{ name: "user_id" }],
        },
      ],
    }
  );
  feedbackcomplaints.associate = function (models) {
    feedbackcomplaints.belongsTo(models.users, {
      foreignKey: "user_id",
    });
  };
  return feedbackcomplaints;
};
