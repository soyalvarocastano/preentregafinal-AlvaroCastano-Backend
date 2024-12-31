

import { productModel } from './products/models/product.model.js';
import { cartModel } from './carts/models/carts.model.js';

export async function getProductsFromDb() {
    try {
        return await productModel.find();  
    } catch (error) {
        throw new Error('Error loading products');
    }
}

export async function getCartFromDb() {
    try {
        const cart = await cartModel.findOne({ token: 'sample-token' }).populate('products.product');
        
        
        let totalPrice = 0;
        cart.products.forEach(item => {
            totalPrice += item.product.price * item.quantity;
        });

        return { cart, totalPrice };  
    } catch (error) {
        throw new Error('Error loading cart');
    }
}

