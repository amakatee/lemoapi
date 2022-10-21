const mongoose = require('mongoose')


const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,

    },
    email: {
        type: String,
      

    },
    password: {
        type: String,
        required: true,

    },
    roles: [{
        type: String,
        default: "User"

    }],
    active: {
        type: Boolean,
        default: true

    },
    image: {
        type: String
    }
   
})

module.exports = mongoose.model('User', userSchema)