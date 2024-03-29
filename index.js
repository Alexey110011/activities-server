require('dotenv').config()
const express = require('express'); 
const bodyParser = require('body-parser')
const model = require('./model')
const merchant_model = require('./contragent_model.js')
const tests_model = require('./tests_model')
const app = express();
const port = process.env.PORT || 4000; 
const JSONquestions = require('./questions/questions.json')
const JSONanswers = require('./answers/answers.json')
//*****************************Books server//*********************************** */
require('./passport')
const authMethods = require('./authentication')
const passport = require('passport')
const jwt = require('jsonwebtoken')  //if using jsonwebtoken package


const Pool = require('pg').Pool

const pool = new Pool({
    connectionString:process.env.DATABASE_URL,
  ssl:{
    rejectUnauthorized:false
  }
})
//pool.connect()
const cors = require('cors')
app.use(cors())
//************************************************************************************************************* */
/*const {expressjwt:jwt} = require('express-jwt')---Using express-jwt package
  let auth = jwt({
  secret:process.env.JWT_SECRET,
  userProperty:'payload',
  algorithms:['HS256']
})*/
//************************************************************************************************************* */

//******************************************Books server**************************************************** */

let auth = (req, res, next)=>{
  try{
    const {authorization} = req.headers
    console.log(10,req.headers.authorization)
    if(authorization){
        const token =  req.headers.authorization.split(" ")[1]
        console.log(11,token)
        const result = jwt.verify(token, process.env.JWT_SECRET,{algorithms:['HS256']})
        req.payload = result
    console.log(11,result,12,req.payload)
    next()
    } else {
        res.send("No Token")
    } 
}
catch{
    res.send({"message":'ERROR'})
}
}

app.use(function(err, req, res,next){
  if(err.name==="UnauthorizedError"){
    res.status(401)
    res.json({"message":err.name + ":" + err.message})
}
})
app.use(function (req, res, next) {
  const allowedOrigin = ["https://sparkling-malasada-6c08c8.netlify.app", "https://gentle-semifreddo-803079.netlify.app","https://beamish-treacle-2d1dc7.netlify.app"]
  const origin = req.headers.origin
  if(allowedOrigin.includes(origin)){
    res.setHeader('Access-Control-Allow-Origin', origin)
  }
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type', 'Access-Control-Allow-Headers','Authorization');
  next();});
//******************************************************************************* */
//Code below is REST for project "Angular _Books"
app.use(express.json())
app.use (bodyParser.urlencoded({extended:false}))
app.use( bodyParser.json())
app.use(passport.initialize())

  let books=[];
  let reviews=[];
  
  const getBook = (_id)=>{
    try{
      return books.find(book=>book._id==_id)
    } catch (err){
      console.log("Error")
    }
  }
  
  function getReviewsForBook(bookId){
    return reviews.filter(review=>review.bookid==bookId)
  }

  app.get('/books', function(req, res){
    model.getAllBooks()
    .then(response=>{
      res.status(200);
      books = response
      res.send(books)
      console.log(books)})
    .catch(err=>{
      res.status(500).send(err)
  })
  model.getReviewsForBooks()
    .then(response=>{
      res.status(200)
      reviews = response
      console.log(reviews)})
    .catch(err=>{console.log(err)})
  })
 
  app.get('/products/:_id', (req, res)=>{
    console.log(books)
    res.json(getBook(req.params._id))
    const filtered = getReviewsForBook(req.params._id)
    console.log(req.params._id, filtered)
  })

  app.get('/products/:_id/reviews', (req, res)=>{
    res.json(getReviewsForBook(req.params._id))
  })

app.post('/booksFromDb1', (req, res)=>{
    console.log(req.body)
    model.createBook(req.body)
    .then(response => {
      res.status(200).send(response);
    })
    .catch(error => {
      res.status(500).send(error);
    })})
       
  app.post('/products/:bookId/addReview',auth,(req, res)=>{
    model.addReviewToDb(req)
    .then(response => {
      reviews.push(response)
      res.status(200).send(response);
      console.log(1000,response.rows)
    })
    .catch(error => {
      res.status(500).send(error);
      console.log("k")
    })
  })

  app.put('/products/:bookId/addReview/updateRating',(req, res)=>{
    model.updateRating(req)
    .then(response=>{
      res.status(200).send(response)
      console.log(5,response)
    })
    .catch(error=>{
      res.status(500).send(error);
      console.log(error)
    })
 })
       
