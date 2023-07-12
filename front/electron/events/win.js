const shell = require('electron').shell
import fs, { mkdirSync } from 'fs'
import { homedir } from 'os'
import { join } from 'path'

export const minimize = ({win}) => {
  win.minimize()
}

export const toggleMax = ({win}) => {
  !win.isMaximized() ? win.maximize(): win.unmaximize()
}

export const close = ({win}) => {
  win.close()
}

export const print = async ({win, opts}) => {
  const data = await win.webContents[opts.pdf ? 'printToPDF' : 'print'](opts)
  if(opts.pdf){

    let output = join(homedir(), 'Desktop', opts.pdf.folder || 'Certificats')
    mkdirSync(output, {recursive: true})
    output = join(output, `${opts.pdf.name || 'test'}.pdf`) 
    fs.writeFile(output, data, (error) => {
      if (error) throw error
      shell.openPath(output)
    })
  }
}

export const external = async ({link}) => {
  shell.openExternal(link)
}