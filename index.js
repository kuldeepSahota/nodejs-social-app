const express = require('express');
const fs = require('fs');
const path = require('path');
const connectDB = require('./config/db');
const dotenv = require('dotenv');
const morgan = require('morgan');

const authRoutes = require('./routes/authRoutes');
const postRoutes = require('./routes/postRoutes');
const userRoutes = require('./routes/userRoutes');





dotenv.config();

const app = express();
morgan('tiny')

// Create 'uploads' directory if it doesn't exist
const uploadDir = path.join(__dirname, 'uploads');

if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

connectDB();

app.use(express.json({extended:false}));
app.use('/api/auth',authRoutes );
app.use('/api/post',postRoutes );
app.use('/api/user',userRoutes );

const PORT  = process.env.PORT || 5000;

app.listen(PORT , () => console.log(`Server running on port ${PORT}`));
