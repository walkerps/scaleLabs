const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const config = require('../config/database');

const ImageSchema = mongoose.Schema({
    userId:{
        type:String,
        required:true
    },
    imageUrl: {
        type:String,
        required:true
    },
    imageDesc:{
        type:String,
        required:true
    },
    imageTitle:{
        type:String,
        required:true
    },
    community:{
        type:String,
        required:true
    }
});

const Image = module.exports = mongoose.model('Image',ImageSchema);

module.exports.getImagesByUser = function(id,callback){
    const query = {userId:id};
    Image.find(query,callback);
}

module.exports.getCommunityImage = function(community,callback){
    const query = {community:community};
    Image.find(query,callback);
}

module.exports.uploadImage = function(newImage,callback){
    newImage.save(callback);
}
