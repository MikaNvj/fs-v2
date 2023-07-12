import Api from '../api'
import { reduceToId } from '../functions'

export const getPrograms = async programs => {
  const res = await Api.get({
    url: '/program/get',
    params: {ids: programs.map(reduceToId).join(',')},
  })
  return res.data
}

export const createOrUpdateProgram = async program => {
  const res = await Api.post({
    url: '/program/create_or_update',
    data: program,
  })
  return res.data
}

export const removeProgram = async program => {
  const res = await Api.delete({
    url: '/program/remove',
    params: {id: reduceToId(program)},
  })
  return res.data
}
