import mongoose from 'mongoose';
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;
import uniqueValidator from 'mongoose-unique-validator';

var StorySchema = new Schema({
	//_id
	draft: {
		type: ObjectId,
		ref: 'Draft'
	},
	title: {
		type: String,
		trim: true
	},
	// 1: applying for publish; 2: public story; 3: deleted by user; 4: deleted by
	// admin 5: user applying recovery
	status: {
		type: Number,
		default: 1
	},
	snapshotContent: {
		type: String,
		default: '',
		trim: true
	},
	content: {
		type: JSON
	},
	author: {
		type: ObjectId,
		index: true,
		ref: 'User'
	},
	destination: {
		type: ObjectId,
		index: true,
		ref: 'Destination'
	},
	POI: {
		type: ObjectId,
		index: true,
		ref: 'POI'
	},
	coverImage: {
		type: ObjectId,
		ref: 'Image'
	},
	headlineImage: {
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
	},
	viewCount: {
		type: Number,
		default: 0
	},
	likeStoryCount: {
		type: Number,
		default: 0
	},
	archiveStoryCount: {
		type: Number,
		default: 0
	},
	archiveStory: [
		{
			type: Schema.ObjectId,
			ref: 'User'
		}
	],
	likeStory: [
		{
			type: Schema.ObjectId,
			ref: 'User'
		}
	],
	commentCount: {
		type: Number,
		default: 0
	},
	comments: [
		{
			body: {
				type: JSON
			},
			author: {
				type: Schema.ObjectId,
				ref: 'User'
			},
			createdAt: {
				type: Date,
				default: Date.now
			}
		}
	]
});

//Add detailed error log info
StorySchema.plugin(uniqueValidator);

/**
 * Pre-remove hook
 */

/**
 * Methods
 */

StorySchema.methods = {

	addComment: function (user, comment) {
		this.comments.push({body: comment.body, user: user._id});

		// TODO  refactor notify into internal MSG notify.comment({   Story: this,
		// currentUser: user,   comment: comment.body });

		return this.save();
	},

	/**
   * Remove comment
   *
   * @param {commentId} String
   * @api private
   */

	removeComment: function (commentId) {
		const index = this.comments.map(comment => comment.id).indexOf(commentId);

		if (~ index) 
			this.comments.splice(index, 1);
		else 
			throw new Error('Comment not found');
		return this.save();
	}
};

// methods are defined on the document (instance). statics are the methods
// defined on the Model.

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

	load: async function (criteria) {
		//{_id: _id, status: status}
		return new Promise((resolve, reject) => {
			this.findOne(criteria).populate('author')

			//.populate('comments')
			//
				.populate('coverImage').populate('images')
			//
				.exec((err, res) => {
				err
					? reject(new Error("Cannot find requested story"))
					: resolve(res)
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
		//console.log("reaching HERE with options : " + JSON.stringify(options));
		const criteria = options.criteria || {};
		const page = options.page || 0;
		const limit = options.limit || 30;
		return new Promise((resolve, reject) => {
			this.find(criteria).populate('author'). // User model hasn't been defined in Mongoose
			sort({lastUpdate: -1}).limit(limit).skip(limit * page).exec((err, res) => {
				err
					? reject(err)
					: resolve(res)
			})
		});
	}
}

var Story = mongoose.model('Story', StorySchema)
module.exports = Story
