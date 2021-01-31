const mongoose = require('mongoose')
const eventschema = new mongoose.Schema({
    indexnumber: {
        type: String,
        required: false,
        default: "0"
    },
    name: {
        type: String,
        required: true
    },
    image:
    {
        type: String,
        required: true
    }
})
mongoose.model("Event", eventschema)