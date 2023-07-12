import { Sequelize, Op } from 'sequelize'

const sequelize = new Sequelize({
  host: process.env.DB_HOST,
  database: process.env.DATABASE,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  dialect: "mysql",
  force: false,
  alter: false,
  define: {
    underscored: true,
    charset: "utf8",
    collate: "utf8_general_ci",
  },
  pool: {
    min: 0,
    max: 10,
    acquire: 30000,
    idle: 10000,
  },
})

export default {
  sequelize, Op
}