const multer = require('multer');
const path = require('path');

// Define storage for the files
const storage =  multer.diskStorage({
   
    destination: function (req, file, cb) {
        console.log('req :>> ', req.body);
        cb(null, 'uploads/'); // specify the destination directory
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + path.basename(file.originalname)); // specify the filename
    }
});

// Initialize multer with the storage configuration
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5 // limit file size to 5MB
    }
});

module.exports = upload;
