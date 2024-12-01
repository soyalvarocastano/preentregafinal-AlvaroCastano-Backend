import express from "express";
import handlebars from "express-handlebars"
import productsRoutes from "./routes/products.routes.js"
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
app.use(express.static(__dirname + './public'))

//ruta de prueba para hbs
app.get('/test-hbs',(req,res) =>{
    const userTest = {
        name: "Francisco",
        last_name: "cuellar",
        age: 28
    }
    res.render("hello", userTest)
})


//crear endpoint

//endpoint de telemetriea
app.get('/ping',(req,res) =>{
    res.send('pong')
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

//