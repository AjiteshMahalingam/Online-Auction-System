const Mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

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
  tokens: [{
    token: {
      type: String
    }
  }]
},
  {
    timestamps: true,
  });

adminSchema.methods.generateAuthToken = async function () {
  const admin = this;
  const token = await jwt.sign({ _id: admin._id.toString(), type : "admin"}, 'ac780bcd612258fe876474db066bd186dd3d70a32cc173db964e');
  return token;
};

adminSchema.statics.findByCredentials = async (email, password) => {
  const admin= await Admin.findOne({ email });
  if(!admin)
      throw new Error('Unable to connect');
  const isMatch = admin.password === password;
  if(!isMatch)
      throw new Error('Unable to connect');
  return admin;
};

const Admin = Mongoose.model('admin', adminSchema);
Admin.createIndexes();

module.exports = Admin;