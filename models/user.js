const mongoose = require('mongoose')
const userSchema = new mongoose.Schema({
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
      contactnumber:{
          type:String,
          required:false
      },
      password:{
              type:String,
              required:true
      },
        skills:
      {
        type:Array,
			value: [Object],
         required:false,
      }
})
mongoose.model("User",userSchema)
