import Image from '../models/image';
import {draftCheckLoginAndOwnerShip} from '../../lib/resolverHelpers';

module.exports = {

  Query: {
    image: async(parent, _id, context) => {
      return Image.load(_id)
    }
  },

  Mutation: {}

}
