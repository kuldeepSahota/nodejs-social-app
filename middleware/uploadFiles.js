const multer = require('multer');
const upload = require('../utils/uploadFile');

const uploadFile = (req, res, next) => {
    const uploadSingle = upload.single('file',"ABC"); // Adjust 'file' to match the form field name

    uploadSingle(req, res, function (err) {
        if (err instanceof multer.MulterError) {
            console.error('Multer error:', err);
            return res.status(400).json({
                success: false,
                code: 400,
                message: err.message
            });
        } else if (err) {
            console.error('Unknown error:', err);
            return res.status(500).json({
                success: false,
                code: 500,
                message: 'Internal server error'
            });
        } else if (!req.file) {
            console.error('No file uploaded');
            return res.status(400).json({
                success: false,
                code: 400,
                message: 'No file uploaded'
            });
        }

        console.log('Uploaded file:', req.file.filename);
        next();
    });
};

module.exports = uploadFile;
