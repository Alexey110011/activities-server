const Pool = require('pg').Pool
const pool = new Pool({
  user: 'my_user',
  host: 'localhost',
  database: 'my_database_1',
  password: 'root',
  port: 5432,});

  const getContragents = () => {
    
    return new Promise(function(resolve, reject) {
      pool.query('SELECT* FROM contragents ORDER BY fullname ASC', (error, results) => {
        if (error) {
          reject(error)
        }
        resolve(results.rows);
      })
    }) 
  }

  const createContragent = (body) => {
    return new Promise(function(resolve, reject) {
      const { _id, fullname, date, type, amount, email, phone,address, question } = body
      pool.query('INSERT INTO contragents (_id, fullname, date, type, amount, email, phone,address, question) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *', [_id, fullname, date, type, amount, email, phone,address, question], (error, results) => {
        if (error) {
          reject(error)
        }
        resolve(`A new merchant has been added added: ${results}`)
      })
    })
  }

  const getTimeData = (body)=>{
    return new Promise(function(resolve, reject) {
      const {sign, date} = body
          console.log(sign)
        if(sign ==="Before"){
      pool.query('SELECT * FROM contragents WHERE date<$1',[date],(error, results) => {
        if (error) {
          reject(error)
        }
        resolve(results.rows);
      })}
      else if(sign==="Until"){
        pool.query('SELECT * FROM contragents WHERE date<=$1',[date],(error, results) => {
          if (error) {
            reject(error)
          }
          resolve(results.rows);
        })}
      else if(sign==="For"){
        pool.query('SELECT * FROM contragents WHERE date=$1',[date],(error, results) => {
          if (error) {
            reject(error)
          }
          resolve(results.rows);
        })}
      else if(sign === "From"){
        pool.query('SELECT * FROM contragents WHERE date>=$1',[date],(error, results) => {
          if (error) {
            reject(error)
          }
          resolve(results.rows);
        })}
      else if(sign ==="After"){
        pool.query('SELECT * FROM contragents WHERE date>$1',[date],(error, results) => {
          if (error) {
            reject(error)
          }
          resolve(results.rows);
        })}
    }) 
  }

    const updateContragent = (body) => {
       return new Promise(function(resolve, reject) {
        const {question, _id} = body
        pool.query('UPDATE contragents set question=$1 WHERE _id = $2', [question,_id], (error, results) => {
          if (error) {
            reject(error)
          }
          resolve(`A one merchant has been updated: ${results}`)
        })
      })
    }

      const clearDatabase = () =>{
        return new Promise(function(resolve, reject) {
          pool.query('DELETE FROM contragents', (error, results) => {
            if (error) {
              reject(error)
            }
            resolve("Cleared"/*ults.rows*/);
          })
        }) 
      }

  module.exports = {
    getContragents,
    getTimeData,
    createContragent,
    updateContragent, 
    clearDatabase}