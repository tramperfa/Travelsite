import mongoose from 'mongoose';
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;
import uniqueValidator from 'mongoose-unique-validator';

var ImageSchema = new Schema({
  //_id
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  },
  // 0-Story; 1-Cover; 2-Headline; 3-Avatar;
  catergory: {
    type: Number,
    default: 0
  },
  story: {
    type: Schema.ObjectId,
    ref: 'Story',
    index: true
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
  extraData: {
    type: JSON
  },
  originalImage: {
    url: {
      type: String
    },
    width: {
      type: Number
    },
    height: {
      type: Number
    }
  },
  browserStoryImage: {
    type: String
  },
  browserListOrCommentImage: {
    type: String
  },
  browserCoverHomeImage: {
    type: String
  },
  browserHealdineImage: {
    type: String
  }
});

ImageSchema.methods = {
  newImage: function() {
    return new Promise((resolve, reject) => {
      this.save((err, res) => {
        err
          ? reject(err)
          : resolve(res)
      });
    });
  }
}

var Image = mongoose.model('Image', ImageSchema)
module.exports = Image
