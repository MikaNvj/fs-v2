import express from 'express'
import multer from 'multer'
import os from 'os'
import fs from 'fs'
import cors from "cors"
import path from 'path'
import { networkInterfaces } from 'os'
// import { spawn } from 'child_process'
import { getPortPromise } from 'portfinder'

const ips = () => {
  return Object.values(networkInterfaces()).reduce((list, ints) => {
    ints = ints.filter(({internal, family}) => !internal && family === 'IPv4')
    return [...list, ...ints.map(({address}) => address)]
  }, [])
}

const server = {
  app: express()
}

const generatePort = async () => await getPortPromise({ port: 1024 })

const tmp = (dir = 'fsmanager') => {
  const temp = os.tmpdir().replace(/\\/g, '/') + '/' + dir
  if (!fs.existsSync(temp)) fs.mkdirSync(temp)
  return temp
}

const storage = (fields) => {
  return multer.diskStorage({
    destination: (req, { fieldname }, callback) => {
      const fpath = tmp()
      if (!fs.existsSync(fpath)) fs.mkdirSync(fpath, { recursive: true })
      callback(null, fpath)
    },
    filename: (req, file, callback) => {
      const { fieldname, originalname } = file
      const { validator = _ => _ } = fields[fieldname]
      if (validator(file, req)) callback(null, `${new Date().getTime()}${path.extname(originalname)}`)
      else callback(`The file "${originalname}" doesn't match the file validation`, null)
    }
  })
}

const upload = (fields) => {
  return multer({
    storage: storage(fields),
    limits: { fileSize: 90000 * 1024 * 1024 },
  }).fields(Object.keys(fields).map(name => ({ name })))
}

(async () => {
  server.port = await generatePort()
  const app = server.app
  app.use(cors({ origin: "*" }))
  app.use("/image", express.static(tmp()))
  app.get('/', function (req, res) {
    res.send(fs.readdirSync(tmp()).sort((a, b) => a > b ? -1 : 1))
  })
  app.post(
    '/upload',
    [
      upload({
        image: {
          validator: ({ mimetype: m }) => m.startsWith('image/')
        }
      })
    ], (req, res) => {
      const files = fs.readdirSync(tmp()).sort((a, b) => a > b ? -1 : 1)
      server.win.webContents.send('update:images', files)
      res.send(files)
    }
  )

  app.listen(server.port, () => console.log(`Launched on ${server.port}`))
})()

const fncs = {
  server,
  start: async (App) => {
    server.win = App.win
    const { port } = server
    // if(!server.rok){
    //   const toExec =  './resources/extra/pgrok.exe'
    //   server.rok = spawn(toExec, [`-subdomain=fsm${port}`, `${port}`])
    // }
    return {port, ip: ips(), rok: `fsm${port}.ejemplo.me`}
  },
  stop: async () => {
    // server.rok && server.rok.kill()
  }
}


export const app = server.app
export default fncs
