import CartService from "../carts.service.js";
import { controller } from "../../utils/controllers.js";
import crypto from 'crypto';

const cartService = new CartService();

// Obtener todos los carritos
export const getAllCarts = controller(async (req, res) => {
    const carts = await cartService.getAllCarts("products"); // Ajusta si es necesario
    res.status(200).json(carts);
});

export const getAllCartsByToken = controller(async (req, res) => {
    const carts = await cartService.getByToken(req.params.token); // Ajusta si es necesario
    res.status(200).json(carts);
});


// Crear un carrito nuevo
export const createCart = controller(async (req, res) => {
    const {product_id} = req.body
    const newCart = await cartService.create({product_id, token: crypto.randomBytes(16).toString('hex')});
    res.status(201).json(newCart);
});

// Obtener productos del carrito
export const getCartById = controller(async (req, res) => {
    const { cid } = req.params;
    const cart = await cartService.getById(cid);
    if (!cart) return res.status(404).send("Carrito no encontrado");
    res.json(cart);
});

// Agregar producto al carrito
export const addProductToCart = controller(async (req, res) => {
    const { cid, pid } = req.params;
    const updatedCart = await cartService.addProductToCart(cid, pid);
    res.json(updatedCart);
});

// Eliminar producto específico del carrito
export const deleteProductFromCart = controller(async (req, res) => {
    const { cid, pid } = req.params; // Extraer los parámetros de la URL (carrito y producto)
    const updatedCart = await cartService.deleteProductFromCart(cid, pid); // Llamar al servicio para eliminar el producto
    res.json(updatedCart); // Responder con el carrito actualizado
});

// Actualizar carrito completo
export const updateCart = controller(async (req, res) => {
    const { cid } = req.params;
    const { products } = req.body;
    const updatedCart = await cartService.update(cid, { products });
    res.json(updatedCart);
});

// Actualizar cantidad de un producto
export const updateProductQuantity = controller(async (req, res) => {
    const { cid, pid } = req.params;
    const { quantity } = req.body;

    if (typeof quantity !== 'number' || quantity <= 0) {
        return res.status(400).json({ error: "La cantidad debe ser un número mayor a 0" });
    }

    const updatedCart = await cartService.updateProductQuantity(cid, pid, quantity);
    res.json(updatedCart);
});

// Eliminar todos los productos del carrito
export const deleteAllProducts = controller(async (req, res) => {
    const { cid } = req.params;
    const updatedCart = await cartService.deleteAllProducts(cid);
    res.json(updatedCart);
});
