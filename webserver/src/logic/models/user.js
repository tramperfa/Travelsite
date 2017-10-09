import mongoose from 'mongoose';
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;
import uniqueValidator from 'mongoose-unique-validator';
import bcrypt from 'bcrypt';

let validateLocalStrategyProperty = function(property) {
  return (this.provider !== "local" && !this.updated) || property.length;
};

let validateLocalStrategyPassword = function(password) {
  return this.provider !== "local" || (password && password.length >= 6);
};

const UserSchema = new Schema({
  // _id
  fullName: {
    type: String,
    trim: true,
    "default": "",
    validate: [validateLocalStrategyProperty, "Please fill in your full name"]
  },
  email: {
    type: String,
    trim: true,
    unique: true,
    index: true,
    lowercase: true,
    "default": "",
    validate: [
      validateLocalStrategyProperty, "Please fill in your email"
    ],
    match: [/.+\@.+\..+/, "Please fill a valid email address"]
  },
  username: {
    type: String,
    unique: true,
    index: true,
    lowercase: true,
    required: "Please fill in a username",
    trim: true,
    match: [/^[\w][\w\-\._\@]*[\w]$/, "Please fill a valid username"]
  },
  password: {
    type: String,
    default: '',
    validate: [validateLocalStrategyPassword, "Password should be longer"]
  },
  provider: {
    type: String,
    default: 'local'
  },
  profile: {
    description: {
      type: String
    },
    gender: {
      type: Number,
      default: 0
    },
    hasTopStory: {
      type: Boolean,
      default: false
    },
    //picture: { type: ObjectID, ref "Image"},
    location: {
      type: String
    }
  },

  facebook: {
    type: String,
    unique: true,
    sparse: true
  },
  google: {
    type: String,
    unique: true,
    sparse: true
  },
  role: {
    type: String,
    "default": 'user'
  },
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  verified: {
    type: Boolean,
    default: false
  },
  verifyToken: {
    type: String
  },

  status: {
    type: Number,
    default: 1
  }
});

/**
 * Pre-save hook, Password hashing
 */

UserSchema.pre("save", function(next) {
  let user = this;
  if (!user.isModified("password"))
    return next();

  bcrypt.genSalt(10, function(err, salt) {
    bcrypt.hash(user.password, salt, function(err, hash) {
      user.password = hash;
      next();
      // Store hash in your password DB.
    });
  });
});

/**
 * Methods
 */

UserSchema.methods = {

  /**
   * Password compare
   */
  comparePassword: function(password, cb) {
    bcrypt.compare(password, this.password, function(err, isMatch) {
      cb(err, isMatch);
    });
  }

};

UserSchema.virtual("avatar").get(function() {
  // Load picture from profile
  if (this.profile && this.profile.picture)
    return this.profile.picture;

  // Use default picture
  return "Default avatar url";
});

//methods are defined on the document (instance).
//statics are the methods defined on the Model.

/**
 * Statics
 */

UserSchema.statics = {

  /**
   * Find User by id
   *
   * @param {ObjectId} id
   * @api private
   */

  load: function(_id) {
    return new Promise((resolve, reject) => {
      this.findOne({_id: _id})
      //.populate('user')
        .populate('comments').exec((err, res) => {
        err
          ? reject(new Error("Cannot find requested user"))
          : resolve(res)
      })
    });
  }
}

var User = mongoose.model('User', UserSchema)
module.exports = User
