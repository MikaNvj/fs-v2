import { date, id, integer, bool, dateOnly } from '../database/types'

export default (sequelize) => sequelize.define(
  "sub",
  {
    id: id(),
    start: dateOnly(),
    end: dateOnly(),
    sub: integer(),
    inactive: bool()
  }, {
    freezeTableName: true,
  }
)