const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    origin: {
        type: String,
        required: true
    },
    farmerPrice: {
        type: Number,
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        min: 0
    },
    remainingQuantity: {
        type: Number,
        required: true,
        min: 0
    },
    unit: {
        type: String,
        default: 'Kgs'
    },
    parentItem: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Item'
    },
    distributorPrice: {
        type: Number,
        default: 0
    },
    retailerPrice: {
        type: Number,
        default: 0
    },
    distributorMargin: {
        type: Number,
        default: 0
    },
    retailerMargin: {
        type: Number,
        default: 0
    },
    quality: {
        type: String,
        required: true
    },
    state: {
        type: String,
        enum: [
            'Harvested', 
            'PurchasedByDistributor', 
            'ShippedByDistributor', 
            'ReceivedByRetailer', 
            'ForSaleByRetailer', 
            'PurchasedByConsumer'
        ],
        default: 'Harvested'
    },
    farmer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    distributor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    retailer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    consumer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    history: [
        {
            state: String,
            timestamp: {
                type: Date,
                default: Date.now
            },
            updatedBy: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User'
            }
        }
    ],
    imageUrl: {
        type: String,
        default: ''
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Item', itemSchema);
