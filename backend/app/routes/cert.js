import M from "../../services/middlewares"
import { routeToController } from "../../services/utils"
import { cert as C } from '../controllers'

export default (app) => {
  app.get(
    '/cert/get',
    [M.verifyToken()],
    routeToController(C.get)
  )

  app.post(
    '/cert/save',
    [M.verifyToken],
    routeToController(C.save)
  )

  app.delete(
    '/cert/remove',
    [M.verifyToken],
    routeToController(C.remove)
  )
}