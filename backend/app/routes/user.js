import M from "../../services/middlewares"
import { routeToController } from "../../services/utils"
import { user as C } from '../controllers'

export default (app) => {
  app.get(
    '/user/get',
    [M.verifyToken()],
    routeToController(C.get)
  )

  app.post(
    '/user/save',
    [M.verifyToken],
    routeToController(C.save)
  )

  app.delete(
    '/user/remove',
    [M.verifyToken],
    routeToController(C.remove)
  )
}