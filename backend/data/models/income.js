import { id, bool, integer, dateOnly } from '../database/types'

export default (sequelize) => sequelize.define(
  "income",
  {
    id: id(),
    date: dateOnly(),
    inactive: bool(),
    amount: integer()
    // Other properties
  }, {
    freezeTableName: true,
  }
)