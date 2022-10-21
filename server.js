require('dotenv').config()
const express = require('express')
const app = express()
const path = require('path')
const {logger} = require('./middlewear/logger')
const errorHandler = require('./middlewear/errorHandler')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const corsOptions = require('./config/corsOptions')
const connectDB = require('./config/dbConn')
const mongoose = require('mongoose')
const {logEvents} = require('./middlewear/logger')
const multer = require('multer')


const storage = multer.memoryStorage()
const upload = multer({ storage: storage})

const PORT = process.env.PORT || 3600



connectDB()

// const storage = multer.memoryStorage()
// const upload = multer({storage:storage})



app.use(logger)

app.use(cors(corsOptions))
app.use(express.json({limit:'50mb'}))
// app.use(express.json())



app.use(cookieParser())


app.use('/', express.static(path.join(__dirname, 'public')))

app.use('/', require('./routes/root'))
app.use('/auth', require('./routes/authRoutes'))
app.use('/users', require('./routes/userRoutes'))
app.use('/products',upload.single('image'), require('./routes/productRoutes'))


app.all('*', (req,res) => {
    res.status(404)
    if(req.acceptsEncodings('html')) {
        res.sendFile(path.join, 'views', '404.html')
    } else if (req.accepts('json')) {
        res.json({message: "404 Not Found"})
    } else {
        res.type('txt'.send('404 Not Found'))
    }
})

app.use(errorHandler)
mongoose.connection.once('open', () => {
    console.log('connected to mongo db')
    app.listen(PORT, () => { console.log(`Server running on server ${PORT}`)})

})

mongoose.connection.on('error', err => {
    console.log(err)
    logEvents(`${err.no}: ${err.code}\t${err.syscall}\t${err.hostname}`, 'mongoErrLog.log')
})
