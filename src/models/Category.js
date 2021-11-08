import { Mongoose } from "mongoose";

const Schema = Mongoose.Schema;
const categorySchema = new Schema(
  {
    categoryId: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    categoryName: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const Category = Mongoose.model('category', categorySchema);
Category.createIndexes();
export default Category;