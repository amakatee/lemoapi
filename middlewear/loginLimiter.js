const rateLimit = require('express-rate-limit')
const { logEvents } = require('./logger')

const loginLimmiter = rateLimit({
    windowMc: 60 * 1000,
    max: 5,
    message: {
        message: 'Too many login attempts from this IP, try again in a minute'
    },
    handler: (req,res, next, options) => {
        logEvents(`Too many Requests ${options.message.message}\t${req.method}\t${req.url}\t${req.headers.origin}`, `errLog.log`)
        res.status(options.statusCode).send(options.message)
    },
    standartHeaders: true,
    legacyHeaders: false,
})

module.exports = loginLimmiter