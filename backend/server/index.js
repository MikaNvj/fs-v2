import express from "express"
import cors from "cors"
import routes from "../app/routes"
import initSIO from './init-io'

let app = null

export default (use_socketio, useHttps) => {
  if(!app) {
    app = express()
    app.use(cors({ origin: "*" }));
    app.use(express.json());

    // Routes && uploads
    routes.forEach(route => {
      route(app)
    })
    app.use("/upload", express.static('upload', {maxAge: 1000 * 60 * 60 * 24 * 366}))

    // Socket io
    if(use_socketio) app =  initSIO(app)
  }
  return app
}

