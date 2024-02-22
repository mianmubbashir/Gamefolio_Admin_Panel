const fs = require("fs");
const path = require("path");

// Function to get all music files in the backend/audio folder
const getAllMusicFiles = () => {
  const audioFolderPath = path.join(__dirname, "../audio"); // Adjust the path accordingly

  try {
    // Read the contents of the directory
    const files = fs.readdirSync(audioFolderPath);

    // Filter out non-music files (customize as per your file types)
    const musicFiles = files
      .filter((file) => {
        // Example: Filter for .mp3 files
        return file.endsWith(".mp3");
      })
      .map((file) => file.replace(".mp3", "")); // Remove the .mp3 extension

    return musicFiles;
  } catch (error) {
    console.error("Error reading music files:", error);
    return [];
  }
};

// Updated controller to get all music files and send as an array in the response
const getAllMusic = async (req, res) => {
  try {
    const musicFiles = getAllMusicFiles();
    res
      .status(200)
      .json({ data: musicFiles, message: "Music retrieved successfully" });
  } catch (error) {
    console.error("Error retrieving music:", error);
    res
      .status(500)
      .json({
        error: "Could not retrieve music.",
        message: "Could not retrieve music",
      });
  }
};

module.exports = {
  getAllMusic,
};
