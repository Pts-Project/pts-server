const mongoose = require('mongoose')
const    adminSchema = new mongoose.Schema({
     id:{
         type:String,
          required:false
     },
      name:{
          type:String,
          required:true
      },
      email:{
        type:String,
           required:true
      },
      date: { type: Date, default: Date.now,required:false},
       designation:{ type:String, required:true},
      contactnumber:{
          type:String,
          required:false
      },
      password:{
              type:String,
              required:true
      }
})
mongoose.model("Admin",     adminSchema)
