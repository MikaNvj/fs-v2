import M from "../../services/middlewares"
import { routeToController } from "../../services/utils"
import { payment as C } from '../controllers'

export default (app) => {
  app.get(
    '/payment/get',
    [M.verifyToken()],
    routeToController(C.get)
  )

  app.post(
    '/payment/save',
    [M.verifyToken],
    routeToController(C.save)
  )

  app.delete(
    '/payment/remove',
    [M.verifyToken],
    routeToController(C.remove)
  )
}