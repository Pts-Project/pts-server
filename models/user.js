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
    
      password:{
              type:String,
              required:true
      },

        skills:
      {
        type:Array,
			value: [Object],
         required:false,
      },
      role: {
        type: String,
        enum: ["user", "admin"],
        default: "user",
      },
      mobile: {
        type: String,
        required: true
    },
    image:{
      type:String,
      required:true
    },


    resetToken: String,
    expireToken: Date
})
mongoose.model("User",userSchema)
