import fs from "fs"

const isLocal = fs.existsSync(".env.local") 
require('dotenv').config({ path: isLocal ? '.env.local': ".env" })
const app = require("./server").default(true, false)

app.listen(process.env.PORT, () => {
  console.log('Backend Launched.')
})