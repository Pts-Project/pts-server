const express = require('express')
const router = express.Router() //used to create APIs

//to save user details to mongo db
const mongoose = require('mongoose')
const User = mongoose.model("User")
const crypto = require('crypto')
const Event=mongoose.model("Event")
//Used for security purpose
const bcrypt = require('bcrypt') //used to hash password
const jwt = require('jsonwebtoken') //library to create jwt token
const { JWTSECRET, SENDGRID_API, EMAIL } = require('../keys') //gives a unique token to every entry
const {userValidator,userValidator1 ,userValidationResult} =require('../validators/userValidators')
const projectschema=mongoose.model("Project")

//Used for sending emails
const nodemailer = require('nodemailer')
const sendgridTransport = require('nodemailer-sendgrid-transport')

const generateJwtToken = (_id, role) => {
    return jwt.sign({ _id, role }, JWTSECRET);
  };
//SEND EMAIL FUNCTION STARTS
const transporter = nodemailer.createTransport(sendgridTransport({
    auth: {
        api_key: SENDGRID_API
    }
}))
//SEND EMAIL FUNCTION ENDS



//GET ALL USERS ROUTE START
router.get('/allUsers', (req, res) => {
    User.find()
        .then(users => {
            res.json({ users })
        })
        .catch(err => {
            console.log(err)
        })
})
//GET ALL USERS ROUTE END

router.post('/addevent',  (req, res) => {
    const { name, formurl, image} = req.body
    const product = new Event({
         name, image,formurl

   })
   product.save()
        .then(user => {
            res.json({ message: "saved succesfully" })
           
        })
        .catch(err => {
            console.log(err)
        })
})


//SIGNUP ROUTE START
router.post('/user/signup',userValidator1,userValidationResult, (req, res) => {
    const { name, email, password,mobile ,image} = req.body //take user details from frontend
  /*  if (!email || !name || !password || !mobile) { //if these fields are not present ,it sends a error with a status code of 422
        return res.status(422).json({ error: "please add all the fields" })
    }*/
    User.findOne({ email: email }) //find user with the help of email
        .then((savedUser) => {
            if (savedUser) {
                return res.status(422).json({ error: "User already exists with that email" })
            }
            bcrypt.hash(password, 12)//hashed the password
                .then(hashedpassword => {
                    const user = new User({ //Creating a new user to save the details
                        email,
                        name,
                        password: hashedpassword,
                        mobile,
                        image
                    })
                    user.save()
                        .then(user => {
                            transporter.sendMail({  //sending mail to user email
                                to: user.email,
                                from: "49trishasahu@gmail.com",
                                subject: "signup success",
                                html: "<h2>Welcome to our website</h2>"
                            })
                          
                              /*  const token = generateJwtToken(user._id, user.role);
                                const { _id, name, email, role } = user;
                                return res.status(201).json({
                                  token,
                                  user: { _id,name, email, role },
                                });*/
                              
                                res.json({ message: " User Registered successfully" })
                        })
                        .catch(err => {
                            console.log(err)
                        })
                })

        })
        .catch(err => {
            console.log(err)
        })
})
//SIGNUP ROUTE END 

//SIGNIN ROUTE START
router.post('/user/login',userValidator1,userValidationResult,(req, res) => {
    const { email, password } = req.body
    if (!email || !password) {
        return res.status(422).json({ error: "please add email or password" })
    }
    User.findOne({ email: email })
        .then(savedUser => {
            if (!savedUser) { //if user doesn't exist,send a error response
                return res.status(422).json({ error: "Invalid email or password" })
            }
            bcrypt.compare(password, savedUser.password) //compare the entered password with the existing one
                .then(doMatch => {
                    if (doMatch&& savedUser.role === "user") {
                     //   const isPassword = await user.authenticate(req.body.password);
                       // if (password && user.role === "user") {
                          // const token = jwt.sign(
                          //   { _id: user._id, role: user.role },
                          //   process.env.JWT_SECRET,
                          //   { expiresIn: "1d" }
                          // );
                          const token = generateJwtToken(savedUser._id, savedUser.role);
                          const { _id, name, email,mobile, role ,image} = savedUser;
                          res.status(200).json({
                            token,
                            user: { _id, name, email,mobile, role,image },
                          });
                        
                    } else {
                        res.status(422).json({ error: "Invalid email or password" })
                    }
                })
                .catch(err => {
                    console.log(err)
                })
        })
})

