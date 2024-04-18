import {validationResult} from "express-validator";
import fs from "fs";
import slugify from "slugify";
import User from "../models/user.js";

export const getRegisterController = (req, res) => {
    res.render('auth/register');
}

export const postRegisterController = (req, res) => {
    const { username, email } = req.body;
    res.locals.formData = req.body;

    const errors = validationResult(req);

    if(errors.isEmpty()) {
        const avatar = req.files.avatar;
        let file = avatar.name.split('.');
        let fileExtension = file.pop();
        let fileName = file.join('');
        const tarih = new Date().toLocaleDateString("tr-TR").replaceAll("." , "-");
        const yuklemeYolu = `uploads/${tarih}`;
        const dosyaAdi = Date.now() + '-' + slugify(fileName, {
            lowercase: true,
            locale: 'tr',
            strict: true
        }) + '.' + fileExtension;

        if (!fs.existsSync(yuklemeYolu)) {
            fs.mkdirSync(yuklemeYolu, { recursive: true });
        }

        avatar.mv(`${yuklemeYolu}/${dosyaAdi}`, async err => {
            if (err) {
                return res.status(500).send({ error: err });
            }

            //Model Yapısı
            const response = await User.create({
                email: req.body.email,
                password: req.body.password,
                username: req.body.username,
                avatar: yuklemeYolu + '/' + dosyaAdi,
            });
            const user = await User.findById(response.insertId)
            req.session.username = user.username;
            req.session.user_id = user.id;
            res.redirect('/')

        });
    } else {
        res.render('auth/register', {
            errors: errors.array()
        });
    }
}

export const getLoginController = (req, res) => {
    res.render('auth/login');
}

export const postLoginController = async (req, res) => {
    const { username, password } = req.body;
    res.locals.formData = req.body;
    let error;
    if(!username || !password){
        error = 'Kullanıcı adı veya Şifreniz Boş Olamaz!';
    } else {
        const user = await User.login(username, password);
        if(user) {
            req.session.username = user.username;
            req.session.user_id = user.id;
            res.redirect('/');
        } else {
            error = 'Kullanıcı Adı veya Şifreniz Yanlış!'
        }
    }

    if(error) { res.render('auth/login', { error }); }
}

export const logoutController = (req, res) => {
    req.session.destroy();
    res.redirect('/')
}