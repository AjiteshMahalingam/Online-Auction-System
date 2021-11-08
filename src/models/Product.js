import { Mongoose } from "mongoose";

const Schema = Mongoose.Schema;
const productSchema = new Schema({
  productId: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
  productName: {
    type: String,
    required: true,
    trim: true,
  },
  categoryId: {
    type: Mongoose.Schema.Types.ObjectId,
    ref: "category",
    required: true,
  },
  sellerId: {
    type: Mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "student",
  },
  productImg: {
    type: Buffer,
    required: true,
  },
}, {
    timestamps: true
});

const Product = Mongoose.model('product',productSchema);
Product.createIndexes();
export default Product;
