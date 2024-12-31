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


router.post("/", controller(createCart));
router.get("/", controller(getAllCarts));

router.get("/:token", controller(getAllCartsByToken));

router.get("/:cid", getCartById);

router.post("/:token/products", addProductToCart);

router.delete("/:token/products/:productId", deleteProductFromCart);

router.put("/:token", updateCart);

router.put("/:token/products/:productId", updateProductQuantity);


router.delete("/:token", deleteAllProducts);

export default router;
