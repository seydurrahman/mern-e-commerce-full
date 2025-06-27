const cloudinary = require("cloudinary").v2;
const multer = require("multer");

cloudinary.config({
  cloud_name: "dzwi4r3g3",
  api_key: "369334269885822",
  api_secret: "ZDwvlLduZC5TQtvKKazcNUQasV0",
});

const storage = new multer.memoryStorage();

async function imageUploadUtil(file) {
  const result = await cloudinary.uploader.upload(file, {
    resource_type: "auto",
  });
  return result;
}

const upload = multer({ storage });

module.exports = { upload, imageUploadUtil };
