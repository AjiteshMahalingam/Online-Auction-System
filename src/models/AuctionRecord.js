import { Mongoose } from "mongoose";

const Schema = Mongoose.Schema;
const recordEntrySchema = new Schema(
  {
    bidderId: {
      type: Mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "student",
    },
    currentBid: {
      type: Number,
      required: true,
      default: 0,
    },
    currentHighestBid: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const recordSchema = new Schema(
  {
    auctionId: {
      type: Mongoose.Schema.Types.ObjectId,
      require: true,
      ref: "auction",
    },
    records: [
      {
        record: {
          type: recordEntrySchema,
          default: {},
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const AuctionRecord = Mongoose.model('auctionrecord', recordSchema);

export default AuctionRecord;
