import iDB from '../../services/iDB'
import { ConnexionTypes, Data } from '../../types'

export const getConnexions = async (connexions = []) => {
  connexions = await iDB.connexion.get()
  return connexions
}

export const saveConnexion = async (connexion: any)  => {
  connexion = await iDB.connexion.save(connexion)
  return connexion
}

export const removeConnexion = async (connexion: any) => {
  connexion = await iDB.connexion.delete(connexion)
  return connexion
}
