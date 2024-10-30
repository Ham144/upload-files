import mongoose from "mongoose";

const tableSchema = new mongoose.Schema({
    barcode: {
        type: String,
    },
    sku: {
        type: String,
        required: true,
        unique: true
    },
    skuMaster: {
        type: String,
    }
}, { timestamps: true })

const Table = mongoose.model("Table", tableSchema)
export default Table