import fs from 'fs'
const multer = require("multer");
const path = require("path");
const uuid = require("uuid");

export const getFilename = name => `${uuid.v4()}${path.extname(name)}`

const storage = (fields) => {
  return multer.diskStorage({
    destination: (_, { fieldname }, callback) => {
      const fpath = `upload/${fields[fieldname].folder}`
      if (!fs.existsSync(fpath)) fs.mkdirSync(fpath, { recursive: true })
      callback(null, fpath)
    },
    filename: (req, file, callback) => {
      const { fieldname, originalname } = file
      const { validator = _ => _ } = fields[fieldname]
      if (validator(file, req)) callback(null, getFilename(originalname))
      else callback(`The file "${originalname}" doesn't match the file validation`, null)
    }
  })
}

const upload = (fields) => {
  return multer({
    storage: storage(fields),
    limits: { fileSize: 90000 * 1024 * 1024 },
  }).fields(Object.keys(fields).map(name => ({ name })))
}

export default upload

export const image = upload({
  photos: {
    folder: 'images',
    validator: ({ mimetype: m }) => m.startsWith('image/')
  }
})