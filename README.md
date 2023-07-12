# FS-MANAGER
fiharySoft manager
***
## DB Wrapper in back/service
ORM qui utilise indexedDB
Les liste des fonctions
- createTable: Nom du table

- addAction(typeAction, NomTable, idData)

- insert(nomTable, dataContent): dataContent_forme == {} JSON FORMAT
- update(nomTable, dataContent): dataContent_forme == {}JSON FORMAT mais il est imperatif d'ajouter un idEXAMPLE: {id:4, attribut1:"nouveau valeur; etc"}
- getAll() : retourn array(JSON) avec key = id_valeur
- getAllAction(): retourn array(JSON) avec key = id_valeur


- NB: Mise à jour de donnée vers mysql en developpement !!