app.post('/register', (req, res)=>{
  authMethods.register(req,res)
    .then(response => {
      res.status(200).send(response);
        console.log(response)
      })
      .catch(error => {
        res.status(500).send(error);
      })
})
      
app.post('/login', (req, res)=>{
  console.log(2,req.body)
    authMethods.login(req,res)
})

app.get('/getUser', (req, res)=>{
    authMethods.getUser(req)
    .then (response=>{res.send(response)})
    .catch(err=>console.log(err))
})

app.post('/checkUserEmail', (req, res)=>{
  authMethods.getUserByEmail(req.body)
  .then (response=>{res.send(response);console.log(response)})
  .catch(err=>console.log(err))
})

app.post('/checkRegExpName', (req, res)=>{
    authMethods.getRegExpName(req)
    .then(response=>{res.send(response);console.log(response)})
  })

app.post('/checkRegExpEmail', (req, res)=>{
    authMethods.getRegExpEmail(req)
    .then(response=>{res.send(response);console.log(response)})
  })
//************************************************************************************ */
app.get('/m', (req, res) => {
  merchant_model.getContragents()
  .then(response => {
    res.status(200).send(response);
  })
  .catch(error => {
    res.status(500).send(error);
  })})

app.get('/cleardb', (req,res)=>{
  merchant_model.clearDatabase()
  .then(response => {
    res.status(200).send(response);
  })
  .catch(error => {
    res.status(500).send(error);
  })})

  app.post('/times', (req, res) => {
      merchant_model.getTimeData(req.body)
      .then(response => {
        res.status(200).send(response);
        console.log(req.body,response)
      })
      .catch(error => {
        res.status(500).send(error);
      })})
      
  app.post('/contragents', (req, res) => {
      merchant_model.createContragent(req.body)
      .then(response => {
      res.status(200).send(response);
      console.log(req.body)
      })
      .catch(error => {
      res.status(500).send(error);
      console.log(error)
       })})

  app.put('/update', (req, res) => {
    merchant_model.updateContragent(req.body)
    .then(response => {
      res.status(200).send(response);
    })
    .catch(error => {
      res.status(500).send(error);
    })})
//************************************************************************************************************************ 
//Code below is REST for project "Tests_devs"
app.get('/getTests',(req, res)=>{
  console.log(JSONquestions,JSONanswers)
  res.send({questions:JSONquestions, answers:JSONanswers})
})

app.post('/postTest',(req, res)=>{
    console.log(req.body.answer)
    tests_model.passTest(req,res)
    .then(response => {
      console.log(response.rows);res.status(200).send(response);
    })
    .catch(error => {
      res.status(500).send(error);
    })
 })

app.post('/postTestFromLocalStorage',(req, res)=>{
  console.log(req.body.answer)
  tests_model.passTestFromLocalStorage(req,res)
  .then(response => {
    console.log(response.rows);res.status(200).send(response);
  })
  .catch(error => {
    ress.status(500).send(error);
  })
})

app.post('/isTestPassed', (req, res)=>{
  tests_model.passedTest(req, res)
  .then(response=>{
    res.status(200).send(response);console.log('If test Passed',response)})
    .catch(error=>{
      res.status(500).send(error)
      console.log(error)})
})

app.post('/registerStudent', (req, res)=>{
    tests_model.register (req, res)
  .then(response => {
    res.status(200).send(response);
    console.log(response)
  })
  .catch(error => {
    console.log(error)
  })
})

app.post('/loginStudent', (req, res)=>{
  console.log(2,req.body)
    tests_model.login(req,res)
})

app.post('/ch',(req, res)=>{
  console.log(130,req.body)
  tests_model.checkUserByNameSurname(req, res)
  .then (response=>{res.send(response);console.log(response)})
  .catch(err=>console.log(err))
})

app.post('/checkStudentEmail', (req, res)=>{
  tests_model.checkRegExpEmail(req)
  .then(response=>{res.send(response);console.log(response)})
})

app.post('/checkuser', (req, res)=>{
  console.log(req.body)
  res.send(req.body)
})

app.listen(process.env.PORT||port, () => console.log(`Listening on port ${port}`)); 