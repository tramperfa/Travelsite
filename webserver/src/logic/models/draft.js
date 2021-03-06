import mongoose from 'mongoose';
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;
import uniqueValidator from 'mongoose-unique-validator';
import errorType from '../../lib/errorType';
import Image from './image';
//

var DraftSchema = new Schema({
	//_id
	title: {
		type: String,
		trim: true
	},
	// 1: not applied publish; 2: applied publish
	status: {
		type: Number,
		default: 1
	},
	story: {
		type: ObjectId,
		ref: 'Story'
	},
	content: {
		type: JSON
	},
	authorID: {
		type: ObjectId,
		index: true,
		ref: 'User'
	},
	poi: {
		type: ObjectId,
		index: true,
		ref: 'POI'
	},
	coverImageID: {
		type: ObjectId,
		ref: 'Image'
	},
	headlineImageID: {
		type: ObjectId,
		ref: 'Image'
	},
	images: [
		{
			type: Schema.ObjectId,
			ref: 'Image'
		}
	],
	lastUpdate: {
		type: Date,
		default: Date.now
	}
}, {usePushEach: true});

//Add detailed error log info
DraftSchema.plugin(uniqueValidator);

/**
 * Pre-remove hook
 */

// NO async here please. API only supports callback
DraftSchema.pre('remove', function (next) {
	//console.log("Draft Pre-remove function called !");
	if (this.images) {
		this.images.forEach(imageID => {
			var image = Image.findById(imageID)
			image.remove()
		})
	}

	// const imager = new Imager(imagerConfig, 'S3'); const files =
	// this.image.files; if there are files associated with the item, remove from
	// the cloud too imager.remove(files, function (err) {   if (err) return
	// next(err); }, 'Draft');

	next();
});

/**
 * Methods
 */

DraftSchema.methods = {
	/**
   * Save Draft and upload image
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
}, 'Draft');
*/

	newDraft: function () {
		return new Promise((resolve, reject) => {
			this.save((err, res) => {
				if (err) {
					//TODO Log error
					reject(errorType(2))
				} else if (!res) {
					reject(errorType(4))
				} else {
					resolve(res)
				}
			});
		});
	}
};

// methods are defined on the document (instance). statics are the methods
// defined on the Model.

/**
 * Statics
 */

DraftSchema.statics = {

	/**
   * Find Draft by id
   *
   * @param {ObjectId} id
   * @api private
   */

	load: function (_id) {
		return new Promise((resolve, reject) => {
			this.findOne({_id: _id}).exec((err, res) => {
				if (err) {
					//TODO Log error
					reject(errorType(2))
				} else if (!res) {
					reject(errorType(4))
				} else {
					resolve(res)
				}
			})
		});
	},

	loadImage: function (_id) {
		return new Promise((resolve, reject) => {
			this.findOne({_id: _id}).populate('images').exec((err, res) => {
				if (err) {
					//TODO Log error
					reject(errorType(2))
				} else if (!res) {
					reject(errorType(4))
				} else {
					resolve(res)
				}
			})
		});
	},

	/**
   * List Drafts
   *
   * @param {Object} options
   * @api private
   */

	list: function (options) {
		//console.log("reaching HERE with options : " + JSON.stringify(options));
		const criteria = options.criteria || {};
		const page = options.page || 0;
		const limit = options.limit || 30;
		return new Promise((resolve, reject) => {
			this.find(criteria).sort({lastUpdate: -1}).limit(limit).skip(limit * page).exec(
				(err, res) => {
					if (err) {
						//TODO Log error
						reject(errorType(2))
					} else if (!res) {
						reject(errorType(4))
					} else {
						resolve(res)
					}
				}
			)
		});
	}
}

var Draft = mongoose.model('Draft', DraftSchema)
module.exports = Draft
