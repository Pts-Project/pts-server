const jwt=require('jsonwebtoken')
const {JWTSECRET}=require('../keys')
const mongoose=require('mongoose')
const     Admin=mongoose.model("Admin")
        

module.exports=(req,res,next)=>{
    const {authorization}=req.headers
     if(!authorization){
         return res.status(401).json({error:"you must be logged in"})







     }
     const token=authorization.replace("Bearer","")
     jwt.verify(token,JWTSECRET,(err,payload)=>{
          if(err){
                 return res.status(401).json({err})
          }
            const{_id}=payload
                         Admin.findById(_id).then(userdata=>{
                                 req.user=userdata
                          next()
              })
               
     })
}