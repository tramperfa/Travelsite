import mongoose from 'mongoose';
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;
import uniqueValidator from 'mongoose-unique-validator';



var StorySchema = new Schema({
  //_id
  title: { type: String, trim : true },
  snapshotContent: { type : String, default : '', trim : true },
  content: { type : JSON },
  author: { type: ObjectId, index: true, ref : 'User' },
  poi: { type: ObjectId, index: true, ref : 'User' },
  image: [{
      cdnUri: { type : String },
      user: { type : Schema.ObjectId, ref : 'User' },
      poi: { type : Schema.ObjectId, ref : 'POI' },
      uploadAt: { type : Date, default : Date.now }
    }],
  lastUpdate: { type : Date, default : Date.now },
  adminDelete: { type : Boolean, default : false },
  hidden: { type : Boolean, default : true },
  viewCount: { type : Number, default : 0 },
  likeCount: { type : Number, default : 0 },
  likersToday: [{
    liker: { type : Schema.ObjectId, ref : 'User' },
  }], // user can only like a story once a day
  commentCount: { type : Number, default : 0 },
  comments: [{
    body: { type : JSON },
    author: { type : Schema.ObjectId, ref : 'User' },
    createdAt: { type : Date, default : Date.now }
  }]
});

//Add detailed error log info
StorySchema.plugin(uniqueValidator);


/**
 * Pre-remove hook. Used for Admin Remove, User remove only flip "hidden" field
 */

StorySchema.pre('remove', function (next) {
  // const imager = new Imager(imagerConfig, 'S3');
  // const files = this.image.files;

  // if there are files associated with the item, remove from the cloud too
  // imager.remove(files, function (err) {
  //   if (err) return next(err);
  // }, 'Story');

  next();
});


/**
 * Methods
 */

StorySchema.methods = {
  /**
   * Save Story and upload image
   *
   * @param {Object} images
   * @api private
   */

// TODO ADD IMAGE UPLOAD
/*
if (images && !images.length) return this.save();
const imager = new Imager(imagerConfig, 'S3');

imager.upload(images, function (err, cdnUri, files) {
  if (err) return cb(err);
  if (files.length) {
    self.image = { cdnUri : cdnUri, files : files };
  }
  self.save(cb);
}, 'Story');
*/

  createDraft: function() {
    return new Promise((resolve, reject) => {
      this.save((err, res) => {
        err ? reject(err): resolve(res)
      });
    });
  },

  updateDraft: function () {
    if (!this.adminDelete) {
      return this.save();
    }
  },

  // Additional Authitacition than updateDraft
  modifyStory: function () {
    if (!this.adminDelete) {
      return this.save();
    }
  },


  publish: function () {
    // validate required fields all exist
    const err = this.validateSync();
    if (err && err.toString()) throw new Error(err.toString());
    if (this.adminDelete) {
      console.log("ERROR: Cannot publish due to admin reason");
      return;
    } else if (!this.hidden) {
      console.log("ERROR: Cannot publish story that has been published");
      return;
    } else {
      // TODO genertate snapshot
      this.hidden = false;
      return this.save();
    }
  },

  /**
   * Add comment
   *
   * @param {User} user
   * @param {Object} comment
   * @api private
   */

  addComment: function (user, comment) {
    this.comments.push({
      body: comment.body,
      user: user._id
    });

    // TODO  refactor notify into internal MSG
    // notify.comment({
    //   Story: this,
    //   currentUser: user,
    //   comment: comment.body
    // });

    return this.save();
  },


  /**
   * Remove comment
   *
   * @param {commentId} String
   * @api private
   */

  removeComment: function (commentId) {
    const index = this.comments
      .map(comment => comment.id)
      .indexOf(commentId);

    if (~index) this.comments.splice(index, 1);
    else throw new Error('Comment not found');
    return this.save();
  }
};



//methods are defined on the document (instance).
//statics are the methods defined on the Model.

/**
 * Statics
 */

StorySchema.statics = {

  /**
   * Find Story by id
   *
   * @param {ObjectId} id
   * @api private
   */

  load: function (_id) {
    return new Promise((resolve, reject) => {
      this.findOne({ _id: _id })
           //.populate('user')
           .populate('comments')
           .exec((err, res) => {
              err ? reject(err) : resolve(res)
           })
    });
  },

  /**
   * List Storys
   *
   * @param {Object} options
   * @api private
   */

  list: function (options) {
    const criteria = options.criteria || {};
    const page = options.page || 0;
    const limit = options.limit || 30;
    return new Promise((resolve, reject) => {
      this.find(criteria)
    //  .populate('user')  // User model hasn't been defined in Mongoose
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(limit * page)
      .exec((err, res)  => {
          err ? reject(err) : resolve(res)
      })
    });
  },
}

var Story = mongoose.model('Story', StorySchema)
module.exports = Story
