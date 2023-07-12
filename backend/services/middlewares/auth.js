import db from '../../data';
import * as Utils from '../utils'

export const dataInToken = (validator) => async (req, res, next) => {
  let token = req.headers["x-access-token"] || req.headers["authorization"]
  if (!token || !token.startsWith('Bearer ')) {
    return res.status(401).send({ message: "No token provided!" });
  }
  token = token.replace('Bearer ', '')
  Utils.verifyToken(token, data => {
    const valid = Object.keys(validator).reduce((valid, key) => {
      if (!valid || !dataInToken.validateKey(validator, data, key)) return false
      else return true
    }, true)
    if (valid) {
      Object.assign(req, { auth: data })
      if ('userId' in validator) req.user = async _ => await db.user.findOne({
        where: { id: data.userId },
        attributes: { exclude: password }
      })
      next()
    }
    else res.status(401).send({ message: "Unauthorized!" });
  })
}

dataInToken.validateKey = async (validator, data, key) => {
  if (validator[key] === undefined) return key in data
  else if (typeof validator[key] === 'function')
    return await validator[key](data[key], { data, validator, key, db })
  else if (Array.isArray(validator[key])) validator[key].find(vkey => vkey == data[key]) !== undefined
  else return validator[key] == data[key]
}

export const verifyToken = (req, res, next) => {
  dataInToken({ userId: undefined })(req, res, next)
}

export const isAdmin = (req, res, next) => {
  dataInToken({ userId: undefined })(req, res, next)
  db.uder.findByPk(req.userId).then(async user => {
    if (user) {
      const role = await user.getRole()
      if (role && role.name === 'ADMIN') return next()
    }
    res.status(401).send({
      message: "Require Admin Role!",
    });
  });
}