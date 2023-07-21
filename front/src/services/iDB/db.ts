import { Data, Obj } from '../../types'
import {triggerEvent} from './Recoil'
const DATABASE_NAME = "fsmanager"

let DBNAME: IDBDatabase | undefined = undefined
let DB_V: number | undefined = undefined

const getDB = (force?: boolean, version?: number): Promise<IDBDatabase> => new Promise((ok, ko) => {
  // if (getDB.db && !force) ok(getDB.db)
  if (DBNAME && !force) ok(DBNAME)
  else {
    const request = indexedDB.open(DATABASE_NAME, version)
    request.onsuccess = e => {
      if (!force) DBNAME = request.result
      ok(request.result)
    }
  }
})

const dbTables = async () => {
  const db = await getDB()
  return Array.from(db.objectStoreNames)
}

// Insert Any data in local indexedDB
export const save = (table: string, data: Data) => new Promise(async (ok, ko) => {
  const db = await getDB()
  const rq = db.transaction(table, "readwrite").objectStore(table).put(data)
  rq.onsuccess = _ => ok(data)
})

export const getAll = (table: string) => new Promise(async (ok, ko) => {
  var db = await getDB()
  const store = db.transaction(table, "readwrite").objectStore(table)
  store.getAll().onsuccess = e => ok((e.target as typeof e.target & {result: any}).result)
})

export const getObject = (table: string, id: string) => new Promise(async (ok, ko) => {
  var db = await getDB()
  const store = db.transaction(table, "readwrite").objectStore(table)
  store.get(id).onsuccess = e => ok((e.target as typeof e.target & {result: any}).result)
})

export const updateDatabase = async (newData: Obj<Data>, aliases: Obj<Data>) => {
  await createTable(Object.keys(newData))
  const db = await getDB()
  await Promise.all(Object.keys(newData).map(async table => {
    const tx = db.transaction(table, "readwrite")
    Object.values(aliases).filter(({ model }) => model === table).forEach(async ({ __id }) => {
      try{ tx.objectStore(table).delete(__id) }
      catch(e) { console.log('ID ' + __id + ' NOT FOUND TO DELETE') }
    })
    if (newData[table]) {
      const tx = db.transaction(table, "readwrite")
      newData[table].forEach((one: Data) => {
        tx.objectStore(table).put(one)
      })
    }

  }))

}

export const createTable = (all_table: string | string[]) => new Promise<void>(async (ok, ko) => {
  
  let tables: string[]
  if (typeof all_table === 'string') tables = [all_table]
  else tables = [...all_table]
  
  const db = await getDB()
  // if (!createTable.V) createTable.V = parseInt(db.version)
  if (!DB_V) DB_V = db.version
  
  // attach event
  tables = tables.filter(table => !db.objectStoreNames.contains(table))
  if (tables.length) {
    db.close()
    // getDB.db = undefined
    DBNAME = undefined
    // const db2 = indexedDB.open(DATABASE_NAME, ++createTable.V)
    const db2 = indexedDB.open(DATABASE_NAME, ++DB_V)
    db2.onupgradeneeded = () => {
      const database = db2.result
      tables.forEach(table => {
        const objStore = database.createObjectStore(table, { keyPath: 'id' })
        objStore.createIndex('_offline', '_offline', { unique: false })
      })
      database.close()
      getDB().then(_ => ok)
    }
  }
  else ok()
})

export const getAllNews = () => new Promise<Data[]>(async (ok, ko) => {
  const db = await getDB()
  const data = Array.from(db.objectStoreNames).map(table => new Promise<Data[]>((ok, ko) => {
    const result = db.transaction(table).objectStore(table).index('_offline').getAll()
    // result.onsuccess = ({ target: { result } }) => ok(result.map(one => Object.assign(one, { model: table })))
    result.onsuccess = (e) => ok((e.target as typeof e.target & {result: any}).result.map((one: any) => Object.assign(one, { model: table })))
  }))
  const newArray = (await Promise.all(data)).reduce((arr, res) => {
    arr.push(...res)
    return arr
  }, []).sort((a, b) => a.updatedAt < b.updatedAt ? -1 : 1)
  ok(newArray)
})

const DB = {
  createTable,
  getAll,
  updateDatabase,
  dbTables,
  getAllNews,
  save,
}

export default DB