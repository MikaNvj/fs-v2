import M from "../../services/middlewares"
import { routeToController } from "../../services/utils"
import { auth as C} from '../controllers'

export default (app) => {
  app.post('/auth/signin', routeToController(C.signin))
  app.get('/auth/check', [M.verifyToken], routeToController(C.check))
  app.get('/auth/new-images', [M.verifyToken], routeToController(C.newImages))
}