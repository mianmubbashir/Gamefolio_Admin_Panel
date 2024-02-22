const Posts = require("../models/Posts.js"); // Import your Mongoose model
const User = require("../models/Users.js");
const jwt = require("jsonwebtoken");

// Create a new post
const postVideo = async (req, res) => {
  try {
    const { userID, title, video, description, game, music } = req.body;
    const newPost = new Posts({
      userID,
      title,
      video,
      description,
      game,
      music,
    });

    const post = await newPost.save();
    const user = await User.findByIdAndUpdate(
      userID,
      {
        $push: { coins: { coinType: "Upload a video", coinAmount: 5 } },
      },
      { new: true }
    );

    res.status(201).json({ data: post, message: "Post created successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Could not create the post.",
      error: "Could not create the post.",
    });
  }
};

// Get all posts
const getAllPostVideos = async (req, res) => {
  try {
    const posts = await Posts.find()
      .sort({ date: -1 }) // Sort posts by their date field in descending order
      .populate("userID")
      .populate({ path: "comments.userID" });
    res
      .status(201)
      .json({ data: posts, message: "Successfully Retrieve Post Videos" });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Could not retrieve posts.",
      message: "Could not retrieve posts.",
    });
  }
};

const getTrendingPosts = async (req, res) => {
  try {
    // Fetch posts with basic details and populate user details
    const posts = await Posts.find()
      .sort({ date: -1 })
      .populate("userID")
      .populate({ path: "comments.userID" });

    // Sort posts by counts and date
    const sortedPosts = posts.sort((a, b) => {
      const getLength = (array) => (array ? array.length : 0);
      const likesDiff = getLength(b.reactions) - getLength(a.reactions);
      const commentsDiff = getLength(b.comments) - getLength(a.comments);
      const bookmarksDiff = getLength(b.bookmarks) - getLength(a.bookmarks);

      if (likesDiff !== 0) return likesDiff;
      if (commentsDiff !== 0) return commentsDiff;
      if (bookmarksDiff !== 0) return bookmarksDiff;

      return b.date - a.date;
    });

    res.status(200).json({
      data: sortedPosts,
      message: "Successfully retrieved trending posts",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Could not retrieve trending posts.",
      message: "Could not retrieve trending posts.",
    });
  }
};

// Get posts from users that the current user is following
const getFollowingPosts = async (req, res) => {
  try {
    // Get the current user's ID (assuming it's available in the request object)
    const { userToken, limit, page } = req.body;
    const decoded = jwt.verify(userToken, process.env.JWT_SECRET); // getting userID from token

    // Find the user document for the current user
    const currentUser = await User.findById(decoded.id);

    if (!currentUser) {
      return res.status(404).json({
        error: "User not found",
        message: "User not found",
      });
    }

    // Get the IDs of users that the current user is following
    const followingIDs = currentUser.following.map((user) => user.userID);

    // Calculate skip value based on pagination
    const skip = limit * (page - 1);

    // Retrieve posts from users that the current user is following
    const posts = await Posts.find({ userID: { $in: followingIDs } })
      .sort({ date: -1 })
      .skip(skip)
      .limit(limit)
      .populate("userID")
      .populate({ path: "comments.userID" });

    console.log("post: ", posts);
    res.status(200).json({
      data: posts,
      message: "Successfully retrieved posts from users you are following",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Could not retrieve following posts.",
      message: "Could not retrieve following posts.",
    });
  }
};

// Get a single post by ID
const getPostById = async (req, res) => {
  try {
    const postId = req.params.id;
    const post = await Posts.findById(postId);
    if (!post) {
      return res.status(404).json({ error: "Post not found." });
    }
    res.status(200).json(post);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Could not retrieve the post." });
  }
};

// Update a post by ID
const updatePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const updatedData = req.body;

    const post = await Posts.findByIdAndUpdate(postId, updatedData, {
      new: true,
    });
    if (!post) {
      return res.status(404).json({ error: "Post not found." });
    }

    res.status(200).json(post);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Could not update the post." });
  }
};

