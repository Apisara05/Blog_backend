const Post = require("../models/post.model");
const { post } = require("../routers/post.router");

exports.createPost = async (req, res) => {
  try {
    const { title, summary, content, cover, author } = req.body;
    if (!title || !summary || !content || !cover || !author) {
      return res.status(400).json({
        message: "title, summary, content, cover, author are requied!!",
      });
    }

    const post = await Post.create({ title, summary, content, cover, author });
    //เช็คเพราะ จะได้ แกเบัคได้ง่าย ว่าผิดตรงไหน จะได้ไม่ต้องส่งให้ catch หมด
    if (!post) {
      return res.status(500).send({
        message: "Cannot create a new post",
      });
    }
    res.json({
      message: "Post Created Successfully.",
      post,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Server error at method create post", error });
  }
};

exports.getAll = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("author", ["username"])
      .sort({ createdAt: -1 })
      .limit(20);
    //เช็คหน้าบ้าน login
    // if (post.length <= 0) {
    //   res.send("not have post");
    // }
    if (!posts) {
      return res.status(404).send({ message: "Post not found" });
    }
    res.send(posts);
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Server error at method get all", error });
  }
};
exports.getById = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).send({
      message: "Id is missing",
    });
  }
  try {
    const posts = await Post.findById(id)
      .populate("author", ["username"])
      .sort({ createdAt: -1 })
      .limit(20);

    if (!posts) {
      return res.status(404).send({ message: "Post not found" });
    }
    res.send(posts);
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Server error at method get all", error });
  }
};
exports.getByAuthorId = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).send({
      message: "Author ID is missing",
    });
  }
  try {
    const posts = await Post.find({ author: id })
      .populate("author", ["username"])
      .sort({ createdAt: -1 })
      .limit(20);

    if (!posts) {
      return res.status(404).send({ message: "Post not found" });
    }
    res.send(posts);
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Server error at method get all", error });
  }
};

exports.upDatePost = async (req, res) => {

};

exports.DeletePost = async (req,res) => {
    
}
