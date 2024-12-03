import { Router } from "express";

import ProductManager from "../services/ProductManager.js";
import { io } from "../index.js";

const router = Router();

const productManager = new ProductManager();

let products = [];

//LISTAR
router.get("/", async (req, res) => {
  try {
    const limit = req.query.limit
      ? parseInt(req.query.limit)
      : undefined;
    const products =
      await productManager.getAllProducts(limit);
    res.json(products);
  } catch (error) {
    console.log(error);
  }
  /* res.send(products) */
});

//LISTAR POR ID
router.get("/:pid", async (req, res) => {
  try {
    const productId = parseInt(req.params.pid);
    const product =
      await productManager.getProductById(
        productId
      );

    if (!product) {
      return res
        .status(404)
        .send("Producto no encontrado");
    }

    res.json(product);
  } catch (error) {
    console.log(error);
  }
});

router.post("/", async (req, res) => {
  try {
    const newProduct =
      await productManager.addProduct(req.body)
    
    io.emit('allProducts', req.body);

    res.status(201).json(newProduct);
  } catch (error) {
    console.error(
      "Error en POST /api/product:",
      error
    );
    res
      .status(400)
      .json({ error: error.message });
  }
});

//ACTUALIZAR
router.put("/:pid", async (req, res) => {
  try {
    const productId = parseInt(req.params.pid);
    const updateProduct =
      await productManager.updateProduct(
        productId,
        req.body
      );
    if (updateProduct) {
      return res.json(updateProduct);
    } else {
      res
        .status(404)
        .json({
          error: "Producto no encontrado",
        });
    }
  } catch (error) {
    console.log(error);
  }
});

//ELMINAR
router.delete("/:pid", async (req, res) => {
  try {
    const productId = parseInt(req.params.pid);
    const deletedProduct =
      await productManager.deleteProduct(
        productId
      );

    if (deletedProduct) {
      res.json(deletedProduct);
    } else {
      res
        .status(404)
        .json({
          error: "producto no encontrado",
        });
    }
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({
        error: "Error interno del servidor",
      });
  }
});

export default router;
