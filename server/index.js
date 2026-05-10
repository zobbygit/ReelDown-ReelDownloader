require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const { instagramGetUrl } = require("instagram-url-direct");

const app = express();

/* =========================
   Middleware
========================= */

app.use(cors());
app.use(express.json());

/* =========================
   MongoDB Connection
========================= */

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected");
  })
  .catch((err) => {
    console.log(err);
  });

/* =========================
   Schema
========================= */

const downloadSchema = new mongoose.Schema(
  {
    originalUrl: {
      type: String,
      required: true,
    },

    downloadUrl: {
      type: String,
      required: true,
    },

    type: {
      type: String,
      enum: ["post", "reel"],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Download = mongoose.model("Download", downloadSchema);

/* =========================
   Download Route
========================= */

app.post("/download", async (req, res) => {
  try {
    let { url } = req.body;

    if (!url) {
      return res.status(400).json({
        success: false,
        message: "URL is required",
      });
    }

    // Remove query params
    url = url.split("?")[0];

    // Validate
    const valid =
      url.includes("/p/") ||
      url.includes("/reel/") ||
      url.includes("/reels/");

    if (!valid) {
      return res.status(400).json({
        success: false,
        message: "Invalid Instagram URL",
      });
    }

    // Fetch Instagram video
    const data = await instagramGetUrl(url);

    if (!data || !data.url_list || data.url_list.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Video not found",
      });
    }

    const downloadUrl = data.url_list[0];

    // Detect type
    let type = "post";

    if (
      url.includes("/reel/") ||
      url.includes("/reels/")
    ) {
      type = "reel";
    }

    // Save in DB
    const newDownload = new Download({
      originalUrl: url,
      downloadUrl,
      type,
    });

    await newDownload.save();

    res.json({
      success: true,
      downloadUrl,
      savedData: newDownload,
    });

  } catch (err) {
    console.log("ERROR:", err);

    res.status(500).json({
      success: false,
      message: "Failed to fetch Instagram media",
    });
  }
});

/* =========================
   Get All Downloads
========================= */

app.get("/downloads", async (req, res) => {
  try {
    const downloads = await Download.find().sort({
      createdAt: -1,
    });

    res.json(downloads);

  } catch (err) {
    console.log(err);

    res.status(500).json({
      success: false,
      message: "Failed to fetch downloads",
    });
  }
});

/* =========================
   Server
========================= */

const PORT = process.env.PORT || 5000;





app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});