import { bool, date, id, integer, string,  } from '../database/types'

export default (sequelize) => sequelize.define(
  "connexion",
  {
    id: id(),
    key: string(1),
    start: date(),
    stop: date(),
    subscribed: bool(),
    inactive: bool()
    // Other properties
  }, {
    freezeTableName: true,
  }
)