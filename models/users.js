const Sequelize = require("sequelize");
const bcrypt = require("bcryptjs");
module.exports = function (sequelize, DataTypes) {
  const users = sequelize.define(
    "users",
    {
      user_id: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      first_name: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      last_name: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      user_name: {
        type: DataTypes.STRING(50),
        allowNull: true,
        // defaultValue: null,
        unique: "user_name",
      },
      email: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: "email",
        validate: {
          isEmail: {
            args: true,
            msg: "Please provide a valid email",
          },
        },
      },
      password: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      role: {
        type: DataTypes.ENUM("admin", "user"),
        allowNull: true,
        defaultValue: "user",
      },
      phone: {
        type: DataTypes.STRING(30),
        allowNull: false,
        unique: "phone",
      },
      image: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      gender: {
        type: DataTypes.ENUM("male", "female"),
        allowNull: true,
        defaultValue: "female",
      },
      address: {
        type: DataTypes.STRING(1000),
        allowNull: false,
        defaultValue: "please update your address",
      },
      city: {
        type: DataTypes.STRING(50),
        allowNull: false,
        defaultValue: "please update your city",
      },
      state: {
        type: DataTypes.STRING(50),
        allowNull: false,
        defaultValue: "please update your state",
      },
      country: {
        type: DataTypes.STRING(50),
        allowNull: false,
        defaultValue: "please update your country",
      },
      notification: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: 0,
      },
      blacklisted: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: 0,
      },
      verificationString: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      isVerified: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: 0,
      },
      verified: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      passwordToken: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      passwordExpirationDate: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      sequelize,
      tableName: "users",
      hasTrigger: true,
      timestamps: true,
      indexes: [
        {
          name: "PRIMARY",
          unique: true,
          using: "BTREE",
          fields: [{ name: "user_id" }],
        },
        {
          name: "email",
          unique: true,
          using: "BTREE",
          fields: [{ name: "email" }],
        },
        {
          name: "phone",
          unique: true,
          using: "BTREE",
          fields: [{ name: "phone" }],
        },
        {
          name: "user_name",
          unique: true,
          using: "BTREE",
          fields: [{ name: "user_name" }],
        },
      ],
    }
  );
  users.prototype.comparePassword = async function (userPassword) {
    const isMatch = await bcrypt.compare(userPassword, this.password);
    // console.log(isMatch);
    return isMatch;
  };
  users.beforeSave(async (user, options) => {
    // console.log(user, "here");
    if (user.changed("password")) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(user.password, salt);
    }
  });
  return users;
};
// npx sequelize-auto -o "./models" -d alfurqan_institute_michigan -h 127.0.0.1 -u root -p 3306 -x BabanFad@92 -e mysql --tables programmes,programmesImages,programmeOutcomes


