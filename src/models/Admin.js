const Mongoose = require('mongoose');
const validator = require('validator');
const Schema = Mongoose.Schema;
const adminSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowerCase: true,
      unique: true,
      validate(value) {
        if (!validator.isEmail(value))
          throw new Error("Enter the valid Email!!");
      },
    },
    password: {
      type: String,
      required: true,
      trim: true,
      minLength: 7,
    },
  },
  {
    timestamps: true,
  }
);

const Admin = Mongoose.model('admin', adminSchema);
Admin.createIndexes();

module.exports = Admin;