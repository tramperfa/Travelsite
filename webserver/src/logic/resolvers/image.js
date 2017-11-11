import Image from '../models/image'

module.exports = {

  Query: {
    image: async(parent, _id, context) => {
      return Image.load(_id)
    }
  },

  Mutation: {
    createImage: async(parent, args, context) => {
      var newImage = new Image({user: context.sessionUser.user._id, story: args.input.storyID, catergory: args.input.catergory});
      return newImage.newImage()
    }
  }

}