// Delete a post by ID
const deletePost = async (req, res) => {
  try {
    const { postID, userID } = req.body;

    // Find the post and check if the authenticated user is the owner
    const post = await Posts.findById(postID);
    if (!post) {
      return res.status(404).json({
        error: "Post not found.",
        message: "Post not found.",
      });
    }

    // Check if the authenticated user is the owner of the post
    if (post.userID.toString() !== userID) {
      return res.status(403).json({
        error: "Unauthorized",
        message: "You are not authorized to delete this post.",
      });
    }

    // User is authorized, proceed with post deletion
    const deletedPost = await Posts.findByIdAndDelete(postID);

    res.status(200).json({
      data: deletedPost,
      message: "Successfully Video Deleted",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Could not delete the post." });
  }
};

// Create a new reaction for a post
const createVideoReaction = async (req, res) => {
  try {
    const { postID, userID, reactionType } = req.body;

    console.log({ postID, userID, reactionType });

    const post = await Posts.findById(postID);
    if (!post) {
      return res.status(404).json({ error: "Post not found." });
    }

    // Check if the user has already reacted to the post
    const existingReaction = post.reactions.some(
      (reaction) => reaction.userID.toString() === userID.toString()
    );

    if (existingReaction) {
      return res.status(400).json({
        error: "User has already reacted to this post.",
        message: "User has already reacted to this post.",
      });
    }

    const newReaction = {
      userID,
      reactionType,
    };

    post.reactions.push(newReaction);
    const updatedPost = await post.save();
    const user = await User.findByIdAndUpdate(
      userID,
      {
        $push: { coins: { coinType: "Like a video", coinAmount: 1 } },
      },
      { new: true }
    );

    res.status(201).json({
      data: updatedPost,
      message: "Successfully Created Reaction",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Could not create the reaction.",
      message: "Could not create the reaction.",
    });
  }
};

// Delete a reaction by ID
const deleteVideoReaction = async (req, res) => {
  try {
    const { postID, reactionID } = req.body;

    console.log({ postID, reactionID });
    const post = await Posts.findByIdAndUpdate(
      postID,
      { $pull: { reactions: { _id: reactionID } } },
      { new: true }
    );

    console.log("deletepost: ", post);

    if (!post) {
      return res.status(404).json({ error: "Post or Reaction not found." });
    }

    return res
      .status(200)
      .json({ data: post, message: "Successfully Deleted Reaction" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Could not delete the reaction." });
  }
};

// Create a new comment for a post
const createComment = async (req, res) => {
  try {
    const { userID, commentText, postID } = req.body;

    const post = await Posts.findById(postID);
    if (!post) {
      return res
        .status(404)
        .json({ error: "Post not found.", message: "Post not found." });
    }

    const newComment = {
      userID,
      commentText,
    };

    post.comments.push(newComment);
    const updatedPost = await post.save();
    const user = await User.findByIdAndUpdate(
      userID,
      {
        $push: { coins: { coinType: "Comment a video", coinAmount: 2 } },
      },
      { new: true }
    );

    res
      .status(201)
      .json({ data: updatedPost, message: "Successfully Comment Added" });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Could not add the comment.",
      message: "Could not add the comment.",
    });
  }
};

// Create a new share for a post
const createShare = async (req, res) => {
  try {
    const postId = req.params.id;
    const { userID } = req.body;

    const post = await Posts.findById(postId);
    if (!post) {
      return res.status(404).json({ error: "Post not found." });
    }

    const newShare = {
      userID,
    };

    post.share.push(newShare);
    const updatedPost = await post.save();

    res.status(201).json(updatedPost);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Could not create the share." });
  }
};

// Get all reactions for a post
const getAllReactions = async (req, res) => {
  try {
    const postId = req.params.id;
    const post = await Posts.findById(postId);
    if (!post) {
      return res.status(404).json({ error: "Post not found." });
    }

    const reactions = post.reactions;
    res.status(200).json(reactions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Could not retrieve reactions." });
  }
};

// Get all comments for a post
const getAllComments = async (req, res) => {
  try {
    const postId = req.params.id;
    const post = await Posts.findById(postId);
    if (!post) {
      return res.status(404).json({ error: "Post not found." });
    }

    const comments = post.comments;
    res.status(200).json(comments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Could not retrieve comments." });
  }
};

// Get all shares for a post
const getAllShares = async (req, res) => {
  try {
    const postId = req.params.id;
    const post = await Posts.findById(postId);
    if (!post) {
      return res.status(404).json({ error: "Post not found." });
    }

    const shares = post.share;
    res.status(200).json(shares);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Could not retrieve shares." });
  }
};

// Delete a comment by ID
const deleteComment = async (req, res) => {
  try {
    const postId = req.params.id;
    const commentId = req.params.commentId;

    const post = await Posts.findById(postId);
    if (!post) {
      return res.status(404).json({ error: "Post not found." });
    }

    post.comments.id(commentId).remove();
    const updatedPost = await post.save();

    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Could not delete the comment." });
  }
};

// Delete a share by ID
const deleteShare = async (req, res) => {
  try {
    const postId = req.params.id;
    const shareId = req.params.shareId;

    const post = await Posts.findById(postId);
    if (!post) {
      return res.status(404).json({ error: "Post not found." });
    }

    post.share.id(shareId).remove();
    const updatedPost = await post.save();

    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Could not delete the share." });
  }
};

// Update a reaction by ID
const updateReaction = async (req, res) => {
  try {
    const postId = req.params.id;
    const reactionId = req.params.reactionId;
    const { reactionType } = req.body;

    const post = await Posts.findById(postId);
    if (!post) {
      return res.status(404).json({ error: "Post not found." });
    }

    const reactionToUpdate = post.reactions.id(reactionId);
    if (!reactionToUpdate) {
      return res.status(404).json({ error: "Reaction not found." });
    }

    reactionToUpdate.reactionType = reactionType;

    const updatedPost = await post.save();
    res.status(200).json(updatedPost);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Could not update the reaction." });
  }
};

// Update a comment by ID
const updateComment = async (req, res) => {
  try {
    const postId = req.params.id;
    const commentId = req.params.commentId;
    const { commentText } = req.body;

    const post = await Posts.findById(postId);
    if (!post) {
      return res.status(404).json({ error: "Post not found." });
    }

    const commentToUpdate = post.comments.id(commentId);
    if (!commentToUpdate) {
      return res.status(404).json({ error: "Comment not found." });
    }

    commentToUpdate.commentText = commentText;

    const updatedPost = await post.save();
    res.status(200).json(updatedPost);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Could not update the comment." });
  }
};

// Update a share by ID
const updateShare = async (req, res) => {
  try {
    const postId = req.params.id;
    const shareId = req.params.shareId;
    const { userID } = req.body;

    const post = await Posts.findById(postId);
    if (!post) {
      return res.status(404).json({ error: "Post not found." });
    }

    const shareToUpdate = post.share.id(shareId);
    if (!shareToUpdate) {
      return res.status(404).json({ error: "Share not found." });
    }

    shareToUpdate.userID = userID;

    const updatedPost = await post.save();
    res.status(200).json(updatedPost);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Could not update the share." });
  }
};

const addBookmark = async (req, res) => {
  try {
    const { postID, userID, name, username, profilePicture, video } = req.body;

    console.log({ hello: postID, hello: userID });

    const post = await Posts.findById(postID);
    if (!post) {
      return res.status(404).json({ error: "Post not found." });
    }

    // Check if the user has already reacted to the post
    const existingBookmark = post.bookmarks.some(
      (bookmarks) => bookmarks.userID.toString() === userID.toString()
    );

    if (existingBookmark) {
      return res.status(400).json({
        error: "User has already bookmark to this post.",
        message: "User has already bookmark to this post.",
      });
    }

    const newBookmark = {
      userID,
    };

    post.bookmarks.push(newBookmark);
    const updatedPost = await post.save();

    res.status(201).json({
      data: updatedPost,
      message: "Successfully Created Bookmark",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Could not create the Bookmark.",
      message: "Could not create the Bookmark.",
    });
  }
};

const getUserBookmark = async (req, res) => {
  try {
    const { userToken } = req.body;
    const decoded = jwt.verify(userToken, process.env.JWT_SECRET); // getting userID from token

    const userBookmarkedPosts = await Posts.find({
      "bookmarks.userID": decoded.id,
    })
      .populate("userID", "name username profilePicture")
      .populate("comments.userID", "name username profilePicture");

    console.log("userBookmarkedPosts: ", userBookmarkedPosts);

    if (!userBookmarkedPosts || userBookmarkedPosts.length === 0) {
      return res
        .status(404)
        .json({ error: "Bookmarked posts not found for the specified user." });
    }

    const bookmarks = userBookmarkedPosts.map((post) => {
      const bookmarkInfo = post.bookmarks.find(
        (b) => b.userID.toString() === decoded.id
      );
      return {
        post: post,
        bookmarkInfo: bookmarkInfo,
      };
    });

    res.status(200).json({
      data: bookmarks,
      message: "Successfully retrieved bookmarks for the specified user.",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Could not retrieve bookmarks.",
      message: "Could not retrieve bookmarks.",
    });
  }
};
const removeBookmark = async (req, res) => {
  try {
    const { postID, userID, authUserID } = req.body;

    // Check if the authenticated user matches the user who bookmarked the post
    if (authUserID !== userID) {
      return res.status(403).json({
        error: "Permission denied. You can't perform this action.",
        message: "Permission denied. You can't perform this action.",
      });
    }

    const post = await Posts.findById(postID);
    if (!post) {
      return res.status(404).json({ error: "Post not found." });
    }

    // Check if the user has bookmarked the post
    const existingBookmarkIndex = post.bookmarks.findIndex(
      (bookmark) => bookmark.userID.toString() === userID.toString()
    );

    if (existingBookmarkIndex === -1) {
      return res.status(400).json({
        error: "User has not bookmarked this post.",
        message: "User has not bookmarked this post.",
      });
    }

    // Remove the bookmark
    post.bookmarks.splice(existingBookmarkIndex, 1);
    const updatedPost = await post.save();

    res.status(200).json({
      data: updatedPost,
      message: "Successfully Removed Bookmark",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Could not remove the Bookmark.",
      message: "Could not remove the Bookmark.",
    });
  }
};

module.exports = {
  postVideo,
  getAllPostVideos,
  getTrendingPosts,
  getFollowingPosts,
  getPostById,
  updatePost,
  deletePost,
  createVideoReaction,
  deleteVideoReaction,
  createComment,
  createShare,
  getAllReactions,
  getAllComments,
  getAllShares,
  deleteComment,
  deleteShare,
  updateReaction,
  updateComment,
  updateShare,
  addBookmark,
  getUserBookmark,
  removeBookmark,
};
