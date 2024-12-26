import { cartModel } from "./models/carts.model.js";
import {productModel} from "../products/models/product.model.js"
import Service from "../utils/service.js";
import crypto from 'crypto';

export default class CartService extends Service {
    constructor() {
        super(cartModel);
    }

    async getAllCarts(populate) {
        return await cartModel.find().populate({
            path: populate,
            populate: {
                path: 'product',
                model: 'products',
            },
        });
    
    }

    async getByToken(token) {
        const record = await cartModel.find({token})
        return record;
    }
    

async addProductToCartByToken(token, productId, quantity = 1) {
    const cart = await cartModel.findOne({ token }).populate('products.product');
    if (!cart) throw new Error("Carrito no encontrado");

    const existingProduct = cart.products.find((item) => item.product._id.equals(productId));
    if (existingProduct) {
        existingProduct.quantity += quantity;
    } else {
        cart.products.push({ product: productId, quantity });
    }

    await cart.save();

    return cart;
}


async updateCartByToken(token, newProducts) {
    if (!Array.isArray(newProducts)) {
        throw new Error("Los productos deben ser un array");
    }

    const cart = await cartModel.findOne({ token }).populate('products.product');
    if (!cart) throw new Error("Carrito no encontrado");

    
    for (let productItem of newProducts) {
        const { productId, quantity } = productItem;

        
        if (quantity <= 0) {
            throw new Error("La cantidad debe ser mayor a 0");
        }

        const product = cart.products.find((item) => item.product._id.toString() === productId);

        if (!product) {
            throw new Error(`Producto con ID ${productId} no encontrado en el carrito`);
        }

       
        product.quantity = quantity;
    }

    
    await cart.save();

    return cart;
}


async updateProductQuantityByToken(token, productId, quantity) {
    if (quantity <= 0) throw new Error("La cantidad debe ser mayor a 0");

    const cart = await cartModel.findOne({ token }).populate('products.product');
    if (!cart) throw new Error("Carrito no encontrado");

    console.log("Productos en el carrito:", cart.products);

    const product = cart.products.find((item) => {
        console.log("Comparando:", item.product._id.toString(), "con", productId);
        return item.product._id.toString() === productId;
    });

    if (!product) throw new Error("Producto no encontrado en el carrito");

    product.quantity = quantity;

    await cart.save();

    return cart;
}

    
async deleteProductFromCart(token, productId) {
    const cart = await cartModel.findOne({ token }).populate('products.product');

    if (!cart) {
        throw new Error("Carrito no encontrado");
    }

    const productIndex = cart.products.findIndex(item => item.product._id.toString() === productId);

    if (productIndex === -1) {
        throw new Error("Producto no encontrado en el carrito");
    }

    cart.products.splice(productIndex, 1);

    await cart.save();

    return cart;
}

   

async deleteAllProductsByToken(token) {
    // Buscar el carrito con el token proporcionado
    const cart = await cartModel.findOne({ token });

    if (!cart) {
        throw new Error("Carrito no encontrado");
    }

    // Vaciar el array de productos
    cart.products = [];

    // Guardamos los cambios en el carrito (sin eliminar el carrito)
    await cart.save();

    return { message: "Todos los productos fueron eliminados del carrito exitosamente" };
}
}
