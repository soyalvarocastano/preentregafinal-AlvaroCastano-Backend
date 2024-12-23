import mongoose from "mongoose";

const cartCollection = "carts";


const cartSchema = new mongoose.Schema({
    products:{
        type: [
            {
                product: {
                    type: mongoose.Schema.Types.ObjectId, 
                    ref: "products"
                },
                quantity: {type: mongoose.Schema.Types.Number ,default: 1}
            }
        ],
        default: []
    },
    token: String,
   
});

export const cartModel = mongoose.model(cartCollection, cartSchema);
