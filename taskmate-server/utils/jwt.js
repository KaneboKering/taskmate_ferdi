 import jwt from 'jsonwebtoken';
const JWT_SECRET = process.env.JWT_SECRET || 'taskmate_secret_key_change_in_production';
const JWT_EXPIRE = '7d';
export function generateToken(user) {
const payload = {
userId: user.id,
email: user.email,
name: user.name
};
return jwt.sign(payload, JWT_SECRET, {
expiresIn: JWT_EXPIRE,
issuer: 'taskmate-api'
 });
}

export function verifyToken(token) {
try {
return jwt.verify(token, JWT_SECRET);
} catch (error) {
throw new Error('Invalid or expired token');
}
}
