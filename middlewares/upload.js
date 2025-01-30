const multer = require('multer');
const path = require('path');

const tmpDir = path.join(__dirname, '../tmp');

const multerConfig = multer.diskStorage({
  destination: tmpDir,
  filename: (_, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({
  storage: multerConfig,
  limits: {
    fileSize: 4050000,
  },
  fileFilter: (_, file, cb) => {
    if (file.mimetype.includes('image')) {
      cb(null, true);
    } else {
      cb(new Error('File format is invalid'), false);
    }
  },
});

module.exports = upload;