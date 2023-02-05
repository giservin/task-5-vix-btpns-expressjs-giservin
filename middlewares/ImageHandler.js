import multer from "multer";
import fs from "fs";

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      fs.mkdir(`./tmp/${req.userEmail}`, {recursive: true}, (err) => {
        if(err) return console.error(err.message);
      });
      cb(null, `./tmp/${req.userEmail}`);
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = new Date().getTime() + '-' + Math.round(Math.random() * 1E9);
      cb(null, `${uniqueSuffix}.${file.originalname.split('.')[1]}`);
    }
});

const filtering = (req, file, cb) => {
    if(
        file.mimetype === 'image/jpg' || 
        file.mimetype === 'image/png' || 
        file.mimetype === 'image/jpeg'
      ) {
        cb(null, true);
    } else {
        cb(null, false);
    }
}
  
export const ImageHandler = multer({ storage: storage, fileFilter: filtering }).single('photoUrl');

export const ImageUploadErrorHandler = (err, req, res, next) => {
  if(err instanceof multer.MulterError) return res.status(400).json({msg: err.message});
  else if(err) return res.status(500).json({msg: err.message});
}