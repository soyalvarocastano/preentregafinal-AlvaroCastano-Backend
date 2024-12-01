import { Router } from "express";

import ProductManager from "../services/ProductManager.js";

const router = Router();



const productManager = new ProductManager()



let products =[];

//LISTAR
router.get("/", async (req,res)=>{
    try {
    const limit = req.query.limit ? parent(req.query.limit) : undefined
    const products= await productManager.getAllProducts(limit)
    res.json(products)
    } catch (error) {
       console.log(error);
    }
/* res.send(products) */
})

//LISTAR POR ID
router.get('/:pid', async (req,res) => {
try {
    const productId = parseInt(req.params.pid)
    const product = await productManager.getProductById(productId)

    if(!product){
        return res.status(404).send('Producto no encontrado')
    }

    res.json(product)
} catch (error) {
    console.log(error);
    
}
})

//CREAR
router.post("/", async (req,res)=>{

    try {
        const { title, description, code, price, stock, category, thumbnails} = req.body
        if(!title || !description || !code || !price ||  !stock || !category ){
            return res.status(400).send('Debe enviar todos los datos')}

          const newProduct = await productManager.addProduct({title, description, code, price, status:true, stock, category, thumbnails})

          res.status(202).json(newProduct)
    } catch (error) {
        console.log(error);
        
    }
/* let product= req.body */

//asignamos un id desde nuestro backend
/* const numRandom = Math.floor(Math.random()* 200 + 1)
product.id = numRandom + products.length */

// validamos
/* if(!product.title || !product.description || !product.code || !product.price || !product.status || !product.stock || !product.category ){
    return res.status(400).send('Debe enviar todos los datos')
} */

/* products.push(product)
res.send({status: 'success', msg: "Producto creado"}) */
})

//ACTUALIZAR
 router.put("/:pid", async (req,res)=>{

    try {
        const productId = parseInt(req.params.pid)
        const updateProduct = await productManager.updateProduct(productId, req.body);
        if(updateProduct){
            return res.json(updateProduct)
        } else{
            res.status(404).json({ error: 'Producto no encontrado'})
        }
    
    } catch (error) {
        console.log(error);
        
    }
    /* let productId = parseInt(req.params.productId)
    let productUpdate= req.body
    
    const productPosition = products.findIndex(product => product.id === productId)

    if(productPosition < 0) {
        return res.status(404).send('producto no encontrado')
    }

    products[productPosition]= productUpdate
    
    res.send({status: 'success', msg: "producto actualizado"}) */
    }) 


//ELMINAR
router.delete("/:pid", async (req,res)=>{

    try {
        const productId = parseInt(req.params.pid);
        const deletedProduct = await productManager.deleteProduct(productId)

        if(deletedProduct){
            res.json(deletedProduct)
        } else {
            res.status(404).json({ error: 'producto no encontrado'})
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Error interno del servidor" });   
    }
    /* let productId = parseInt(req.params.productId)
    
    
    const productPosition = products.findIndex(product => product.id === productId)

    if(productPosition < 0) {
        return res.status(404).send('Producto no encontrado')
    }

    //eliminamos al producto de la lista
    products.splice(productPosition, 1)
    
    res.send({status: 'success', msg: "producto eliminado"}) */
    })

export default router;