// Section 5 video 25
const express = require("express"); // we need express to use routers

const router = express.Router();

const { check, validationResult } = require("express-validator/check");

const auth = require("../../middleware/auth");

// need Profile and User models too b/c you can't have a post with a user and a user needs a profile
// we need them to get the name, avatar and user itself as these are fields in the PostSchema
const Post = require("../../models/Post");
const Profile = require("../../models/Profile");
const User = require("../../models/User");

// @route   POST api/posts
// @desc    Create a post
// @access  Private
router.post(
  "/",
  [
    auth,
    [
      check("text", "Text is required")
        .not()
        .isEmpty()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array()
      });
    }

    try {
      // we are logged in at this point so we have the json webtoken in the request
      const user = await User.findById(req.user.id).select("-password");

      // take info from request or user const to fill in a Post object called newPost
      const newPost = new Post({
        text: req.body.text,
        name: user.name,
        avatar: user.avatar,
        user: req.user.id // this is an ID field, that's why you don't use the user variable above (b/c that is the whole User object)
      });

      // save the Post object
      const post = await newPost.save();

      // show the Post object in JSON format in Postman
      res.json(post);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);

// @route   GET api/posts
// @desc    Get all post
// @access  Private (is private b/c can't see posts page unless ur logged in)

router.get("/", auth, async (req, res) => {
  try {
    // we use sort() and pass in date to sort by date. We want most recent first so we put -1
    const posts = await Post.find().sort({ date: -1 });
    res.json(posts);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route   GET api/posts/:id
// @desc    Get post by Post ID
// @access  Private (is private b/c can't see posts page unless ur logged in)

router.get("/:id", auth, async (req, res) => {
  try {
    // req.params.id is the post ID from the URL (:id)
    const post = await Post.findById(req.params.id);

    // See if there's a post with that ID and if not return a 404 error
    if (!post) {
      res.status(404).json({ msg: "Post not found" });
    }
    res.json(post);
  } catch (err) {
    console.error(err.message);

    // this is for if the ObjectID of Post object has too many or too little characters
    if (err.kind == "ObjectId") {
      res.status(404).json({ msg: "Post not found" });
    }
    res.status(500).send("Server Error");
  }
});

// @route   DELETE api/posts/:id
// @desc    Delete post by Post ID
// @access  Private (is private b/c can't see posts page unless ur logged in)

router.delete("/:id", auth, async (req, res) => {
  try {
    // we use sort() and pass in date to sort by date. We want most recent first so we put -1
    const post = await Post.findById(req.params.id);

    if (!post) {
      res.status(404).json({ msg: "Post not found" });
    }

    // Check user
    // since req.user.is is a string and post.user is a number, you must convert post.user to a string to compare them
    // If the ID of the user on this post is not the one that is logged in(determined by json webtoken sent on the request), return a 401 error
    if (post.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: "User not authorized" });
    }

    await post.remove();

    res.json({ msg: "Post removed" });
  } catch (err) {
    console.error(err.message);
    if (err.kind == "ObjectId") {
      res.status(404).json({ msg: "Post not found" });
    }
    res.status(500).send("Server Error");
  }
});

// it is PUT b/c we are updating a post with likes
// @route   PUT api/posts/like/:id
// @desc    Like a post (using Post ID)
// @access  Private
router.put("/like/:id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    // Check if the post has already been liked
    // The Post object has a "likes" fields which is an array. We access it by post.likes
    // Then we run the filter method on it to go throught the array
    // "like" is the variable that hold the current user ID on the current element in the like array
    // "like.user" gives us the current user ID and we turn it to a string with toString()
    // We check if that user ID is equal to the user ID that came in with the request (the currently logged in user's ID)
    // If the ID of the user that is already logged in is in the likes array that means this user already liked this post, so we return a 400 error
    // If the length is greater than 0, that means w already liked it
    if (
      post.likes.filter(like => like.user.toString() === req.user.id).length > 0
    ) {
      return res.status(400).json({ msg: "Post already liked" });
    }

    // if the user has not liked this post, add their id to the likes array (so they can like it)
    // we use unshift() so that like appears at the top (is most recent)
    post.likes.unshift({ user: req.user.id });

    await post.save();
    res.json(post.likes);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// it is PUT b/c we are updating a post with likes
// @route   PUT api/posts/unlike/:id
// @desc    Delete like from a post (using Post ID)
// @access  Private
router.put("/unlike/:id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    // Check if the post has not yet been liked
    // The Post object has a "likes" fields which is an array. We access it by post.likes
    // Then we run the filter method on it to go throught the array
    // "like" is the variable that hold the current user ID on the current element in the like array
    // "like.user" gives us the current user ID and we turn it to a string with toString()
    // We check if that user ID is equal to the user ID that came in with the request (the currently logged in user's ID)
    // If the ID of the user that is already logged in is in the likes array that means this user already liked this post, so we return a 400 error
    // If the length is 0, that means we have not liked this post yet
    if (
      post.likes.filter(like => like.user.toString() === req.user.id).length ===
      0
    ) {
      return res.status(400).json({ msg: "Post has not yet been liked" });
    }

    // Get remove index to remove like from likes array (remove the user ID from the likes array)
    // use map() to go through likes array and indexOf() to select the user ID yiu are looking for
    const removeIndex = post.likes.map(like =>
      like.user.toString().indexOf(req.user.id)
    );

    post.likes.splice(removeIndex, 1);

    await post.save();
    res.json(post.likes);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route   POST api/posts/comment/:id
// @desc    Add a comment
// @access  Private
router.post(
  "/comment/:id",
  [
    auth,
    [
      check("text", "Text is required")
        .not()
        .isEmpty()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array()
      });
    }

    try {
      // we are logged in at this point so we have the json webtoken in the request
      const user = await User.findById(req.user.id).select("-password");

      // Get the post
      const post = await Post.findById(req.params.id);

      // take info from request or user const to fill in a Post object called newPost
      const newComment = {
        text: req.body.text,
        name: user.name,
        avatar: user.avatar,
        user: req.user.id // this is an ID field, that's why you don't use the user variable above (b/c that is the whole User object)
      };

      post.comments.unshift(newComment);

      // save the Post object
      await post.save();

      // send back all the comments in JSON format
      res.json(post.comments);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);

// need post ID and comment ID b/c we have to find the post by ID and then the comment to delete on that post
// @route   DELETE api/posts/comment/:id/:comment_id
// @desc    Delete a comment from a post
// @access  Private
router.delete("/comment/:id/:comment_id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    // Pull out comment
    const comment = post.comments.find(
      comment => comment.id === req.params.comment_id
    );

    if (!comment) {
      return res.status(404).json({ msg: "Comment does not exist" });
    }

    if (comment.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: "User not authorized" });
    }

    const removeIndex = post.comments.map(comment =>
      comment.user.toString().indexOf(req.user.id)
    );

    post.comments.splice(removeIndex, 1);

    await post.save();
    res.json(post.comments);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// we have to export the router in order for server.js to pick it up
module.exports = router;

// test out this URL in the browser to see if you get the JSON message http://localhost:5000/api/users/test
