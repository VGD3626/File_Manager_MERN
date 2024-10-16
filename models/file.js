const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { ObjectId } = mongoose.Schema.Types;


const fileSchema = new Schema ({
    name: {
        type: String,
        required: true
    },

    sanitizedName: {
        type: String,
        required: true
    },

    fileType: {
        type: String,
        required: true
    },

    asset_id: {
        type: String,
        required: true
    },
    path: {
        type: String,
        required: true,
        unique: true
    },

    parentFolder: {
        type: ObjectId,
        //required: true
    },

    cloudinaryId: {
        type: String,
        required: true,
        unique: true
    },

    owner: {
        type: ObjectId,
        required: true
    },

    size: {
        type: String
    },

    sharedWith: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: []
    }],},
    {
        timestamps: true
    })

var File = mongoose.model("File", fileSchema);
module.exports = File;
