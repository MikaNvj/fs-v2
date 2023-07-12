import fs from 'fs'
import path from 'path'
import * as Controllers from '../../app/controllers'
import db from '../../data'
import { getFilename } from '../middlewares/upload'

export const get = (obj, field = "") => {
  return field.split(".").reduce((obj, key) => (obj ? obj[key] : obj), obj);
}

// Cas de data concurrentes
const checkDuplicates = async ({ model, data, props = []}) => {
  if(props.length){
    const where = props.reduce((obj, prop) => {
      obj[prop] = data[prop]
      return obj
    }, {})
    return await model.findOne({ where })
  }
}

export const saveEntity = async ({ model, data, files, cfiles = {}, duplicataProps = [] }) => {
  if (data.id) {
    if(files && Object.keys(files).length){
      const old = await model.findByPk(data.id)
      if(old){
        Object.keys(files).map(key => {
          old[key] && fs.unlink(path.join('upload', cfiles[key].folder, old[key]), err => {
            console.log(err || `Suppression ${old[key]} --> ${data[key]}`)
          })
        })
      }
    }
    await model.update(data, { where: { id: data.id } })
    return await model.findByPk(data.id)
  }
  else {
    const dup = await checkDuplicates({model, data, props: duplicataProps})
    return dup || await model.create(data)
  }
}

export const removeEntity = async ({ model, id }) => {
  model.destroy({ where: { id } })
}

const simplified = (inst, data = {}) => {
  if (Array.isArray(inst)) inst.forEach(one => simplified(one, data))
  else {
    const name = inst.constructor.name
    if (!data[name]) data[name] = []
    inst = Object.keys(inst.dataValues).reduce((o, key) => {
      if (Object.keys(inst).includes(key)) simplified(inst.dataValues[key], data)
      else o[key] = inst.dataValues[key]
      return o
    }, {})
    data[name].push(inst)
  }
  return data
}

export const getEntity = async ({ model, from, ids = [], where = {}, ...rest }) => {
  ids = typeof ids === "string" ? ids.split(',').map(s => parseInt(s.trim())).filter(_ => _) : ids
  if (from) where.updatedAt = { [db.Op.gt]: from }
  if (model === db.user) rest.attributes = { exclude: ['password'] }
  const objs = await model.findAll({
    where: { ...(ids.length ? { id: { [db.Op.in]: ids } } : {}), ...where },
    order: [['updatedAt']],
    ...rest
  })
  return simplified(objs)
}

export const uploadSaver = Object.keys(Controllers).reduce((us, key) => {
  if (Controllers[key].files) {
    // Creating folder
    Object.keys(Controllers[key].files).forEach(field => {
      const { folder = '' } = Controllers[key].files[field]
      const fpath = path.join('upload', folder)
      if (!fs.existsSync(fpath)) fs.mkdirSync(fpath, { recursive: true })
    })

    // saver
    us[key] = (object) => {
      return Object.keys(Controllers[key].files).reduce((files, field) => {
        let filename
        const { folder = '', validator } = Controllers[key].files[field]
        if (object[field]) files[field] = (Array.isArray(object[field]) ? object[field] : [object[field]])
          .filter(({name, data}) => name && data).map(({ name, data }) => {
          filename = getFilename(name)
          fs.writeFileSync(path.join('upload', folder, filename), data)
          return {
            originalname: name,
            filename: filename
          }
        })
        if(filename) object[field] = filename
        return files
      }, {})
    }
  }
  return us
}, {})

export const routeToController = controller => async (req, res) => {
  const ret = await controller({
    data: Object.assign({ ...req.query }, req.body),
    files: req.files || {}, auth: req.auth, req, res,
    user: req.user, req,
    error: (message= 'Not Authorized', status = 401) => {
      res.status(status).send({message})
    },
  })
  ret && res.status(200).send(ret)
}