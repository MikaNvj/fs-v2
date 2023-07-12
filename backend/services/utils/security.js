import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs"

const SECRET_TOKEN = process.env.JWT_SECRET_TOKEN

export const createToken = (data = {}, expire = 30 * 24 * 60 * 60) => {
  return  jwt.sign(data, SECRET_TOKEN, expire ? { expiresIn: expire } : {});
}

export const verifyToken = (token, handler) => {
  jwt.verify(token, SECRET_TOKEN, (err, decoded) => handler(err ? null : decoded))
}

export const verifyTokenAsync = (token) =>  new Promise((resolve, reject) => {
  jwt.verify(token, SECRET_TOKEN, (err, decoded) => {
    err ? reject(err) : resolve(decoded)
  })
})

export const encryptPassword = password => {
  return bcrypt.hashSync(password, 8)
}

export const comparePassword = (password, encrypted_password) => {
  return bcrypt.compareSync(password, encrypted_password)
}