const Clips = require("../models/Clips.js"); // Import your Mongoose model

// Create a new clip
const createClip = async (req, res) => {
  try {
    const { userID, title, video, description, game, music } = req.body;
    const newClip = new Clips({
      userID,
      title,
      video,
      description,
      game,
      music,
    });

    const clip = await newClip.save();

    res.status(201).json({ data: clip, message: "Clip created successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Could not create the clip.",
      error: "Could not create the clip.",
    });
  }
};

// Get all clips
const getAllClipVideos = async (req, res) => {
  try {
    const clips = await Clips.find()
      .sort({ date: -1 }) // Sort clips by their date field in descending order
      .populate("userID");
    res
      .status(201)
      .json({ data: clips, message: "Successfully Retrieve Clips" });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Could not retrieve clips.",
      message: "Could not retrieve clips.",
    });
  }
};

// Get a single clip by ID
const getClipById = async (req, res) => {
  try {
    const clipId = req.params.id;
    const clip = await Clips.findById(clipId);
    if (!clip) {
      return res.status(404).json({ error: "Clip not found." });
    }
    res.status(200).json(clip);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Could not retrieve the clip." });
  }
};

// Update a clip by ID
const updateClips = async (req, res) => {
  try {
    const clipId = req.params.id;
    const updatedData = req.body;

    const clip = await Clips.findByIdAndUpdate(clipId, updatedData, {
      new: true,
    });
    if (!clip) {
      return res.status(404).json({ error: "Clip not found." });
    }

    res.status(200).json(clip);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Could not update the clip." });
  }
};

// Delete a clip by ID
const deleteClip = async (req, res) => {
  try {
    const { clipID } = req.body;
    console.log("pID: ", clipID);
    const clip = await Clips.findByIdAndDelete(clipID);
    if (!clip) {
      return res
        .status(404)
        .json({ error: "Clip not found.", message: "Clip not found." });
    }

    res.status(200).json({ data: clip, message: "Successfully Clip Deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Could not delete the clip." });
  }
};

// Create a new reaction for a clip
const createClipReaction = async (req, res) => {
  try {
    const { clipID, userID, reactionType } = req.body;
    console.log({ clipID, userID, reactionType });

    const clip = await Clips.findById(clipID);
    if (!clip) {
      return res.status(404).json({ error: "Clip not found." });
    }

    // Check if the user has already reacted to the post
    const existingReaction = clip.reactions.some(
      (reaction) => reaction.userID.toString() === userID.toString()
    );

    if (existingReaction) {
      return res.status(400).json({
        error: "User has already reacted to this clip.",
        message: "User has already reacted to this clip.",
      });
    }

    const newReaction = {
      userID,
      reactionType,
    };

    clip.reactions.push(newReaction);
    const updatedClip = await clip.save();

    res.status(201).json({
      data: updatedClip,
      message: "Successfully Created Clip Reaction",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Could not create the clip reaction.",
      message: "Could not create the clip reaction.",
    });
  }
};

// Delete a reaction by ID
const deleteClipReaction = async (req, res) => {
  try {
    const { clipID, reactionID } = req.body;

    console.log({ clipID, reactionID });
    const clip = await Clips.findByIdAndUpdate(
      clipID,
      { $pull: { reactions: { _id: reactionID } } },
      { new: true }
    );

    console.log("deleteclipreaction: ", clip);

    if (!clip) {
      return res.status(404).json({ error: "Clip or Reaction not found." });
    }

    return res
      .status(200)
      .json({ data: clip, message: "Successfully Deleted Clip Reaction" });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: "Could not delete the clip reaction." });
  }
};

// Create a new comment for a clip
const createClipComment = async (req, res) => {
  try {
    const { userID, commentText, clipID } = req.body;

    const clip = await Clips.findById(clipID);
    if (!clip) {
      return res
        .status(404)
        .json({ error: "Clip not found.", message: "Clip not found." });
    }

    const newComment = {
      userID,
      commentText,
    };

    clip.comments.push(newComment);
    const updatedClip = await clip.save();

    res
      .status(201)
      .json({ data: updatedClip, message: "Successfully Clip Comment Added" });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Could not add the clip comment.",
      message: "Could not add the clip comment.",
    });
  }
};

