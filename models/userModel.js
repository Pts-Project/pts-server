//CREATING MONGOOSE SCHEMA NAMED "User" TO STORE USER'S DETAIL

const mongoose = require('mongoose')
const { ObjectId } = mongoose.Schema.Types
const userSchema = new mongoose.Schema({
    indexNumber: {
        type: String,
        default: "0"
    },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },

    mobile: {
        type: String,
        required: true
    },
 

    resetToken: String,
    expireToken: Date
})
mongoose.model("UserAuth", userSchema)
