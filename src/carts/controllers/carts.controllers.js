import CartService from "../carts.service.js";
import { controller } from "../../utils/controllers.js";
import crypto from 'crypto';

const cartService = new CartService();

// Obtener todos los carritos
export const getAllCarts = controller(async (req, res) => {
    const carts = await cartService.getAllCarts("products"); 
    res.status(200).json(carts);
});

export const getAllCartsByToken = controller(async (req, res) => {
    const carts = await cartService.getByToken(req.params.token); 
    res.status(200).json(carts);
});



export const createCart = controller(async (req, res) => {
    const { product_id } = req.body; 
    const newCart = await cartService.create({
        products: [{ product: product_id }], 
        token: crypto.randomBytes(16).toString('hex'), 
    });
    res.status(201).json(newCart);
});



export const getCartById = controller(async (req, res) => {
    const { cid } = req.params;
    const cart = await cartService.getById(cid);
    if (!cart) return res.status(404).send("Carrito no encontrado");
    res.json(cart);
});


export const addProductToCart = controller(async (req, res) => {

    const { token } = req.params; 
    const { product_id, quantity } = req.body; 

    if (!product_id) {
        return res.status(400).json({ error: "El ID del producto es obligatorio" });
    }

    const updatedCart = await cartService.addProductToCartByToken(token, product_id, quantity || 1);
    res.status(200).json(updatedCart); 

});

export const updateCart = async (req, res, next) => {
    const { token } = req.params;
    const { products } = req.body; 
    
    if (!Array.isArray(products)) {
        return res.status(400).json({
            message: 'El formato del cuerpo debe ser un array de productos',
        });
    }

    try {
        const updatedCart = await cartService.updateCartByToken(token, products);

        return res.status(200).json({
            message: 'Carrito actualizado exitosamente',
            cart: updatedCart,
        });
    } catch (error) {
        next(error);
    }
};


export const updateProductQuantity = async (req, res, next) => {
    try {
        const { token, productId } = req.params; 
        const { quantity } = req.body;

        if (!productId) {
            throw new Error("El productId es obligatorio");
        }

        const updatedCart = await cartService.updateProductQuantityByToken(token, productId, quantity);

        res.status(200).json(updatedCart);
    } catch (error) {
        next(error); 
    }
};



export const deleteProductFromCart = async (req, res, next) => {
    const { token, productId } = req.params;

    const updatedCart = await cartService.deleteProductFromCart(token, productId);

    res.status(200).json({
        message: "Producto eliminado exitosamente del carrito",
        cart: updatedCart
    });
};

export const deleteAllProducts = async (req, res, next) => {
    const { token } = req.params;

    try {
        const response = await cartService.deleteAllProductsByToken(token);
        res.status(200).json(response);
    } catch (error) {
        next(error);
    }
};
