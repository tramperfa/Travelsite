import Image from '../models/image';
import {draftCheckLoginAndOwnerShip} from '../../lib/resolverHelpers';
import {willCustomCropUpload} from '../../lib/upload';

module.exports = {

  Query: {
    image: async(parent, args, context) => {
      return Image.load(args.imageID)
    }
  },

  Mutation: {
    cropImage: async(parent, args, context) => {
      let cropAt = {
        x: args.input.x,
        y: args.input.y,
        width: args.input.width,
        height: args.input.height
      }
      return willCustomCropUpload(args.input.imageID, cropAt, context)
    }
  }

}
