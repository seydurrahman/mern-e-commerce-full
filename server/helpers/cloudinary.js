const cloudinary = require("cloudinary").v2;
const multer = require("multer");
const stream = require("stream");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new multer.memoryStorage();
const upload = multer({ storage });

async function imageUploadUtil(file) {
  return new Promise((resolve, reject) => {
    const bufferStream = new stream.PassThrough();
    bufferStream.end(file.buffer);

    const uploadStream = cloudinary.uploader.upload_stream(
      { resource_type: "auto" },
      (error, result) => {
        if (error) {
          console.error("Cloudinary stream error:", error);
          return reject(error);
        }
        resolve(result);
      }
    );

    bufferStream.pipe(uploadStream);
  });
}

module.exports = { upload, imageUploadUtil };
