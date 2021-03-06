const Mongoose = require('mongoose');
const validator = require('validator');

const Schema = Mongoose.Schema;
const auctionSchema = new Schema(
  {
    productId: {
      type: Mongoose.Schema.Types.ObjectId,
      ref: "product",
      required: true,
    },
    sellerId: {
      type: Mongoose.Schema.Types.ObjectId,
      ref: "student",
      required: true,
    },
    openingBid: {
      type: Number,
      required: true,
      default: 0,
    },
    auctionDate : {
      type: Date,
      required: true
    },
    isAccepted : {
      type: Boolean,
      default : false
    },
    isCompleted : {
      type: Boolean,
      default : false
    },
    currentHighestBid: {
      type: Number,
      required: true,
      default: 0,
    },
    startTime: {
        type: Date,
        default : null
    },
    endTime: {
        type: Date,
        default : null
    },
    currentHighestBidder: {
        type: Mongoose.Schema.Types.ObjectId,
        ref: 'student',
        default: null
    },
    paymentSuccess : {
        type: Boolean,
        default: false
    }
  },
  {
    timestamps: true,
  }
);

const Auction = Mongoose.model('auction',auctionSchema);
module.exports =  Auction;

