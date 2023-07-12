import os from 'os'
import path from 'path'
import express from 'express'
import https from 'https'
import http from 'http'
import fs, { mkdirSync } from 'fs'
import { app } from './fileServer'

const filesPath = path.join(os.homedir(), 'fsmanager', 'files')
mkdirSync(filesPath, { recursive: true })

var download = function (url, cb = _ => _) {
  const dest = path.join(filesPath, path.basename(url))
  if(!fs.existsSync(dest)){
    const file = fs.createWriteStream(dest)
    const protocol = url.startsWith('https') ? https : http
    protocol.get(url, function (response) {
      response.pipe(file)
      file.on('finish', function () {
        file.close(cb)
      })
    }).on('error', function (err) {
      fs.unlinkSync(dest)
      if (cb) cb(err.message)
    })
  }
}

app.use('/upload/images', express.static(filesPath))

export default {
  addUrls: ({files}) => {
    files.forEach(url => download(url))
  }
}