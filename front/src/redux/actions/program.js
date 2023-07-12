import * as Service from '../../services/backends/program'
import iDB from '../../services/iDB'
import {
  ADD_PROGRAM, REMOVE_PROGRAM,
} from '../types'

export const getPrograms = (programs = []) => async dispatch => {
  programs = await iDB.program.get()
  dispatch({type: ADD_PROGRAM, payload: programs})
  return programs
}

export const saveProgram = program => async dispatch => {
  program = await iDB.program.save(program)
  dispatch({type: ADD_PROGRAM, payload: [program]})
  return program
}

export const removeProgram = program => async dispatch => {
  program = await Service.removeProgram(program)
  dispatch({type: REMOVE_PROGRAM, payload: [program]})
  return program
}