//SIGNIN ROUTE END

//Admin Signup Starts
router.post('/admin/signup',userValidator1,userValidationResult, (req, res) => {
    const { name, email, password,mobile } = req.body //take user details from frontend
  /*  if (!email || !name || !password || !mobile) { //if these fields are not present ,it sends a error with a status code of 422
        return res.status(422).json({ error: "please add all the fields" })
    }*/
    User.findOne({ email: email }) //find user with the help of email
        .then((savedUser) => {
            if (savedUser) {
                return res.status(422).json({ error: "Admin already exists with that email" })
            }
            let role = "admin";
            bcrypt.hash(password, 12)//hashed the password
                .then(hashedpassword => {
                    const user = new User({ //Creating a new user to save the details
                        email,
                        name,
                        password: hashedpassword,
                        mobile,
                        role
                    })
                    user.save()
                        .then(user => {
                            transporter.sendMail({  //sending mail to user email
                                to: user.email,
                                from: "49trishasahu@gmail.com",
                                subject: "signup success",
                                html: "<h2>Welcome to our website</h2>"
                            })
                          
                               /*const token = generateJwtToken(user._id, user.role);
                                const { _id, name, email, role } = user;
                                return res.status(201).json({
                                 
                                  user: { _id,name, email, role },
                                });*/
                                res.json({ message: " Admin Registered successfully" })
                         
                        })
                        .catch(err => {
                            console.log(err)
                        })
                })

        })
        .catch(err => {
            console.log(err)
        })
})

//admin signup ends


//admin login starts
router.post('/admin/login',userValidator1,userValidationResult,(req, res) => {
    const { email, password } = req.body
    if (!email || !password) {
        return res.status(422).json({ error: "please add email or password" })
    }
    User.findOne({ email: email })
        .then(savedUser => {
            if (!savedUser) { //if user doesn't exist,send a error response
                return res.status(422).json({ error: "Invalid email or password" })
            }
            bcrypt.compare(password, savedUser.password) //compare the entered password with the existing one
                .then(doMatch => {
                    if (doMatch&& savedUser.role === "admin") {
                     //   const isPassword = await user.authenticate(req.body.password);
                       // if (password && user.role === "user") {
                          // const token = jwt.sign(
                          //   { _id: user._id, role: user.role },
                          //   process.env.JWT_SECRET,
                          //   { expiresIn: "1d" }
                          // );
                          const token = generateJwtToken(savedUser._id, savedUser.role);
                          const { _id, name, email, role ,image} = savedUser;
                          res.status(200).json({
                            token,
                            user: { _id, name, email, role,image },
                          });
                        
                    } else {
                        res.status(422).json({ error: "Invalid email or password" })
                    }
                })
                .catch(err => {
                    console.log(err)
                })
        })
})

//admin login ends

//PASSWORD RESET ROUTE STARTS
router.post('/changePassword', (req, res) => {
    crypto.randomBytes(32, (err, buffer) => {  //create a token
        if (err) {
            console.log(err)
        }
        const token = buffer.toString("hex")
        User.findOne({ email: req.body.email })
            .then(user => {
                if (!user) {
                    return res.status(422).json({ error: "User doesn't exist with that email" })
                }
                user.resetToken = token
                user.expireToken = Date.now() + 3600000
                user.save().then((result) => {
                    transporter.sendMail({
                        to: user.email,
                        from: "49trishasahu@gmail.com",
                        subject: "password-reset",
                        html: `
                                 <p>You requested for password reset</p>
                                    <h4>Click on this <a href="${EMAIL}/reset/${token}">link</a> to reset password.</h4>
                          
                                    `
                    })
                    res.json({ message: "Check your email " })
                })
            })
    })
})
//PASSWORD RESET ROUTE ENDS

