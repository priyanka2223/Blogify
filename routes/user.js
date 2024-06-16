const express = require('express')
const router = express.Router()
const User = require("../models/user")

router.get("/login", (req, res) => {
    res.render("login")
})
router.get("/signup", (req, res) => {
    res.render("signup")
})

router.get('/logout', (req, res) => {
    res.clearCookie("token").redirect("/")
})

router.post("/login", async(req, res) => {
    const { email, password } = req.body;
    try {
        const token = await User.matchPassword(email, password)
        return res.cookie("token", token).redirect("/")
    }
    catch(err) {
        res.render("login", {
            error: "Incorrect Email or Password"
        })
    }
 })

router.post("/signup", async(req, res) => {
    const result =  await User.create({
        fullName: req.body.fullName,
        email: req.body.email,
        password: req.body.password
    })

    if (!result || result === "null") res.redirect("signup")
    res.redirect("/")
})

module.exports = router