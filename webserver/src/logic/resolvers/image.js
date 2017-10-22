import Image from '../models/story'

module.exports = {

  Query: {
    image: async(parent, _id, context) => {
      return Image.load(_id)
    }
  },

  Mutation: {
    createImage: async(parent, args, context) => {
      var newImage = new Image({story: args.input.storyID, user: context.sessionUser.user._id});
      return newImage.newDraft()
    }
  }

}
