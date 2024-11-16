import mongoose, { Schema } from "mongoose";


const purchase = new Schema({
    qty: {
        type: Number,
        require: true
    }
}, {
    timestamps: true
})


const sell = new Schema({
    qty: {
        type: Number,
        require: true
    },
    details: {
        type: String,
        require: false,
    }
}, {
    timestamps: true
})



const saleReturn = new Schema({
    qty: {
        type: Number,
        require: true
    },
    reson: {
        type: String,
        require: false,
    }
}, {
    timestamps: true
})


const productDocument = new Schema({
    pname: {
        type: String,
        require: true,
    },
    price: {
        type: Number,
        require: true
    },
    qty: {
        type: Number,
        require: true
    },
    total: {
        type: Number,
        require: true
    },
    purchases:{
        type: [purchase],
        require: false
    },
    sells: {
        type: [sell],
        require: false
    },
    salesReturn: {
        type: [saleReturn],
        require: false
    }
}, {

    timestamps: true
})


export const Product = mongoose.models.Product || mongoose.model('Product', productDocument);