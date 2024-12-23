import ProductService from "../Products.service.js";

const productService = new ProductService();

export async function getProducts(req, res) {
  const result = await productService.getAllProducts(
    req.query
  );

  res.json(result);
}

export async function getProductById(req, res) {
  const { id } = req.params;
  const product = await productService.getById(
    id
  );
  res.send(product);
}

export async function createProduct(req, res) {
  const {
    title,
    description,
    code,
    price,
    status,
    stock,
    category,
  } = req.body;
  const productData = {
    title,
    description,
    code,
    price,
    status,
    stock,
    category,
  };

  const newProduct = await productService.create(
    productData
  );
  res
    .status(201)
    .send({
      result: "success",
      payload: newProduct,
    });
}

export async function updateProduct(req, res) {
  const { id } = req.params;
  const productUpdate = req.body;

  const updatedProduct =
    await productService.update(
      id,
      productUpdate
    );
  res.send({
    result: "success",
    payload: updatedProduct,
  });
}

export async function deleteProduct(req, res) {
  const { id } = req.params;

  const deletedProduct =
    await productService.delete(id);
  res.send({
    result: "success",
    payload: deletedProduct,
  });
}
