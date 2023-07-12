
const express = require('express')
const ADODB = require('node-adodb');
const connection = ADODB.open('Provider=Microsoft.Jet.OLEDB.4.0;Data Source=node-adodb.mdb;Jet OLEDB:Database Password=canabis123;');
const app = express()
const port = 4000



async function Afficher() {
    try {
        const users = await connection.query('SELECT * FROM Person');

        console.log(JSON.stringify(users, null, 2));
        return users

    } catch (error) {
        console.error(error);
    }
}

Afficher()



async function ajouter(table, data) {
    const keys = Object.keys(data[0]).join(', ')
    const values = data.map(one => `INSERT INTO ${table} (${keys}) VALUES  (${Object.values(one).map(one => `"${one}"`).join(', ')})`)

    try {
        const resultat = await Promise.all(values.map((query) => connection.execute(query)))
        return resultat

    } catch (error) {
        console.error(error);
    }

}

let donne = [
    { Nom: "Natenaina", Prenom: "Fidele", Age: "29" }
]
ajouter('Person', donne)



app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})