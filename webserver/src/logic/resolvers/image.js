import Image from '../models/image';
import {draftCheckLoginAndOwnerShip} from '../../lib/resolverHelpers';
import mongoose from 'mongoose';

module.exports = {

  Query: {
    image: async(parent, _id, context) => {
      return Image.load(_id)
    }
  },

  Mutation: {
    addStoryImage: async(parent, args, context) => {
      var draft = await draftCheckLoginAndOwnerShip(args.input.storyID, context)
      var newImage = new Image({user: context.sessionUser.user._id, story: args.input.storyID, catergory: args.input.catergory});
      await newImage.newImage()
      var images = draft.images
      images.push(newImage._id)
      await draft.save()
      return newImage
    }
  }

}