// Create a new share for a clip
const createShare = async (req, res) => {
  try {
    const clipId = req.params.id;
    const { userID } = req.body;

    const clip = await Clips.findById(clipId);
    if (!clip) {
      return res.status(404).json({ error: "Clip not found." });
    }

    const newShare = {
      userID,
    };

    clip.share.push(newShare);
    const updatedClip = await clip.save();

    res.status(201).json(updatedClip);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Could not create the clip share." });
  }
};

// Get all reactions for a clip
const getAllClipReactions = async (req, res) => {
  try {
    const clipId = req.params.id;
    const clip = await Clips.findById(clipId);
    if (!clip) {
      return res.status(404).json({ error: "Clip not found." });
    }

    const reactions = clip.reactions;
    res.status(200).json(reactions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Could not retrieve clip reactions." });
  }
};

// Get all comments for a clip
const getAllClipComments = async (req, res) => {
  try {
    const clipId = req.params.id;
    const clip = await Clips.findById(clipId);
    if (!clip) {
      return res.status(404).json({ error: "Clip not found." });
    }

    const comments = clip.comments;
    res.status(200).json(comments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Could not retrieve clip comments." });
  }
};

// Get all shares for a clip
const getAllShares = async (req, res) => {
  try {
    const clipId = req.params.id;
    const clip = await Clips.findById(clipId);
    if (!clip) {
      return res.status(404).json({ error: "Clip not found." });
    }

    const shares = clip.share;
    res.status(200).json(shares);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Could not retrieve shares." });
  }
};

// Delete a comment by ID
const deleteComment = async (req, res) => {
  try {
    const clipId = req.params.id;
    const commentId = req.params.commentId;

    const clip = await Clips.findById(clipId);
    if (!clip) {
      return res.status(404).json({ error: "Clip not found." });
    }

    clip.comments.id(commentId).remove();
    const updatedClip = await clip.save();

    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Could not delete the comment." });
  }
};

// Delete a share by ID
const deleteShare = async (req, res) => {
  try {
    const clipId = req.params.id;
    const shareId = req.params.shareId;

    const clip = await Clips.findById(clipId);
    if (!clip) {
      return res.status(404).json({ error: "clip not found." });
    }

    clip.share.id(shareId).remove();
    const updatedClip = await clip.save();

    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Could not delete the share." });
  }
};

// Update a reaction by ID
const updateReaction = async (req, res) => {
  try {
    const clipId = req.params.id;
    const reactionId = req.params.reactionId;
    const { reactionType } = req.body;

    const clip = await Clips.findById(clipId);
    if (!clip) {
      return res.status(404).json({ error: "Clip not found." });
    }

    const reactionToUpdate = clip.reactions.id(reactionId);
    if (!reactionToUpdate) {
      return res.status(404).json({ error: "Reaction not found." });
    }

    reactionToUpdate.reactionType = reactionType;

    const updatedClip = await clip.save();
    res.status(200).json(updatedClip);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Could not update the reaction." });
  }
};

// Update a comment by ID
const updateComment = async (req, res) => {
  try {
    const clipId = req.params.id;
    const commentId = req.params.commentId;
    const { commentText } = req.body;

    const clip = await Clips.findById(clipId);
    if (!clip) {
      return res.status(404).json({ error: "Clip not found." });
    }

    const commentToUpdate = clip.comments.id(commentId);
    if (!commentToUpdate) {
      return res.status(404).json({ error: "Comment not found." });
    }

    commentToUpdate.commentText = commentText;

    const updatedClip = await clip.save();
    res.status(200).json(updatedClip);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Could not update the comment." });
  }
};

// Update a share by ID
const updateShare = async (req, res) => {
  try {
    const clipId = req.params.id;
    const shareId = req.params.shareId;
    const { userID } = req.body;

    const clip = await Clips.findById(clipId);
    if (!clip) {
      return res.status(404).json({ error: "Clip not found." });
    }

    const shareToUpdate = clip.share.id(shareId);
    if (!shareToUpdate) {
      return res.status(404).json({ error: "Share not found." });
    }

    shareToUpdate.userID = userID;

    const updatedClip = await clip.save();
    res.status(200).json(updatedClip);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Could not update the share." });
  }
};

module.exports = {
  createClip,
  getAllClipVideos,
  getClipById,
  updateClips,
  deleteClip,
  createClipReaction,
  deleteClipReaction,
  createClipComment,
  createShare,
  getAllClipReactions,
  getAllClipComments,
  getAllShares,
  deleteComment,
  deleteShare,
  updateReaction,
  updateComment,
  updateShare,
};
