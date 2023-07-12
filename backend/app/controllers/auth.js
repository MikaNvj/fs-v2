import path from 'path'
import fs from 'fs'
import db from "../../data"
import * as Service from "../../services/utils"
import { simpleMember } from "../../services/utils"

export const signin = async ({ data, error }) => {
  const { login, password } = data
  let user = null
  if (login) {
    const t_user = await db.user.findOne({
      where: login.indexOf('@') >= 0 ? { email: login } : { username: login }
    })
    if (t_user && Service.comparePassword(password, t_user.password)) {
      user = t_user
    }
  }
  if (user) {
    var token = Service.createToken({ userId: user.id, userRole: user.role }, 365 * 24 * 60 * 60)
    return {
      user: simpleMember(user),
      token
    }
  }
  else return error("Bad credentials")
}

export const check = async ({ user }) => {
  const me = await user()
  return { user: simpleMember(me) }
}

export const newImages = async ({ data: {date}, req }) => {
  return fs.readdirSync(path.join('upload', 'images'))
    .filter(name => {
      const stat = fs.lstatSync(path.join('upload', 'images', name))
      return stat.isFile() && stat.birthtime > new Date(date)
    }).map(name => `${req.protocol}://${req.get('host')}/upload/images/${name}`)
}