import express from "express";
import handlebars from "express-handlebars"
import productsRoutes from "./routes/products.routes.js"
import ProductManager from "./services/ProductManager.js";
import cartsRoutes from "./routes/carts.routes.js"
import viewRoutes from "./routes/views.routes.js"
import __dirname from "./utils.js";

import { Server } from "socket.io";

//declaramos express y asigamos el puerto
const app = express();
//configuracion de puerto
const PORT= 8080;

//middlewares de configuracion
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//configuraciones del HBS
app.engine("handlebars", handlebars.engine())
app.set('views', __dirname + '/views')
app.set('view engine', 'handlebars')

//Le indicamos al server que el directorio public es publico
app.use(express.static(__dirname + '/public'))


//crear endpoint

//endpoint de telemetriea
app.get('/ping',(req,res) =>{
    res.render('pong',{})
})

//Routes
app.use("/api/product", productsRoutes)
app.use("/api/carts", cartsRoutes)
app.use("/", viewRoutes)

 
const htppServer = app.listen(PORT, ()=>{
    console.log(`server corriendo en el puerto ${PORT}`);
    
})


//instanciamos socket.io
const socketServer = new Server(htppServer)
app.set('io', socketServer);


// cremamos un canal de comunicacion con el cliente
/* socketServer.on('connection', socket =>{


    socket.broadcast.emit("broadcast", "mensaje para todos")

    socketServer.emit("evento_para_todos", "Evento para todos los sockets")

    //2da parte
    socket.on('mensaje', data =>{
        console.log("recibiendo", data);
        mensajes.push({socketId: socket.id, message: data})

        //enviamos al cliente los logs
        socketServer.emit("logs", {mensajes})
    })
}) */

    socketServer.on('connection', async (socket) => {
        console.log('New client connected');
        
        try {
            // Enviar lista inicial de productos
            const products = await productManager.getAllProducts();
            socket.emit('updateProducts', products);
        
            // Escuchar cuando se agrega o elimina un producto
            socket.on('productAdded', async () => {
                console.log('Producto agregado/eliminado, actualizando lista...'); // Para debug
                try {
                    const updatedProducts = await ProductManager.getAllProducts();
                    socketServer.emit('updateProducts', updatedProducts);
                } catch (error) {
                    console.error('Error al actualizar productos:', error);
                    socket.emit('error', 'Error al actualizar la lista de productos');
                }
            });
        } catch (error) {
            console.error('Error en conexión socket:', error);
            socket.emit('error', 'Error al cargar los productos');
        }
    });



