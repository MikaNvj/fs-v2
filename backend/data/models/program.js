import { date, id, integer, bool, string } from '../database/types'

export default (sequelize) => sequelize.define(
  "program",
  {
    id: id(),
    date: date(),
    detail: string(),
    price: integer(),
    certprice: integer(5000),
    place: integer(),
    inactive: bool()
    // Other properties
  }, {
    freezeTableName: true,
  }
)