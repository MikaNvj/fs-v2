import iDB from '../../services/iDB'
import { Data, FormationTypes } from '../../types'

export const getFormations = async (formations = []) => {
  formations = await iDB.formation.get()
  return formations
}

export const saveFormation = async (formation: any) => {
  formation = await iDB.formation.save(formation)
  return formation
}

export const removeFormation = async (formation: any) => {
  formation = await iDB.formation.delete(formation)
  return formation
}
