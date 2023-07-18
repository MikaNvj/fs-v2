import iDB from '../../services/iDB'

export const getFormations = async (formations = []) => {
  formations = await iDB.formation.get()
  return formations
}

export const saveFormation = async formation => {
  formation = await iDB.formation.save(formation)
  return formation
}

export const removeFormation = async formation => {
  formation = await iDB.formation.delete(formation)
  return formation
}
