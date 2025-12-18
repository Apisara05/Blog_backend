const PostModel = require("../models/post.model");
const Post = require("../models/post.model");
const { post } = require("../routers/post.router");

exports.createPost = async (req, res) => {
  try {
    const { title, summary, content, cover } = req.body;
    const authorId = req.authorId;

    if (!title || !summary || !content || !cover) {
      return res.status(400).json({
        message: "title, summary, content, cover, author are requied!!",
      });
    }

    const post = await Post.create({
      title,
      summary,
      content,
      cover,
      author: authorId,
    });
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
      .send({ message: "Server error at method get all", error });
  }
};
exports.updateById = async (req, res) => {
  try {
    const { id, authorId } = req.params;
    if (!id || !authorId) {
      return res.status(400).json({ message: "id and authorId are required!" });
    }

    const { title, summary, content, cover } = req.body;
    // ถ้า “ไม่มีค่าเลยสัก field เดียว” → ให้ error
    if (!title || !summary || !content || !cover) {
      return res.status(400).json({ message: "at all field is required" });
    }

    const updated = await Post.findOneAndUpdate(
      { _id: id, author: authorId },
      { title, summary, content, cover },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Post not found" });
    }

    res.json({ message: "Post Updated Successfully!" });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Server error at update by id", error: error });
  }
};
exports.patchById = async (req, res) => {
  try {
    const { id } = req.params;
    const authorId = req.authorId;

    if (!id) {
      return res.status(400).json({ message: "id is required!" });
    }

    const { title, summary, content, cover } = req.body;
    // ถ้า “ไม่มีค่าเลยสัก field เดียว” → ให้ error
    if (!title && !summary && !content && !cover) {
      return res
        .status(400)
        .json({ message: "at least one field is required" });
    }

    const updated = await Post.findOneAndUpdate(
      { _id: id },
      { title, summary, content, cover, author: authorId },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Post not found" });
    }

    res.json({ message: "Patch Updated Successfully!", result: updated });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Server error at update by id", error: error });
  }
};

exports.deleteById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "id is required!" });
    }
    const { author } = req.body;
    if (!author) {
      return res.status(400).json({ message: "author d is missing" });
    }

    const deleted = await Post.findOneAndDelete({ _id: id, author });
    if (!deleted) {
      return res.status(500).json({ message: "Can't Delete The Post" });
    }

    res.json({ message: "Post Deleted Successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Server error at delete by id" });
  }
};
