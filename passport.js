const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const Pool = require('pg').Pool
const pool = new Pool({
  connectionString:process.env.DATABASE_URL,
  ssl:{
    rejectUnauthorized:false
  }
})
const authMethods = require('./authentication')
const emailExists = (username)=>{
    return new Promise (function(resolve, reject){
      pool.query(`SELECT * FROM users WHERE email = $1`,[username],(error, results)=>{
        if (error) {
          reject(error)
        }
          resolve(results.rows)
        })
    })
}

passport.use(new LocalStrategy({
    usernameField:'email'
   },
    async function(username, password, done){
      const user1 = await emailExists(username)
      const user  = await user1[0]
         console.log(200,user,300)
      if(!user) return done(null, false, {
              message:"Incorrect username"
      })
      if(!authMethods.validPassword(user,password)){
          return done(null, false, {
              message:"Incorrect password"
          })
        } 
      return done(null,user)
      })
  )