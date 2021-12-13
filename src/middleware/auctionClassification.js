const Category = require('../models/Category');
const Product = require('../models/Product');
const Auction = require('../models/Auction');
const Mongoose = require('mongoose');

const auctionClassification = async (req, res, next) => {
    if (req.decoded.type === 'student') {
        const auctions = await Auction.find({ sellerId: Mongoose.Types.ObjectId(req.decoded._id) });
        const auctionsCompleted = auctions.filter((auction) => auction.isCompleted);
        auctionsCompleted.forEach((auction) => {
            auction.populate('productId')
                .exec((err, auction) => {
                    console.log(auction);
                });
        });

        var auctionsPending = auctions.filter((auction) => !auction.isCompleted);
        var pending = [];
        auctionsPending.map(async (auction) => {
            try {
                const product = await Product.findOne({ _id: auction.productId });
                
                pending.push({ ...auction, productName : product.productName, productDesc : product.productDesc });
                
            } catch (e) {
                console.log(e);
            }
        });
        //console.log(auctionsPending);
        req.auctionsPending = pending;
        req.auctionsCompleted = auctionsCompleted;
        next();
    }
};

module.exports = auctionClassification;