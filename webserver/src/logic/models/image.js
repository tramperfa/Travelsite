import mongoose from 'mongoose';
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;
import uniqueValidator from 'mongoose-unique-validator';

var ImageSchema = new Schema({

  cdnUri: {
    type: String
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  },
  poi: {
    type: Schema.ObjectId,
    ref: 'POI'
  },
  uploadAt: {
    type: Date,
    default: Date.now
  },
  takenAt: {
    type: Date,
    default: undefined
  }

});

var Image = mongoose.model('Image', ImageSchema)
module.exports = Image
