import { Router } from "express";
import {
    createCart,
    getCartById,
    addProductToCart,
    deleteProductFromCart,
    updateCart,
    updateProductQuantity,
    deleteAllProducts,
    getAllCartsByToken,
    getAllCarts
} from "../controllers/carts.controllers.js";
import { controller } from "../../utils/controllers.js";

const router = Router();

// Ruta para obtener todos los carritos

// Crear un carrito
router.post("/", controller(createCart));
router.get("/", controller(getAllCarts));

// Obtener un carrito por ID
router.get("/:token", controller(getAllCartsByToken));

router.get("/:cid", getCartById);

// Agregar producto al carrito
router.post("/:cid/products/:pid", addProductToCart);

// Eliminar un producto del carrito
router.delete("/:cid/products/:pid", deleteProductFromCart);

// Actualizar el carrito completo
router.put("/:cid", updateCart);

// Actualizar cantidad de un producto en el carrito
router.put("/:cid/products/:pid", updateProductQuantity);

// Eliminar todos los productos del carrito
router.delete("/:cid", deleteAllProducts);

export default router;
