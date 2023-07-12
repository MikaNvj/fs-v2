export default  db => {
  db.customer.hasMany(db.payment)
  db.payment.belongsTo(db.customer)
  
  db.user.hasMany(db.payment)
  db.payment.belongsTo(db.user)

  db.formation.hasMany(db.program)
  db.program.belongsTo(db.formation)

  db.payment.hasMany(db.income)
  db.income.belongsTo(db.payment)

  db.cert.belongsTo(db.payment, {as: 'formation'})
}