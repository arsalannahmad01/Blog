const mongoose  = require('mongoose')

const BlogsSchema = new mongoose.Schema({
    title:{
        type:String,
        required:[true, 'Please provide title'],
        maxlength:30
    },
    body:{
        type:String,
        required:true,
        minlength:20,
    },
    createdBy:{
        type:mongoose.Types.ObjectId,
        ref:'User',
        required:[true, 'Please provide user'],
        createdAt:Date
    }
})

module.exports = mongoose.model('blog', BlogsSchema)