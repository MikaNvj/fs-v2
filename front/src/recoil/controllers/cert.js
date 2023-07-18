import * as Service from '../../services/backends/cert'
import iDB from '../../services/iDB'

export const getCerts = async (certs = []) => {
  certs = await iDB.cert.get()
  return certs
}

export const saveCert = async cert => {
  cert = await iDB.cert.save(cert)
  return cert
}

export const removeCert = async cert  => {
  cert = await Service.removeCert(cert)
  return cert
}