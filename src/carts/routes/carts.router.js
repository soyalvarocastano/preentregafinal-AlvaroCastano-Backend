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
router.post("/:token/products", addProductToCart);

// Eliminar un producto del carrito
router.delete("/:token/products/:productId", deleteProductFromCart);

// Actualizar el carrito completo
router.put("/:token", updateCart);

// Actualizar cantidad de un producto en el carrito
router.put("/:token/products/:productId", updateProductQuantity);

// Eliminar todos los productos del carrito
router.delete("/:token", deleteAllProducts);

export default router;
