import crypto from 'crypto';

export function encrypt(string, key = false) {
    const cipher = crypto.createCipheriv('aes-128-gcm', (key || process.env.ENCRYPT_KEY), null );
    let encrypted = cipher.update(string, 'utf8', 'base64');
    encrypted += cipher.final('base64');
    return encrypted;
}

export function decrypt(string, key) {
    const decipher = crypto.createCipheriv('aes-128-gcm', (key || process.env.ENCRYPT_KEY), null);
    let decrypted = decipher.update(string, 'utf8', 'base64');
    decrypted += decipher.final('utf-8');
    return decrypted;
}