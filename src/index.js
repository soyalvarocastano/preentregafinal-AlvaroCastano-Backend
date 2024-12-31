import express from "express";
import productsRoutes from "./products/routes/products.routes.js";
import mongoose from "mongoose";
import cartsRoutes from "./carts/routes/carts.router.js";
import handlebars from "express-handlebars"; 
import path from "path"; 
import { getProductsFromDb, getCartFromDb } from "./controller.js";

const app = express();
const PORT = 8080;

const DBPATH = "mongodb+srv://alvarocastano:XdVZ6ES6Jb2VshLY@cluster0.8rrfs.mongodb.net/MusicShop?retryWrites=true&w=majority&appName=Cluster0";

const connectMongoDB = async () => {
    try {
        await mongoose.connect(DBPATH); 
        console.log("Connected to MongoDB");
    } catch (error) {
        console.log("Failed to connect");
    }
};
connectMongoDB();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.engine("handlebars", handlebars.engine());
const viewsPath = path.resolve(new URL(import.meta.url).pathname, './views'); 
app.set('views', viewsPath); 
app.set('view engine', 'handlebars');

const publicPath = path.resolve(new URL(import.meta.url).pathname, './public'); 
app.use(express.static(publicPath)); 
app.use("/api/products", productsRoutes);
app.use("/api/carts", cartsRoutes);


app.get('/home', async (req, res) => {
    try {
        const products = await getProductsFromDb();  
        res.render('home', { products });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error loading products');
    }
});


app.get('/cart', async (req, res) => {
    try {
        const cart = await getCartFromDb();  
        res.render('cart', { cart });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error loading cart');
    }
});


const httpServer = app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});


 


