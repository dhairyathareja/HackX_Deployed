import mongoose, { model, Schema } from "mongoose";

const supplierSchema = new Schema({
    name:String,
    email:String,
    phone:{type:Number},
    address:String,
    gst:String,
    category:[String],
    feedback:[
        {
            rating:Number,
            description:String
        }
    ],
    products:[{
        category:String,
        name:String,
        stock:Number
    }],
})

const Supplier = new model('Supplier',supplierSchema);
export default Supplier;