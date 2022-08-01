const mongoose  = require('mongoose')

const BlogsSchema = new mongoose.Schema({
    title:{
        type:String,
        required:[true, 'Please provide title'],
        maxlength:30
    },
    body:{
        type:String,
        required:true
    },
    createdBy:{
        type:mongoose.Types.ObjectId,
        ref:'user',
        required:[true, 'Please provide user'],
        createdAt:Date
    },
    sharedWith:{
        type:[mongoose.Types.ObjectId],
        ref:'user',
        // sharedAt:Date
    }
},{timestamps:true})

module.exports = mongoose.model('blog', BlogsSchema)