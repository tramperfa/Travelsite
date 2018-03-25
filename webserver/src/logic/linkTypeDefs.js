const linkTypeDefs = `
  extend type Story {
    author: PublicUser
    headlineImage: Image
    coverImage: Image
    imageArray: [Image]
  }

  extend type Draft {
    author: PublicUser
    headlineImage: Image
    coverImage: Image
    imageArray: [Image]
  }

  extend type Comment {
    author: PublicUser
    quoteImage: Image
  }

  extend type User {
    avatar: Image
  }

  extend type PublicUser {
    avatar: Image
  }

`;

export default linkTypeDefs
