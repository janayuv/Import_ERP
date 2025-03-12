const express = require('express');
const multer = require('multer');

const router = express.Router();

// Set up file storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Save files in 'uploads' folder
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  },
});

// Initialize multer
const upload = multer({ storage });

// Upload route
router.post('/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded.' });
  }

  res.status(200).json({
    message: 'File uploaded successfully!',
    file: req.file.filename,
  });
});

module.exports = router;
