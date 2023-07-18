import * as Service from '../../services/backends/program'
import iDB from '../../services/iDB'

export const getPrograms = async (programs = []) => {
  programs = await iDB.program.get()
  return programs
}

export const saveProgram = async program => {
  program = await iDB.program.save(program)
  return program
}

export const removeProgram = async program => {
  program = await Service.removeProgram(program)
  return program
}
