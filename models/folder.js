const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const folderSchema = new Schema({
  name: {
    type: String,
    required: true
  },

  path: {
    type: String,
    required: true
  },

  parentFolder: {
    type: Schema.Types.ObjectId,
    ref: 'Folder',
    default: null
  },

  owner: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

}, {
  timestamps: true
});

const Folder = mongoose.model('Folder', folderSchema);

module.exports = Folder;
