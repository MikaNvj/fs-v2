import M from "../../services/middlewares"
import { routeToController } from "../../services/utils"
import { formation as C } from '../controllers'

export default (app) => {

  app.get(
    '/formation/get',
    [M.verifyToken()],
    routeToController(C.get)
  )

  app.post(
    '/formation/save',
    [M.verifyToken],
    routeToController(C.save)
  )

  app.delete(
    '/formation/remove',
    [M.verifyToken],
    routeToController(C.remove)
  )
}