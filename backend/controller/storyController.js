const Story = require("../models/Story.js");
const jwt = require("jsonwebtoken"); // Import your Mongoose model
const User = require("../models/Users.js");

// Create a new story
const postStory = async (req, res) => {
  try {
    const { userID, title, video, description, game, music } = req.body;
    const newStory = new Story({
      userID,
      title,
      video,
      description,
      game,
      music,
    });

    const story = await newStory.save();

    res
      .status(201)
      .json({ data: story, message: "Story created successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Could not create the story.",
      error: "Could not create the story.",
    });
  }
};

// Controller function to get all stories of a specific user
const getUserAllStories = async (req, res) => {
  const userID = req.body.userID; // Assuming userId is passed in the URL params

  console.log("userID: ", userID);

  try {
    // Fetch all stories for the specified user ID
    const userStories = await Story.find({ userID: userID }).populate("userID"); // Assuming userID in Story model refers to User model

    if (!userStories) {
      return res.status(404).json({
        message: "No stories found for this user.",
        error: "No stories found for this user.",
      });
    }

    res
      .status(200)
      .json({ data: userStories, message: "Successfully Fetched Stories" });
  } catch (error) {
    res.status(500).json({
      message: "Server error. Failed to fetch stories.",
      error: error.message,
    });
  }
};

// Get all stories
const getAllStories = async (req, res) => {
  try {
    const stories = await Story.find()
      .sort({ date: -1 }) // Sort stories by their date field in descending order
      .populate("userID");

    function getUniqueUserData(data) {
      const uniqueUsers = {};

      data.forEach((item) => {
        const userId = item.userID._id.toString();
        if (!uniqueUsers[userId]) {
          uniqueUsers[userId] = item;
        }
      });

      return Object.values(uniqueUsers);
    }

    const uniqueStories = getUniqueUserData(stories);

    res.status(201).json({
      data: uniqueStories,
      message: "Successfully Retrieve Stories",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Could not retrieve stories.",
      message: "Could not retrieve stories.",
    });
  }
};

// Controller function to get stories from users that the current user is following
const getFollowingStories = async (req, res) => {
  try {
    // Get the current user's ID (assuming it's available in the request object)
    const { userToken } = req.body;
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

    // Retrieve stories from users that the current user is following
    const stories = await Story.find({ userID: { $in: followingIDs } })
      .sort({ date: -1 })
      .populate("userID");
    res.status(200).json({
      data: stories,
      message: "Successfully retrieved stories from users you are following",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Could not retrieve following stories.",
      message: "Could not retrieve following stories.",
    });
  }
};

// Controller function to get the latest story of the current user
const getCurrentUserStories = async (req, res) => {
  try {
    // Get the current user's ID (assuming it's available in the request object)
    const { userToken } = req.body;
    const decoded = jwt.verify(userToken, process.env.JWT_SECRET); // getting userID from token

    // Find the user document for the current user
    const currentUser = await User.findById(decoded.id);

    if (!currentUser) {
      return res.status(404).json({
        error: "User not found",
        message: "User not found",
      });
    }

    // Retrieve the latest story for the current user and wrap it in an array
    const userLatestStory = [
      await Story.findOne({
        userID: currentUser._id,
      })
        .sort({ date: -1 })
        .populate("userID"),
    ];

    if (!userLatestStory[0]) {
      return res.status(404).json({
        message: "No stories found for this user.",
        error: "No stories found for this user.",
      });
    }

    res.status(200).json({
      data: userLatestStory,
      message: "Successfully retrieved the latest story of the current user",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Could not retrieve the current user's latest story.",
      message: "Could not retrieve the current user's latest story.",
    });
  }
};

// Get a single post by ID
const getPostById = async (req, res) => {
  try {
    const postId = req.params.id;
    const post = await Story.findById(postId);
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

    const post = await Story.findByIdAndUpdate(postId, updatedData, {
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
    const { postID } = req.body;
    console.log("pID: ", postID);
    const post = await Story.findByIdAndDelete(postID);
    if (!post) {
      return res
        .status(404)
        .json({ error: "Post not found.", message: "Post not found." });
    }

    res.status(200).json({ data: post, message: "Successfully Video Deleted" });
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

    const post = await Story.findById(postID);
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
    const post = await Story.findByIdAndUpdate(
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

    const post = await Story.findById(postID);
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

    const post = await Story.findById(postId);
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
    const post = await Story.findById(postId);
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
    const post = await Story.findById(postId);
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
    const post = await Story.findById(postId);
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

    const post = await Story.findById(postId);
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

    const post = await Story.findById(postId);
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

    const post = await Story.findById(postId);
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

    const post = await Story.findById(postId);
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

    const post = await Story.findById(postId);
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

module.exports = {
  postStory,
  getUserAllStories,
  getAllStories,
  getFollowingStories,
  getCurrentUserStories,
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
};
