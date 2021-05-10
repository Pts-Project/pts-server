const mongoose=require('mongoose')
const  eventschema= new mongoose.Schema({
    indexnumber:{
          type:String,
          required:false,
          default:"0"
    },




formurl:{
    type:String,
    required:true,
},


    name:{
        type:String,
        required:true
    },
 
    date:
    {
        type:String,
        required:false
    },
     image:
    {
        type:String,
        required:true
    },
     description:
     {
         type:String,
         required:false
     },
    
    
    
    
    
    })
mongoose.model( "Event",eventschema)