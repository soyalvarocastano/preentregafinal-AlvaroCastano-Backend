import express from "express";
import productsRoutes from "./products/routes/products.routes.js";
import mongoose from "mongoose";
import cartsRoutes from "./carts/routes/carts.router.js";
import handlebars from "express-handlebars"; 
import path from "path"; 

const app = express();
const PORT = 8080;

const DBPATH = "mongodb+srv://alvarocastano:XdVZ6ES6Jb2VshLY@cluster0.8rrfs.mongodb.net/MusicShop?retryWrites=true&w=majority&appName=Cluster0";

// Conectamos la base de datos
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

// Usar import.meta.url para obtener el directorio de las vistas
const viewsPath = path.resolve(new URL(import.meta.url).pathname, '../views');
app.engine("handlebars", handlebars.engine());
app.set('views', viewsPath); // Establecer la carpeta de vistas
app.set('view engine', 'handlebars');

// Usar import.meta.url para obtener el directorio de los archivos estáticos
const publicPath = path.resolve(new URL(import.meta.url).pathname, '../public');
app.use(express.static(publicPath)); // Ruta de los archivos estáticos

// Rutas
app.use("/api/products", productsRoutes);
app.use("/api/carts", cartsRoutes);


// Ruta para la vista home


// Ruta para la vista cart



const httpServer = app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});


 


