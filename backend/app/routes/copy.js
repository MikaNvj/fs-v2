import M from "../../services/middlewares"
import { routeToController } from "../../services/utils"
import { copy as C } from '../controllers'

export default (app) => {
  app.get(
    '/copy/get',
    [M.verifyToken()],
    routeToController(C.get)
  )

  app.post(
    '/copy/save',
    [M.verifyToken],
    routeToController(C.save)
  )

  app.delete(
    '/copy/remove',
    [M.verifyToken],
    routeToController(C.remove)
  )
}