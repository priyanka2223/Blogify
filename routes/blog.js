const express = require('express')
const router = express.Router()
const multer = require('multer')
const path = require('path')
const Blog = require("../models/blog")
const Comment = require("../models/comment")
const User = require('../models/user')

//to upload cover image
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.resolve(`./public/uploads/`))
    },
    filename: function (req, file, cb) {
      const fileName = `${Date.now()}-${file.originalname}`;
      cb(null, fileName)
    }
  })
  
const upload = multer({ storage: storage })

router.get("/addblog", (req, res) => {
    res.render("addblog", {
        user: req.user
    })
})

router.get("/:id", async (req, res) => {
  const allusers = await User.find({})
  const bloginfo = await Blog.findById(req.params.id)
  const comments = await Comment.find({ blogId: bloginfo._id})
  res.render("blog", {
      user: req.user,
      bloginfo: bloginfo,
      comments: comments,
      allusers: allusers
  })
})

router.post("/addblog", upload.single("coverImage"), async(req, res) => {
    const { title, body } = req.body
    const result =  await Blog.create({
        title,
        body,
        createdBy: req.user._id,
        coverImage: `./public/uploads/${req.file.filename}`
    })

    if (!result || result === "null") res.redirect("addblog")
    res.redirect("/")
})

router.post("/comment/:blogId", async(req, res) => {
  await Comment.create({
      content: req.body.content,
      blogId: req.params.blogId,
      createdBy: req.user._id
  })

  return res.redirect(`/blog/${req.params.blogId}`)
})

module.exports = router
