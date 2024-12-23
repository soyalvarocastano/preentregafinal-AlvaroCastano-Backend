import { cartModel } from "./models/carts.model.js";
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
    
//añadir un nuevo producto por medio del token que me da el carrito que creamos

    async addProductToCart(cartId, productId) {
        const cart = await this.getById(cartId);
        if (!cart) throw new Error("Carrito no encontrado");

        const existingProduct = cart.products.find(
            (item) => item.product.toString() === productId
        );

        if (existingProduct) {
            existingProduct.quantity += 1;
        } else {
            cart.products.push({ product: productId, quantity: 1 });
        }

        return await cart.save();
    }
    
    async deleteProductFromCart(cartId, productId) {
    const cart = await this.getById(cartId); // Obtener el carrito por ID
    if (!cart) throw new Error("Carrito no encontrado");

    const exists = cart.products.some((item) => item.product.equals(productId));
    if (!exists) throw new Error("Producto no encontrado en el carrito");

    cart.products = cart.products.filter((item) => !item.product.equals(productId));

    await cart.save();

    return cart; // Retornar el carrito actualizado
    }

    async updateProductQuantity(cartId, productId, quantity) {
        const cart = await this.getById(cartId);
        if (!cart) throw new Error("Carrito no encontrado");

        // Agrega estos console.log para depurar
        console.log("IDs en el carrito:", cart.products.map(item => item.product.toString()));
        console.log("ID del producto recibido:", productId);

        const product = cart.products.find(
            (item) => item.product.equals(productId)

        );

        if (!product) throw new Error("Producto no encontrado en el carrito");

        product.quantity = quantity;

        return await cart.save();
    }

    // Eliminar todos los productos del carrito
    async deleteAllProducts(cartId) {
        const cart = await this.getById(cartId);
        if (!cart) throw new Error("Carrito no encontrado");

        cart.products = [];

        return await cart.save();
    }
}
