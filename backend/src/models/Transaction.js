const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema(
    {
        transactionId: {
            type: String,
            required: true,
            unique: true,
            index: true,
        },
        date: {
            type: Date,
            required: true,
            index: true,
        },
        customerId: {
            type: String,
            required: true,
            index: true,
        },
        customerName: {
            type: String,
            required: true,
        },
        phoneNumber: {
            type: String,
            required: true,
        },
        gender: {
            type: String,
            enum: ["Male", "Female"],
        },
        age: {
            type: Number,
            required: true,
        },
        customerRegion: {
            type: String,
            required: true,
        },
        customerType: {
            type: String,
            enum: ["New", "Returning", "Loyal"],
            required: true,
        },
        productId: {
            type: String,
            required: true,
            index: true,
        },
        productName: {
            type: String,
            required: true,
        },
        brand: {
            type: String,
            required: true,
        },
        productCategory: {
            type: String,
            required: true,
            index: true,
        },
        tags: {
            type: [String],
            default: [],
        },
        quantity: {
            type: Number,
            required: true,
            min: 1,
        },
        pricePerUnit: {
            type: Number,
            required: true,
            min: 0,
        },
        discountPercentage: {
            type: Number,
            required: true,
            min: 0,
            max: 100,
        },
        totalAmount: {
            type: Number,
            required: true,
            min: 0,
        },
        finalAmount: {
            type: Number,
            required: true,
            min: 0,
        },
        paymentMethod: {
            type: String,
            enum: ["Cash", "Credit Card", "Debit Card", "UPI", "Net Banking", "Wallet"],
            required: true,
        },
        orderStatus: {
            type: String,
            enum: ["Pending", "Completed", "Cancelled", "Returned"],
            required: true,
            index: true,
        },
        deliveryType: {
            type: String,
            enum: ["Standard", "Express", "Store Pickup"],
            required: true,
        },
        storeId: {
            type: String,
            required: true,
        },
        storeLocation: {
            type: String,
            required: true,
        },
        salespersonId: {
            type: String,
            required: true,
        },
        employeeName: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

// Indexes for queries
transactionSchema.index({ date: -1, orderStatus: 1 });
transactionSchema.index({ customerId: 1, date: -1 });
transactionSchema.index({ productCategory: 1, date: -1 });
transactionSchema.index({ customerName: 1, date: -1 });
transactionSchema.index({ quantity: 1 });
transactionSchema.index({ finalAmount: 1 });

const Transaction = mongoose.model("Transaction", transactionSchema);

module.exports = Transaction;
