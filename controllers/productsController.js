const express = require('express')
const Product = require('../models/Product')
const User = require('../models/User')
const asyncHandler = require('express-async-handler')
const multer = require('multer')
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");


const storage = multer.memoryStorage()
// const upload = multer({storage:storage})



const bucketName = process.env.BUCKET_NAME
const bucketRegion = process.env.BUCKET_REGION
const accessKey = process.env.ACCESS_KEY_S3
const secretAccessKey = process.env.ASECRET_ACCESS_KEY_S3

// const s3 = new S3Client({
//     credentials: {
//         accessKeyId:accessKey,
//         secretAccessKey: secretAccessKey
//     },
//     region:bucketRegion
// })

const getAllProducts = asyncHandler(async(req,res) => {
    const products = await Product.find().lean() // do not return the password with a user //lean just gives a json without mwthods
    if(!products?.length) {
        return res.status(400).json({message : "No product found"})
    }
    const productsWithUser = await Promise.all(products.map(async (product) => {
        const user = await User.find(product.user).lean().exec()
        return {...product, username:user.username }
    }))
    res.json(productsWithUser)
})

const createProduct = asyncHandler(async (req, res) => {
    const {title, price, types, text , user, image} = req.body
    if(!user || !title || !price || !text || !image) {
        return res.status(400).json({message: 'requires product data'})
    } 

   console.log(`req file${req}`)

    // const params={
    //     Bucket:bucketName,
    //     Key:req.file.originalname,
    //     Body: image,
    //     ContentType: req.file.mimetype
  
    // }
    // const command = new PutObjectCommand(params)
    //     await s3.send(command)
    
    

   
    const product = await Product.create({title, user, price, text, types, image})
    if(product) {
       
        return res.status(201).json({message: `product ${title}  created`})
        
    } else {
        return res.status(400).json({message: 'Invalid product Data'})
    }
})

const updateProduct = asyncHandler(async(req,res) => {
    const {id, text, price, types, title, image } = req.body
    if(!id ) {
        return res.status(400).json({message: "product data required" })
    }

    const product = await Product.findById(id).exec()
    if(!product) {
        return res.status(400).json({message:"No product found"})
    }

    const duplicate = await Product.findOne({title}).lean().exec()

    if(duplicate && duplicate?._id.toString() !== id) {
        return res.status(409).json({message: 'Duplicate title'})
    }

    // upload(req,res, (err) => {
    //     if(err) {
    //         console.log(err)
    //     } else {
    //         const newImage = image
    //     }
    // })

    product.title = title
    product.text = text
    product.price = price
    product.types = types
    product.image = image

    const updatedProduct =  await product.save()
    res.json({message: `Product ${updatedProduct.title} updated` })


})

const deleteProduct = asyncHandler( async(req, res) => {
    const {id} = req.body
    
    if(!id) {
        return res.status(400).json({message: "id required"})
    }
    const product = await Product.findById(id).exec()

    if(!product) {
        return res.status(400).json({message: "no product found"})
    }

    const result = product.deleteOne()
    const reply = `Product ${result.title} with ID ${result._id} succesfully deleted.` 

    res.json(reply)

})
module.exports = {getAllProducts, createProduct, updateProduct, deleteProduct}