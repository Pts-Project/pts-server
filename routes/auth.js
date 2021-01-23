const express=require('express')
const mongoose=require('mongoose')
const bcrypt=require('bcryptjs')
const jwt=require('jsonwebtoken')
const requiredlogin=require('../middleware/requiredlogin')
const { JWTSECRET } = require('../keys')
const router=express.Router()
const User=mongoose.model("User")







const Admin=mongoose.model("Admin")






const Event=mongoose.model("Event")






var x=0;
var y=0;
     router.post('/adduser',(req,res)=>{
     const {name,email,password,contactnumber,id,date,skills} = req.body






      if(!email||!password){
            return res.status(422).json({error:"please add all the fields"})
      }
         User.findOne({email:email})
         .then((savedUser)=>{
             if(savedUser){
                         return res.status(422).json({error:"user already exist with that email"})                     
             }
              bcrypt.hash(password,14)
              .then(hashedpassword=>{
                  const user = new User({
                     id:x+1,
                      email,
                      password:hashedpassword,
                        contactnumber                 ,
                      name,
                      date,
                        skills,
                 })
                 user.save()
                 
                 .then(user=>{
                      res.json({message:"saved succesfully"})
                      x=x+1;
                 })
                 .catch(err=>{
                  console.log(err)
             })

              })
             
         })
         .catch(err=>{
          console.log(err)
     })
})
router.post('/adminsignup',(req,res)=> {
     const {name,email,password,designation,contactnumber,date,id,skills} = req.body






      if(!email||!password){
            return res.status(422).json({error:"please add all the fields"})
      }
         Admin.findOne({email:email})
         .then((savedUser)=>{
             if(savedUser){
                         return res.status(422).json({error:"user already exist with that email"})                     
             }
              bcrypt.hash(password,14)
              .then(hashedpassword=>{
                  const user = new Admin({
                     id:x+1,
                      email,
                      password:hashedpassword,
                                                                                       designation,
                                                                                        contactnumber,
                      name                      ,
                      date,
                      skills
                 })
                 user.save()
                 
                 .then(user=>{
                      res.json({message:"saved succesfully"})
                      x=x+1;
                 })
                 .catch(err=>{
                  console.log(err)
             })

              })
             
         })
         .catch(err=>{admin
          console.log(err)
     })
})
router.post('/adminlogin',(req,res)=>{
 const {email,password} = req.body
 if(!email || !password){
      return res.status(422).json({error:"please add email or password"})
 }
 Admin.findOne({email:email})
 .then(savedUser=>{
      if(!savedUser){
          res.send("Invalid Username or Password")
      }
      bcrypt.compare(password,savedUser.password)
   

       .then(doMatch=>{
            if(doMatch){
               const token =            jwt.sign({_id:savedUser._id},JWTSECRET)  
               res.status(200).send("Authenticated")
              
            }else{
               res.status(200).send("Authentication failed")
            }
           
       }).catch(err=>{
        console.log(err)
 })
 })
})
router.put('/changeadminpassword',requiredlogin,(req,res)=>{
     const {newpassword} = req.body
     if(!newpassword){
          return res.status(422).json({error:"please add email or password"})
     }
          Admin.findOne({_id:req.user._id}).then(userdata=>{
                    bcrypt.hash(newpassword,14)
                    .then(hashedpassword=>{
                         userdata.password=hashedpassword
                        userdata.save()
                       .then(user=>{
                            res.json({message:"saved succesfully"})
                       })
                       .catch(err=>{
                        console.log(err)
                   })
    
                        
    
                })
           })
    
})
router.put('/changeuserpassword',requiredlogin,(req,res)=>{
     const {newpassword} = req.body
     if(!newpassword){
          return res.status(422).json({error:"please add email or password"})
     }
           User.findOne({_id:req.user._id}).then(userdata=>{
                    bcrypt.hash(newpassword,14)
                    .then(hashedpassword=>{
                         userdata.password=hashedpassword
                        userdata.save()
                       .then(user=>{
                            res.json({message:"saved succesfully"})
                       })
                       .catch(err=>{
                        console.log(err)
                   })
    
                        
    
                })
               })
    
})
router.get('/user',requiredlogin,(req,res)=>{
        User.find().then(user=>{
              res.json({user})
              
        })
})
router.delete('/delete/user/:email',requiredlogin,(req,res)=>{
       email=req.params.email
       User.findOne({email:email}).then(deleteuser=>{
              if(deleteuser)
              {
                     deleteuser.deleteOne()
                     return res.json(({message:"deleted"}))
              }
              else{
                       return res.status(422).json({message:"user doesnt exist"})
              }
       })
})
router.post('/event/create',requiredlogin,(req,res)=>{
     const{indexnumber,name,category,image,date,description}=req.body
     if(!name||!category||!description){
            return res.status(422).json({error:"please add all the fields"})
      }
       Event.findOne({name:name})
         .then(savedUser=>{
             if(savedUser){
                         return res.status(422).json({error:"event already exist with that name"})                     
             }
             else{
                  const product = new Event({
                    indexnumber:y+1,name,category,image    ,    description ,date
     
                 })
                       product.save()
                 .then(user=>{
                      res.json({message:"saved succesfully"})
                      y=y+1
                 })
                 .catch(err=>{
                  console.log(err)
             })
          }

              })
             
         })
router.get('/events',requiredlogin,(req,res)=>{
        Event.find().then(list=>{
               res.json({list})
        })
        
})
router.get( '/events/:id',requiredlogin,(req,res)=>{
     indexnumber=req.params.id
          Event.findOne({indexnumber:indexnumber}).then(detail=>{
                  if(!detail){
                           return res.status(422).json({error:"can not find any event  with this indexnumber"})
                  }
                   res.json({detail})

       })
})
router.delete('/delete/events',requiredlogin,(req,res)=>{
          const name = req.body.name
     Product.findOne({name:name}).then(deleteproduct=>{
            if(deleteproduct)
            {
                   deleteproduct.deleteOne()
                   return res.json(({message:"deleted"}))
            }
            else{
                     return res.status(422).json({error:"event doesnt exist"})
            }
     })
})
module.exports =  router