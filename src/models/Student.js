import { Mongoose } from "mongoose";
import validator from "validator";

const Schema = Mongoose.Schema;
const studentSchema = new Schema({
  regNo: {
    type: String,
    required: true,
    trim: true,
    unique: true, // To create index on regNo
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    trim: true,
    minLength: 7,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowerCase: true,
    validate(value) {
      if (!validator.isEmail(value)) throw new Error("Enter valid email!!");
    },
  },
  contactNo: {
    type: String,
    required: true,
    trim: true,
  },
  gender: {
    type: String,
    enum: ["male", "female", "other"],
    required: true,
  },
  college: {
    type: String,
    required: true,
    trim: true,
  },
});
