const User = require('../models/User')
const Product = require('../models/Product')
const asyncHandler = require('express-async-handler')
const bcrypt = require('bcrypt')

//@desc Get all users
//@route GET /users
//@access Private

const getAllUsers = asyncHandler(async(req,res) => {
    const users = await User.find().select('-password').lean() // do not return the password with a user //lean just gives a json without mwthods
    if(!users?.length) {
        return res.status(400).json({message : "No users found"})
    }

    res.json(users)
})



//@desc Create new users
//@route POST /users
//@access Private

const createNewUser = asyncHandler(async(req,res) => {
    const {username, password, roles,image, email} = req.body
    //check
    if(!username || !password ) {
        return res.status(400).json({message: "All fileds are required"})
    } 
    //duplicates
    const duplicate = await User.findOne({username}).lean().exec() //sending data and recieving promise //while not saving
    if(duplicate) {
        return res.status(409).json({message: 'User is already exists'})
    }
    //hash password
    const hashPwd = await bcrypt.hash(password, 10) //salt rounds
    const userObject = { 
        username, 
        "password":hashPwd,
        roles,
        image,
        email
    }
    //create and store new user
    const user = await User.create(userObject)
    if(user) {
        res.status(201).json({message: `New user created ${username} `})
    } else {
        res.status(400).json({message: 'Invalid user data received'})
    }


})

//@desc Update a  user
//@route PATCH /users
//@access Private

const updateUser = asyncHandler(async(req,res) => {
    const {id, username, roles, active, password,image} = req.body
    if(!id || !username){
        return res.status(400).json({message: 'All fields are required'})
    }
    const user = await User.findById(id).exec()
    if(!user) {
        return res.status(400).json({message: 'User is not found'})
    }

    //duplicate 
    const duplicate = await User.findOne( {username}).lean().exec()
    if(duplicate && duplicate?._id.toString() !== id ){
        return res.status(409).json({message: "Duplicate username"})
    }

    user.username = username
    user.roles = roles
    user.active = active
    user.image = image

    if(password ) {
        //hash pwd
        user.password = await bcrypt.hash(password, 10)
     }

     const updatedUser = await user.save()

     res.json({message: `${updatedUser.username} updated`})

})

//@desc Delete a users
//@route DELETE /users
//@access Private

const deleteUser = asyncHandler(async(req,res) => {
    const {id } = req.body
    if(!id) {
        return res.status(400).json({ message: "User id is required"})
    }

    // const product = await Product.findOne({ user:id }).lean().exec()
    // if(product){
    //     return res.status(400).json({message: 'User has assigned products'})

    // }
    const user = await User.findById(id).exec()

    if(!user) {
        return res.status(400).json({message: 'no user found'})
    }
    
 

    const result = await user.deleteOne()
  
    const reply = `Username ${result.username} with ID  ${result._id} deleted`
    res.json(reply)
 
})

module.exports = {
    getAllUsers,
    createNewUser,
    updateUser,
    deleteUser
}