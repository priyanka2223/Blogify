const express = require('express')
const mongoose = require('mongoose')
const app = express()
const cookieParser = require('cookie-parser')
const blogRoute = require('./routes/blog')
const Blog = require("./models/blog")
const PORT = process.env.PORT || 8080
mongoose.connect('mongodb://127.0.0.1:27017/blogify').then(() => console.log("MongoDB connected")).catch((e) => console.log(`Error while connecting to mongodb: ${e}`))

// EJS is one of the most popular template engines for JavaScript. One of the reasons to choose it is that EJS code looks like pure HTML.
// Set EJS as templating engine  

const path = require('path')

// Setting EJS as the Express app view engine. By default, Express will look inside of a views folder when resolving the template files, which is why we had to create a views folder.
app.set('view engine', 'ejs');
app.set('views', path.resolve("./views"))

//cookie-parser is middleware that simplifies handling cookies. It parses incoming cookies from client requests and makes them accessible in the req. cookies object. This makes it easier to read and manipulate cookies in your Express JS application without manual parsing.
app.use(cookieParser())

// To serve static files such as images, CSS files, and JavaScript files, use the express.static built-in middleware function in Express
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
