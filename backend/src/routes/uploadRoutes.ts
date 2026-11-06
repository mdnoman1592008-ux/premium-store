import express from 'express';
import multer from 'multer';
import path from 'path';
import { protect } from '../middleware/auth';

const router = express.Router();

const storage = multer.memoryStorage();

function checkFileType(file: Express.Multer.File, cb: multer.FileFilterCallback) {
  const filetypes = /jpg|jpeg|png|webp|gif/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(new Error('Images only!'));
  }
}

const upload = multer({
  storage,
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
});

router.post('/', protect, upload.single('image'), (req, res) => {
  if (req.file) {
    const b64 = req.file.buffer.toString('base64');
    res.send(`data:${req.file.mimetype};base64,${b64}`);
  } else {
    res.status(400).send('No file uploaded');
  }
});

export default router;
