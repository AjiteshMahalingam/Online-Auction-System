const Mongoose = require('mongoose');


const Schema = Mongoose.Schema;
const productSchema = new Schema({
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
  productDesc : {
    type: String,
    required: true,
    trim: true,
  },
  productImg: {
    type: Buffer,
    required: true,
  },
}, {
    timestamps: true
});

const Product = Mongoose.model('product',productSchema);

module.exports =  Product;
