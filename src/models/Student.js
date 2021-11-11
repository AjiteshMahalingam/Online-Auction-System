const Mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

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
    enum: ['CEG', 'MIT', 'ACT', 'SAP'],
    required: true,
    trim: true,
  },
  dept: {
    type: String,
    enum: ['CSE', 'IT', 'ECE', 'EEE', 'CIVIL', 'MECH'],
    required: true
  },
  tokens: [{
    token: {
      type: String
    }
  }]
}, {
  timestamps: true
});

studentSchema.methods.generateAuthToken = async function () {
  const student = this;
  const token = await jwt.sign({ _id: student._id.toString(), type : "student"}, 'ac780bcd612258fe876474db066bd186dd3d70a32cc173db964e');
  return token;
};

studentSchema.statics.findByCredentials = async (email, password) => {
  const student = await Student.findOne({ email });
  if(!student)
      throw new Error('Unable to connect');
  const isMatch = await bcrypt.compare(password, student.password);
  if(!isMatch)
      throw new Error('Unable to connect');
  return student;
};

studentSchema.pre('save', async function (next) {
  const student = this;
  if (student.isModified('password')) {
    student.password = await bcrypt.hash(student.password, 8);
  }
  next();
});

const Student = Mongoose.model('student', studentSchema);
Student.createIndexes();

module.exports = Student;
