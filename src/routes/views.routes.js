import { Router } from "express";
import ProductManager from "../services/ProductManager.js";


const router = new Router()
const productManager = new ProductManager('/data/products.json')

//ruta para renderizar el home

router.get('/home', async (req,res) =>{
    try {
        const products = await productManager.getAllProducts();
    res.render('home', {products});
    } catch (error) {
        console.error("Error al cargar los productos:", error);
        res.status(500).send("Hubo un error al cargar los productos.");
    }

})

router.get('/realtimeproducts', async (req, res) =>{
    try {
        const products = await productManager.getAllProducts();
        res.render('realTimeProducts', { 
            products,
            title: "Productos en Tiempo Real"
        });
    } catch (error) {
        console.error("Error al cargar los productos:", error);
        res.status(500).send({ error: error.message });
    }
})

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

router.delete('/:pid', async (req, res) => {
    try {
        await productManager.deleteProduct(req.params.pid);
        // Emitimos el evento a todos los clientes conectados
        req.app.get('io').emit('updateProducts', await productManager.getAllProducts());
        res.status(200).json({ message: 'Producto eliminado' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});




export default router;