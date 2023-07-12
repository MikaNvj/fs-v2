import { id, string, bool, date, text } from '../database/types'

export default (sequelize) => sequelize.define(
  "customer",
  {
    id: id(),
    sex: string(1),
    firstname: string(100),
    lastname: string(100),
    adress: string(),
    email: string(),
    birthdate: date(),
    birthplace: string(),
    phone: string(),
    facebook: text(),
    photo: string(),
    inactive: bool()
  }, {
    freezeTableName: true,
  }
)