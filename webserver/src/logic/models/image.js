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
  takenTime: {
    type: Date,
    default: undefined
  },
  takenLocation: {
    latitude: {
      type: Number
    },
    longitude: {
      type: Number
    }
  },
  extraData: {
    type: JSON
  },
  originalImage: {
    filename: {
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
    filename: {
      type: String
    },
    width: {
      type: Number
    },
    height: {
      type: Number
    }
  },
  browserListOrCommentImage: {
    filename: {
      type: String
    },
    width: {
      type: Number
    },
    height: {
      type: Number
    }
  },
  browserCoverHomeImage: {
    filename: {
      type: String
    },
    width: {
      type: Number
    },
    height: {
      type: Number
    }
  },
  browserHealdineImage: {
    filename: {
      type: String
    },
    width: {
      type: Number
    },
    height: {
      type: Number
    }
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
  },

  load: async function(_id) {
    return new Promise((resolve, reject) => {
      this.findOne({_id: _id}).exec((err, res) => {
        err
          ? reject(new Error("Cannot find requested image"))
          : resolve(res)
      })
    });
  }
}

var Image = mongoose.model('Image', ImageSchema)
module.exports = Image
