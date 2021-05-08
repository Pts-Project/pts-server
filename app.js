const express=require('express')
const app=express()
var bodyParser=require("body-parser"); 
const mongoose = require('mongoose')
const { MONGOURI } = require('./keys')
const { JWTSECRET } = require('./keys')
const PORT=process.env.PORT||5000
require('./models/user')
require('./models/events')
require('./models/userModel')


require('./models/project')



require('./models/admin')





const methodOverride = require('method-override');
app.use(methodOverride('_method'));




app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ 
    extended: true
})); 

app.use(require('./routes/auth'))
app.use(require('./routes/userAuth'))

mongoose.connect(    MONGOURI
    ,{
      useNewUrlParser:true, 
      useUnifiedTopology:true
} )
  





mongoose.connection.on('connected',()=>{
    console.log("connected")
})
mongoose.connection.on('error',(err)=>{
       console.log("error connecting")
})
app.listen(PORT,()=>{
     console.log("server is running succesfully")
})