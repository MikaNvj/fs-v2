import M from "../../services/middlewares"
import { routeToController } from "../../services/utils"
import { connexion as C } from '../controllers'

export default (app) => {
  app.get(
    '/connexion/get',
    [M.verifyToken],
    routeToController(C.get)
  )

  app.post(
    '/connexion/save',
    [M.verifyToken],
    routeToController(C.save)
  )

  app.delete(
    '/connexion/remove',
    [M.verifyToken],
    routeToController(C.remove)
  )

}