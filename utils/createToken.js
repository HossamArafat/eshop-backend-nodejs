import jwt from 'jsonwebtoken'

const createToken = (payload) =>
  jwt.sign(payload, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRED_TIME,
  });

export default createToken