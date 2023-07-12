import { id, string, bool } from '../database/types'

export default (sequelize) => sequelize.define(
  "formation",
  {
    id: id(),
    name: string(),
    fullname: string(),
    inactive: bool()
    // Other properties
  }, {
    freezeTableName: true,
  }
)
