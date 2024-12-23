import { Router } from "express";
import ProductService from "../Products.service.js";
import { controller } from "../../utils/controllers.js";
import { createProduct, deleteProduct, getProductById, getProducts, updateProduct } from "../controllers/products.controllers.js";


const router = Router();
const productService = new ProductService();


  router.get("/", controller(getProducts));

  router.get("/:id", controller(getProductById));

  router.post("/",controller(createProduct));

  router.put("/:id",controller(updateProduct));

  router.delete("/:id", controller(deleteProduct));


export default router;
