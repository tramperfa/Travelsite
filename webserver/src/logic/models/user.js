import mongoose from "mongoose"
const Schema = mongoose.Schema
const ObjectId = Schema.ObjectId
import bcrypt from "bcrypt"

import errorType from "../../lib/errorType"

let validateLocalStrategyProperty = function (property) {
	return (this.provider !== "local" && !this.updated) || property.length
}

let validateLocalStrategyPassword = function (password) {
	return this.provider !== "local" || (password && password.length >= 6)
}

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
		match: [/.+@.+\..+/, "Please fill a valid email address"]
	},
	password: {
		type: String,
		default: "",
		validate: [validateLocalStrategyPassword, "Password should be longer"]
	},
	role: {
		type: String,
		"default": "USER"
	},
	provider: {
		type: String,
		default: "local"
	},
	avatarID: {
		type: ObjectId,
		ref: "Image"
	},
	hasTopStory: {
		type: Boolean,
		default: false
	},
	publicProfile: {
		description: {
			type: String
		},
		gender: {
			type: Number,
			default: 0
		},
		location: {
			type: String
		}
	},
	following: [
		{
			type: ObjectId,
			ref: "User"
		}
	],
	follower: [
		{
			type: ObjectId,
			ref: "User"
		}
	],
	archiveStory: [
		{
			type: ObjectId,
			ref: "Story"
		}
	],
	archivePOI: [
		{
			type: ObjectId,
			ref: "POI"
		}
	],
	archiveHotel: [
		{
			type: ObjectId,
			ref: "Hotel"
		}
	],
	archiveImage: [
		{
			type: ObjectId,
			ref: "Image"
		}
	],
	likeStory: [
		{
			type: ObjectId,
			ref: "Story"
		}
	],
	blackList: [
		{
			type: ObjectId,
			ref: "User"
		}
	],
	shippingAddress: {
		type: String
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
}, {usePushEach: true})

/**
 * Pre-save hook, Password hashing
 */

UserSchema.pre("save", function (next) {
	let user = this
	if (!user.isModified("password")) {
		return next()
	}

	bcrypt.genSalt(10, function (err, salt) {
		bcrypt.hash(user.password, salt, function (err, hash) {
			user.password = hash
			next()
			// Store hash in your password DB.
		})
	})
})

/**
 * Methods
 */

UserSchema.methods = {

	/**
   * Password compare
   */
	comparePassword: function (password, cb) {
		bcrypt.compare(password, this.password, function (err, isMatch) {
			cb(err, isMatch)
		})
	}

}

UserSchema.virtual("Image").get(function () {
	// Load picture from profile
	if (this.avatar) {
		return this.avatar
	}

	// Use default picture
	return "Default Image ID"
})

// methods are defined on the document (instance). statics are the methods
// defined on the Model.

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

	load: function (_id) {
		return new Promise((resolve, reject) => {
			this.findOne({_id: _id}).exec((err, res) => {
				if (err) {
					//TODO Log error console.log(err);
					reject(errorType(2))
				} else if (!res) {
					reject(errorType(4))
				} else {
					resolve(res)
				}
			})
		})
	}
}

var User = mongoose.model("User", UserSchema)
module.exports = User
