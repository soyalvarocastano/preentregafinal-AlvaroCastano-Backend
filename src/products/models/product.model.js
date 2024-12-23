import mongoose from "mongoose";

const productCollection = "products"

// definimos el esquema de los datos
const productSchema = new mongoose.Schema({
    title: String,
    description: String,
    code: String,
    price: Number,
    status: Boolean,
    stock: Number,
    category: String
})

//creamos los indices
productSchema.index({price:1})
productSchema.index({category:1})

//exportamos el modelo 
export const productModel = mongoose.model(productCollection, productSchema)