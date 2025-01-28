import multer from 'multer';
import path from 'path';
import fs from 'fs';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {

    const uploadPath = './uploads';

    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });  
    }


    cb(null, './uploads'); 
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname); 
    const filename = Date.now() + ext; 
    cb(null, filename);
  }
});

const fileFilter = (req: any, file: any, cb: any) => {
  const allowedMimes = ['image/jpeg', 'image/png', 'video/mp4', 'video/webm'];
  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type, only images and videos are allowed.'));
  }
};

const upload = multer({ storage, fileFilter });

export default upload;
