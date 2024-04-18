import { body, check } from "express-validator";
import User from "../models/User.js";

export const registerValidation = () => [
    body('username')
        .isLength({ min: 3, max: 10 })
        .withMessage('Kullanıcı adı en az 3 karakter, en fazla 10 karakter olmalıdır.')
        .isAlphanumeric()
        .withMessage('Kullanıcı adı sadece harf ve rakamlardan oluşmalıdır.')
        .custom(value => {
            return User.findByUsername(value).then((user) => {
                if(user) {
                    return Promise.reject('Bu Kullanıcı Zaten Kayıtlı!')
                }
            })
        }),
    body('email')
        .isEmail()
        .withMessage('Geçerli bir e-posta adresi giriniz.')
        .custom(value => {
            return User.findByEmail(value).then((user) => {
                if(user) {
                    return Promise.reject('Bu E-mail Zaten Kullanılıyor!')
                }
            })
        }),
    body('password')
        .isLength({min: 6, max: 20})
        .withMessage('Şifre en az 6 karakter uzunluğunda olmalı.'),
    body('passwordConfirmation').custom((value, { req }) => {
        if(value !== req.body.password) {
            throw new Error('Şifreler aynı değil!')
        }
        return true;
    }),

    check('avatar')
        .custom((value, { req }) => {
            if(!req.files || Object.keys(req.files).length === 0 || !req?.files?.avatar) {
                throw new Error('Profil Resmi Yüklenmelidir!.');
            }
            const allowedMimeTypes = ['image/png', 'image/png'];
            const profileImage = req.files.avatar;
            if(!allowedMimeTypes.includes(profileImage.mimetype)) {
                throw new Error('Sadece JPG, PNG Uzantılı Resim Yükleyebilirsiniz.');
            }
            if(profileImage.size > 5 * 1024 * 1024) {
                throw new Error('Dosya Boyutu 5mb\'ı Geçemez!');
            }
            return true;
        })
]