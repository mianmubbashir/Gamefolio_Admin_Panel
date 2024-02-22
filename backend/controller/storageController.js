const AWS = require("aws-sdk");
const fs = require("fs");
const ffmpegPath = require("@ffmpeg-installer/ffmpeg").path;
const ffmpeg = require("fluent-ffmpeg");
ffmpeg.setFfmpegPath(ffmpegPath);
var ffprobe = require("ffprobe-static");
ffmpeg.setFfprobePath(ffprobe.path);
const { v4: uuidv4 } = require("uuid");
const bucketName = process.env.AWS_BUCKET_NAME;

const region = process.env.AWS_BUCKET_REGION;
const accessKeyId = process.env.AWS_ACCESS_KEY;
const secretAccessKey = process.env.AWS_SECRET_KEY;

const s3 = new AWS.S3({
  accessKeyId: accessKeyId,
  secretAccessKey: secretAccessKey,
  region: region,
});

const uploadVideo = async (req, res) => {
  if (req.file == null) {
    return res.status(400).json({ message: "Please choose the file" });
  }

  var file = req.file;
  const musicName = req.body.music || "none";
  console.log("file: ", file);
  console.log("musicname: ", musicName);

  const s3VideoFileUpload = (file) => {
    const uniqueFileName = `${uuidv4()}-${file.originalname}`; // Generating a unique filename
    const fileStream = fs.createReadStream(file.path);

    const params = {
      Bucket: bucketName,
      Key: uniqueFileName,
      Body: fileStream,
    };

    const s3Upload = s3.upload(params);

    s3Upload.on("httpUploadProgress", function (progress) {
      const percentCompleted = Math.round(
        (progress.loaded / progress.total) * 100
      );
      console.log(`Upload Progress : ${percentCompleted}%`);
      // You can emit this progress to clients using WebSocket or other means
    });

    s3Upload.send(function (err, data) {
      if (err) {
        throw err;
      }
      console.log(`File uploaded successfully. ${data.Location}`);
      return res.status(201).json({
        message: "File uploaded successfully",
        videoURL: data.Location,
      });
    });
  };

  const addAudioToVideo = (videoPath, audioPath, outputPath, videoDuration) => {
    ffmpeg()
      .input(videoPath)
      .input(audioPath)
      .audioCodec("aac")
      .duration(videoDuration) // Set the duration dynamically
      .output(outputPath)
      .on("end", () => {
        console.log("Audio added to video successfully.");
        s3VideoFileUpload({
          path: outputPath,
          originalname: file.originalname,
        });
      })
      .on("error", (err) => {
        console.error("Error adding audio to video:", err);
        return res.status(500).json({ message: "Error adding audio to video" });
      })
      .run();
  };

  const videoFile = req.file;
  const videoPath = videoFile.path;

  // Use ffprobe to get the duration of the video
  ffmpeg.ffprobe(videoPath, (err, videoInfo) => {
    if (err) {
      console.error("Error getting video duration:", err);
      return res.status(500).json({ message: "Error processing video" });
    }

    const videoDuration = videoInfo.format.duration;

    // Now you can use videoDuration in your code as needed

    // For example, you can pass it to the addAudioToVideo function
    const customAudioPath = `audio/${musicName}.mp3`; // dynamic
    const outputVideoPath = `output/${videoFile.originalname}`;
    if (musicName !== "none") {
      addAudioToVideo(
        videoPath,
        customAudioPath,
        outputVideoPath,
        videoDuration
      );
    } else {
      s3VideoFileUpload(file);
    }
  });
};

const uploadImage = async (req, res) => {
  if (req.file == null) {
    return res.status(400).json({ message: "Please choose the image" });
  }

  const file = req.file;
  const imageName = req.body.imageName; // Assuming a field 'imageName' in the request body
  console.log(imageName);

  const s3ImageFileUpload = (file) => {
    const uniqueFileName = `${uuidv4()}-${file.originalname}`; // Generating a unique filename
    const fileStream = fs.createReadStream(file.path);

    console.log("uniqueFileName: ", uniqueFileName);

    const params = {
      Bucket: bucketName,
      Key: uniqueFileName,
      Body: fileStream,
      ContentType: file.mimetype,
    };

    const s3Upload = s3.upload(params);

    s3Upload.on("httpUploadProgress", function (progress) {
      const percentCompleted = Math.round(
        (progress.loaded / progress.total) * 100
      );
      console.log(`Upload Progress: ${percentCompleted}%`);
      // You can emit this progress to clients using WebSocket or other means
    });

    s3Upload.send(function (err, data) {
      if (err) {
        throw err;
      }
      console.log(`File uploaded successfully. ${data.Location}`);
      return res.status(201).json({
        message: "File uploaded successfully",
        imageURL: data.Location,
      });
    });
  };

  s3ImageFileUpload(file);
};

module.exports = {
  uploadVideo,
  uploadImage,
};
