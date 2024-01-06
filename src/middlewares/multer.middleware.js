import multer from "multer";
import { v4 as uuidv4 } from "uuid";
import path from "path";

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/temp');
    },
    filename: function (req, file, cb) {
        const uniquename = uuidv4();
        cb(null, uniquename + path.extname(file.originalname));
    },
});

const upload = multer({
    storage,
    fileFilter: function (req, file, cb) {
        const allowedMimes = ['video/mp4', 'video/mpeg','image/jpeg', 'image/png', 'image/gif'];
        if (allowedMimes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Invalid file type. Only video files are allowed.'));
        }
    },
    limits: {
        fileSize: 10 * 1024 * 1024, // 10 megabytes
    },
});

export { upload };
