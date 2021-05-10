const mongoose=require('mongoose')
const  projectschema= new mongoose.Schema({
  
    name:{
        type:String,
        required:true
    },
 
     link:
    {
        type:String,
        required:true
    },
     description:
     {
         type:String,
         required:false
     },
     email:{
        type:String,
        required:false
     },
    
    
    })
mongoose.model("Project",projectschema)