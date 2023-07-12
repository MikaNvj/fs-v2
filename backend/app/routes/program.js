import M from "../../services/middlewares"
import { routeToController } from "../../services/utils"
import { program as C } from '../controllers'

export default (app) => {
  app.get(
    '/program/get',
    [M.verifyToken()],
    routeToController(C.get)
  )

  app.post(
    '/program/save',
    [M.verifyToken],
    routeToController(C.save)
  )

  app.delete(
    '/program/remove',
    [M.verifyToken],
    routeToController(C.remove)
  )
}