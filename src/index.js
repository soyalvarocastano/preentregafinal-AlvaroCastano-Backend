import express from "express";
import handlebars from "express-handlebars"
import productsRoutes from "./routes/products.routes.js"
import cartsRoutes from "./routes/carts.routes.js"
import viewRoutes from "./routes/views.routes.js"
import __dirname from "./utils.js";
import { initializeSocket } from "./public/js/socket.js";


const app = express();
const PORT= 8080;


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.engine("handlebars", handlebars.engine())
app.set('views', __dirname + '/views')
app.set('view engine', 'handlebars')

app.use(express.static(__dirname + '/public'))


//Routes
app.use("/api/product", productsRoutes)
app.use("/api/carts", cartsRoutes)
app.use("/", viewRoutes)

const httpServer = app.listen(PORT, ()=>{
    console.log(`server corriendo en el puerto ${PORT}`);
});
const io = initializeSocket(httpServer);


export { io };



 


