import { Router } from "express";
const router = new Router()

let food = [
    {name: "hamburguesa", price: "10$"},
    {name: "perro", price: "5$"},
    {name: "salchipapa", price: "13$"},
    {name: "chuzo", price: "13$"},
    {name: "pizza", price: "8$"},
]


router.get("/food", (req,res) => {
    let userData = {
        name: "jesus",
        last_name: "gonzales",
        role: "admin"
    }

    res.render("food", {
        user: userData,
        isAdmin: userData.role == 'admin', 
        food
    })
})

let users = [
    {
        name: "alvaro",
        last_name: "castaño",
        age: "25",
        phone: "229283762",
        Email: "correoalvaro@gmail.com"

    },
    {
        name: "marisol",
        last_name: "bernal",
        age: "28",
        phone: "463574",
        Email: "correomarisol@gmail.com"

    },
    {
        name: "maria",
        last_name: "brito",
        age: "30",
        phone: "7582892",
        Email: "correomaria@gmail.com"

    }
]

router.get("/user", (req,res) => {
    const random = Math.floor(Math.random()*users.length)
    res.render('user', {user: users[random]})
})

export default router;