const mongoose = require('mongoose')
const AutoIncrement = require('mongoose-sequence')(mongoose)

const productSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'

    },
    title: {
        type: String,
        required: true,

    },
    text: {
        type: String,
        required: true,

    },
    price: {
        type: String,
        required: true,

    },
    types: [{
        color: String,
        size: String,
       

    }],
    image:  {
        // data: Buffer,
        // contentType: String 
        type: String
       
    }
    ,
    completed: {
        type: Boolean,
        default:false
    }
    
},
{
    timestamps:true
}
)

productSchema.plugin(AutoIncrement, {
    inc_field: 'ticket',
    id: 'ticketNums',
    start_seq: 500

})

module.exports = mongoose.model('Product', productSchema)