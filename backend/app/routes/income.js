import M from "../../services/middlewares"
import { routeToController } from "../../services/utils"
import { income as C } from '../controllers'

export default (app) => {
  app.get(
    '/income/get',
    [M.verifyToken()],
    routeToController(C.get)
  )

  app.post(
    '/income/save',
    [M.verifyToken],
    routeToController(C.save)
  )

  app.delete(
    '/income/remove',
    [M.verifyToken],
    routeToController(C.remove)
  )
}