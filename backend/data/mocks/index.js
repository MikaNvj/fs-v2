import db from "..";
import * as service from "../../services/utils"
export default async () => {
  await db.user.create({
    firstname: "Rojo",
    username: "rojo",
    email: "rojo@fiharysoft.com",
    password: service.encryptPassword("rojo")
  })
}
