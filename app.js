import express from 'express';
import dotenv from 'dotenv';
import session from 'express-session';
import auth from './routes/auth.js';
import fileUpload from 'express-fileupload';
import db from './db.js';
import {encrypt} from "./utils/crypto.js";

const envFile = process.env.NODE_ENV ? `.env.${process.env.NODE_ENV}` : '.env';
dotenv.config({
    path: envFile
});

const app = express();
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret: process.env.SECRET_KEY,
    resave: true,
    saveUninitialized: true,
    })
);
app.use(fileUpload({
    safeFileNames: true,
    preserveExtension: true,
    useTempFiles: true
}));
app.use((req, res, next) => {
    res.locals.session = req.session;
    next();
});
app.use('/uploads', express.static('uploads'));
app.use('/assets', express.static('assets'));
const port = process.env.PORT || 3000;
app.get('/', function (req, res) {
    res.render('index', {
        title: "Deneme Başlık",
        greeting: "Hoşgeldin Gardaş!",
    });
});

console.log(process.env.ENCRYPT_KEY)
app.use('/auth', auth);
app.listen(port, () => console.log(`http://localhost:${port} portundan dinleniyor.`));