import mongoose from 'mongoose';
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;
import uniqueValidator from 'mongoose-unique-validator';

var ImageSchema = new Schema({
  //_id
  story: {
    type: Schema.ObjectId,
    ref: 'Story',
    index: true
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  },
  poi: {
    type: Schema.ObjectId,
    ref: 'POI',
    index: true
  },
  uploadAt: {
    type: Date,
    default: Date.now
  },
  takenAt: {
    type: Date,
    default: undefined
  },
  isAvatar: {
    type: Boolean,
    default: false
  },
  isCover: {
    type: Boolean,
    default: false
  }

});

var Image = mongoose.model('Image', ImageSchema)
module.exports = Image
