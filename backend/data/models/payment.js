import { bigint, id, bool, string, integer } from '../database/types'

export default (sequelize) => sequelize.define(
  "payment",
  {
    id: id(),
    targetId: bigint(),
    inactive: bool(),
    type: string(15),
    rest: integer(),
    amount: integer()
    // Other properties
  }, {
    freezeTableName: true,
  }
)