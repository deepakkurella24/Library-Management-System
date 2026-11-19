const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcrypt');
require('dotenv').config();

const { connectDB } = require('./config/database');
const User = require('./models/user');
const Book = require('./models/book');
const userAuth = require('./middlewares/userAuth');
const authRoute = require('./routes/authRouter');
const bookRoute = require('./routes/bookRouter');

const app = express();

app.use(cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true
}));

app.use(express.json());
app.use(cookieParser());


app.use(authRoute);


app.use('/books', userAuth, bookRoute);




const PORT = process.env.PORT || 7777;

connectDB()
    .then(async () => {
        console.log("DB connected successfully");
       
        app.listen(PORT, () => {
            console.log(`app is running on port ${PORT}`);
        });
    })
    .catch((err) => {
        console.log("Database connection error:", err.message);
    });
