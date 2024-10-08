import Image from "../models/image.model.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const uploadImg = (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }
    const filePath = path.join(__dirname, "../uploads/", req.file.filename);

    const newImage = new Image({
      name: req.file.filename,
      img: {
        data: fs.readFileSync(filePath),
        contentType: req.file.mimetype,
      },
    });

    newImage
      .save()
      .then(() =>
        res.json({
          message: "Image uploaded successfully",
          imageUrl: `uploads/${req.file.filename}`,
        })
      )
      .catch((err) => {
        console.error("Error saving image to database:", err);
        res.status(400).json({ error: "Error uploading image" });
      });
  } catch (err) {
    console.error("Error processing image upload:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const uploadImgs = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: "No files uploaded" });
    }

    const imageUrls = [];
    for (const file of req.files) {
      const filePath = path.join(__dirname, "../uploads/", file.filename);

      const newImage = new Image({
        name: file.filename,
        img: {
          data: fs.readFileSync(filePath),
          contentType: file.mimetype,
        },
      });

      await newImage.save();
      imageUrls.push(`uploads/${file.filename}`);
    }

    res.json({
      message: "Images uploaded successfully",
      imageUrls,
    });
  } catch (err) {
    console.error("Error processing image upload:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
}