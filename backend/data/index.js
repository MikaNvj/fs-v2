import db from './database/init'
import models from './models'
import relationize from './relationship'
import mockDatabase from "./mocks";


const resetDatabase = async () => {
  await db.sequelize.query("SET FOREIGN_KEY_CHECKS = 0");
  await db.sequelize.drop();
  await db.sequelize.query("SET FOREIGN_KEY_CHECKS = 1");
}

const start = async () => {
  Object.keys(models).forEach(key => db[key] = models[key](db.sequelize))
  relationize(db)
  if (process.env.RESET_DATABASE === "true"){
    await resetDatabase()
    await db.sequelize.sync({ force: false })
    mockDatabase()
  }
  else await db.sequelize.sync({ force: false })
}

start()

export default db