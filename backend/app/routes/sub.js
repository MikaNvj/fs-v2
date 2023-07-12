import M from "../../services/middlewares"
import { routeToController } from "../../services/utils"
import { sub as C } from '../controllers'

export default (app) => {
  app.get(
    '/sub/get',
    [M.verifyToken()],
    routeToController(C.get)
  )

  app.post(
    '/sub/save',
    [M.verifyToken],
    routeToController(C.save)
  )

  app.delete(
    '/sub/remove',
    [M.verifyToken],
    routeToController(C.remove)
  )
}