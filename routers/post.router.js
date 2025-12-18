const express = require("express");
const router = express.Router();
const authJwt = require("../middlewares/authJWT.middlewares");
const {
  createPost,
  getAll,
  getById,
  getByAuthorId,
  updateById,
  deleteById,
} = require("../controllers/post.controller");
//http://localhost:5000/api/v1/user/post
router.post("/", createPost);
router.get("/post-all", getAll);
router.get("/:id", getById);
router.get("/author/:id", getByAuthorId);
router.put("/author/:authorId/:id", authJwt.verifyToken, updateById);

router.delete("/:id", deleteById);
module.exports = router;
