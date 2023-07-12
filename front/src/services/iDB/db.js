const DATABASE_NAME = "fsmanager"

const getDB = (force, version) => new Promise((ok, ko) => {
  if (getDB.db && !force) ok(getDB.db)
  else {
    const request = indexedDB.open(DATABASE_NAME, version)
    request.onsuccess = e => {
      if (!force) getDB.db = request.result
      ok(request.result)
    }
  }
})

const dbTables = async () => {
  const db = await getDB()
  return Array.from(db.objectStoreNames)
}

// Insert Any data in local indexedDB
export const save = (table, data) => new Promise(async (ok, ko) => {
  const db = await getDB()
  const rq = db.transaction(table, "readwrite").objectStore(table).put(data)
  rq.onsuccess = _ => ok(data)
})

export const getAll = table => new Promise(async (ok, ko) => {
  var db = await getDB()
  const store = db.transaction(table, "readwrite").objectStore(table)
  store.getAll().onsuccess = e => ok(e.target.result)
})

export const getObject = (table, id) => new Promise(async (ok, ko) => {
  var db = await getDB()
  const store = db.transaction(table, "readwrite").objectStore(table)
  store.get(id).onsuccess = e => ok(e.target.result)
})

export const updateDatabase = async (newData, aliases) => {
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
      newData[table].forEach(one => {
        tx.objectStore(table).put(one)
      })
    }
  }))
}

export const createTable = tables => new Promise(async (ok, ko) => {
  if (typeof tables === 'string') tables = [tables]
  const db = await getDB()
  if (!createTable.V) createTable.V = parseInt(db.version)

  // attach event
  tables = tables.filter(table => !db.objectStoreNames.contains(table))
  if (tables.length) {
    db.close()
    getDB.db = undefined
    const db2 = indexedDB.open(DATABASE_NAME, ++createTable.V)
    db2.onupgradeneeded = () => {
      const database = db2.result
      tables.forEach(table => {
        const objStore = database.createObjectStore(table, { keyPath: 'id' })
        objStore.createIndex('_offline', '_offline', { unique: false })
      })
      database.close()
      getDB().then(ok)
    }
  }
  else ok()
})

export const getAllNews = () => new Promise(async (ok, ko) => {
  const db = await getDB()
  const data = Array.from(db.objectStoreNames).map(table => new Promise((ok, ko) => {
    const result = db.transaction(table).objectStore(table).index('_offline').getAll()
    result.onsuccess = ({ target: { result } }) => ok(result.map(one => Object.assign(one, { model: table })))
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