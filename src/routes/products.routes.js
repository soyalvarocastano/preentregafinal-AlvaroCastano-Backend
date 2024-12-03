import { Router } from "express";

import ProductManager from "../services/ProductManager.js";

const router = Router();



const productManager = new ProductManager()



let products =[];

//LISTAR
router.get("/", async (req,res)=>{
    try {
    const limit = req.query.limit ? parseInt(req.query.limit) : undefined
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
/* router.post("/", async (req,res)=>{

    try {
        const { title, description, code, price, stock, category, thumbnails} = req.body
        if(!title || !description || !code || !price ||  !stock || !category ){
            return res.status(400).send('Debe enviar todos los datos')}

          const newProduct = await productManager.addProduct({title, description, code, price, status:true, stock, category, thumbnails})

          res.status(202).json(newProduct)
    } catch (error) {
        console.log(error);
        
    }
}) */

    router.post('/', async (req, res) => {
        try {
            console.log('Datos recibidos en POST:', req.body);
            const newProduct = await productManager.addProduct(req.body);
            console.log('Producto creado:', newProduct);
            
            // Obtener todos los productos actualizados
            const updatedProducts = await productManager.getAllProducts();
            
            // Emitir el evento de actualización
            const io = req.app.get('io');
            io.emit('updateProducts', updatedProducts);
            
            res.status(201).json(newProduct);
        } catch (error) {
            console.error('Error en POST /api/product:', error);
            res.status(400).json({ error: error.message });
        }
    });

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
    })

export default router;