//NEW PASSWORD ROUTE STARTS
router.post('/new-password',userValidator1,userValidationResult, (req, res) => {
    const newPassword = req.body.password
  
    const sentToken = req.body.token
    User.findOne({ resetToken: sentToken, expireToken: { $gt: Date.now() } })
        .then(user => {
            if (!user) {
                res.status(422).json({ error: "Try again session expired" })
            }
            bcrypt.hash(newPassword, 12).then(hashedpassword => {
                user.password = hashedpassword
                user.resetToken = undefined
                user.expireToken = undefined
                user.save().then((savedUser) => {
                    res.json({ message: "Password updated successfully" })
                })
            })
        })
        .catch(err => {
            console.log(err)
        })
})
//NEW PASSWORD ROUTE ENDS

//DELETE USER ROUTE START
router.delete('/deleteUser/:userId', (req, res) => {
    User.findOne({ _id: req.params.userId })
        .populate("postedBy", "_id")
        .exec((err, user) => {
            if (err || !user) {
                return res.status(422).json({ error: err })
            }

            user.remove()
                .then(result => {
                    res.json({ message: "successfully deleted" })
                }).catch(err => {
                    console.log(err)
                })

        })
})
//DELETE USER ROUTE END

//UPDATE PROFILE STARTS
router.put('/updateProfile/:userId',async (req, res) => { 
   
    const salt=await bcrypt.genSalt(10)

  const hashedpassword=await bcrypt.hash(req.body.password,salt)
 req.body.password=hashedpassword;

    User.findByIdAndUpdate({_id: req.params.userId},req.body,{ useFindAndModify: false })
    .then(data => {
        
        if (!data) {
          res.status(404).send({
            message: `Update Unsuccessful`
          });
        } else {
            // const token = generateJwtToken(savedUser._id, savedUser.role);
            // const { _id, name, email,mobile, role } = savedUser;
            // res.status(200).json({
            //   token,
            //   user: { _id, name, email,mobile, role },
            // });
            res.status(200).send({email:req.body.email,name:req.body.name,mobile:req.body.mobile,_id:req.params.userId,role:data.role,image:req.body.image})
        }   
      })
      .catch(err => {
        res.status(500).send({
          message: "Error in updating" 
        });
      }); 
})
//UPDATE PROFILE ENDS



router.post('/user/addproject',async(request,response,next)=>{
    
    const project=new projectschema({
        name:request.body.name,
        description:request.body.description,
        link:request.body.link,
        email:request.body.email

     
    })
    project.save()
    .then(data=>{
        response.json(data)

    })
    .catch(error=>{
        response.json(error)
    })
});


//GET ALL USERS ROUTE START
router.get('/allprojects', (req, res) => {
    projectschema.find()
        .then(users => {
            res.json({ users })
        })
        .catch(err => {
            console.log(err)
        })
})
//GET ALL USERS ROUTE END

router.get('/allevents', (req, res) => {
    projectschema.find()
        .then(users => {
            res.json({ users })
        })
        .catch(err => {
            console.log(err)
        })
})


router.delete('/deleteEvent/:eventId', (req, res) => {
    User.findOne({ _id: req.params.eventId })
        .populate("postedBy", "_id")
        .exec((err, user) => {
            if (err || !user) {
                return res.status(422).json({ error: err })
            }

            events.remove()
                .then(result => {
                    res.json({ message: "successfully deleted" })
                }).catch(err => {
                    console.log(err)
                })

        })
})



module.exports = router

