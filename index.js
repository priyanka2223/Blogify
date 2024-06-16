const express = require('express')
const mongoose = require('mongoose')
const app = express()
const cookieParser = require('cookie-parser')
const blogRoute = require('./routes/blog')
const Blog = require("./models/blog")
const PORT = process.env.PORT || 8080
mongoose.connect('mongodb://127.0.0.1:27017/blogify').then(() => console.log("MongoDB connected")).catch((e) => console.log(`Error while connecting to mongodb: ${e}`))

// Set EJS as templating engine 
const path = require('path')
app.set('view engine', 'ejs');
app.set('views', path.resolve("./views"))
app.use(cookieParser())

// to load blog images in home page
app.use('/public/uploads', express.static(path.join(__dirname, '/public/uploads')))

//middleware to read form data
app.use(express.urlencoded({ extended: false }))

const { checkForAuthenticationCookie } = require('./middlewares/authentication')
app.use(checkForAuthenticationCookie('token'))

const userRoute = require('./routes/user')
app.get("/", async(req, res) => {
    const allblogs = await Blog.find({})
    res.render("home", {
        user: req.user,
        blogs: allblogs
    })
})
app.use("/user", userRoute)
app.use("/blog", blogRoute)

app.listen(PORT, () => console.log(`Server started at port: ${PORT}`))