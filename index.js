const express = require('express'); 
const cors = require('cors')
const app = express();
const port = process.env.PORT || 4000; 
const merchant_model = require('./contragent_model.js')



app.use(express.json())
app.use(cors(
  {origin:'https://sparkling-malasada-6c08c8.netlify.app',
  methods: ['GET','POST','DELETE','UPDATE','PUT','PATCH'],
  headers: ['Content-Type','Access-Control-Allow-Headers']}
))
/*app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', 'https://sparkling-malasada-6c08c8.netlify.app');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type', 'Access-Control-Allow-Headers');
  next();});*/

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
    /*res.set('Access-Control-Allow-Origin', '*')*/
    merchant_model.createContragent(req.body)
      .then(response => {
      res.status(200).send(response);
      })
    .catch(error => {
      res.status(500).send(error);
      console.log(req.body)
    })})

  app.put('/merchants/update', (req, res) => {
    merchant_model.updateContragent(req.body)
    .then(response => {
      res.status(200).send(response);
    })
    .catch(error => {
      res.status(500).send(error);
    })})

app.get('/check', function(req, res){
  if(error){
    console.log(error)
  } else{
    res.send("Server works!")
  }
})
app.listen(process.env.PORT||port, () => console.log(`Listening on port ${port}`)); 