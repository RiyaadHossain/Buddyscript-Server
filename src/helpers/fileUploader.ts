import multer from "multer";
import path from "path";
import fs from "fs";
import FormData from "form-data";
import configs from "@/configs/index.js";
import axios from "axios";

// Make sure upload directory exists
const uploadDir = path.join(__dirname, "../../uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

// Configure multer storage
const storage = multer.diskStorage({
  destination: function (_req, _file, cb) {
    cb(null, uploadDir);
  },
  filename: function (_req, file, cb) {
    const uniqueSuffix =
      Date.now() + "-" + Math.random().toString(36).substring(2, 8);
    const ext = path.extname(file.originalname);
    cb(null, `${uniqueSuffix}${ext}`);
  },
});

const fileFilter = (
  _req: Express.Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only JPG, PNG, and WEBP files are allowed"));
  }
};

export const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter,
});

// Middleware to handle single file upload
export const singleFileUpload = (fieldName: string) => upload.single(fieldName);

// Upload file to ImgBB
export const uploadToImgBB = async (filePath: string): Promise<string> => {
  const form = new FormData();
  form.append("image", fs.createReadStream(filePath));

  const apiKey = configs.IMGBB_API_KEY;

  const url = `https://api.imgbb.com/1/upload?key=${apiKey}`;
  const res = await axios.post(url, form, {
    headers: form.getHeaders(),
  });

  // Optionally delete local file
  fs.unlinkSync(filePath);

  return res.data.data.url;
};
