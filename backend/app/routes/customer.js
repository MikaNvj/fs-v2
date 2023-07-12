import M from "../../services/middlewares"
import { routeToController } from "../../services/utils"
import { customer as C } from '../controllers'

export default (app) => {
  app.get(
    '/customer/get',
    [M.verifyToken()],
    routeToController(C.get)
  )

  app.post(
    '/customer/save',
    [M.verifyToken],
    routeToController(C.save)
  )

  app.delete(
    '/customer/remove',
    [M.verifyToken],
    routeToController(C.remove)
  )
}