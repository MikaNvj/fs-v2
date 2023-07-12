import { id, bool, double } from '../database/types'

export default (sequelize) => sequelize.define(
  "cert",
  {
    id: id(),
    mention: double(),
    inactive: bool()
  }, {
    freezeTableName: true,
  }
)