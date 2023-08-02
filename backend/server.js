//dependencies
const express = require('express')
const app = express()
const mongoose = require('mongoose')
const dotenv = require('dotenv');
dotenv.config()

const {PORT, MONGO_URI}= process.env


app.post('/register', (req,res)=>{
  
})

app.get('/test', (req,res)=>{
  res.json('test ok')
})








//feedback of connection
mongoose.connect(MONGO_URI)
  .then(() => {
    //App listener
    app.listen(PORT, () => {
      console.log(`Connected to db and listening on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.log(error);
  });





