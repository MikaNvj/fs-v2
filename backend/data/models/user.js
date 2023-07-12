import { bool, id, string,  } from '../database/types'

export default (sequelize) => sequelize.define(
  "user",
  {
    id: id(),
    username: string(50),
    email: string(150),
    password: string(255),
    firstname: string(200),
    lastname: string(200),
    inactive: bool(false)
  }, {
    freezeTableName: true,
  }
)