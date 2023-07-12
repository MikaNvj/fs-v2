import { id, integer, bool } from '../database/types'
export default (sequelize) => sequelize.define(
  "copy",
  {
    id: id(),
    black: integer(),
    colored: integer(),
    wasted: integer(),
    inactive: bool()
  }, {
    freezeTableName: true,
  }
)