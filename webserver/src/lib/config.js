module.exports = {
  PORT: 8080,
  uploadLimit: 8 * 1024 * 1024, // 8MB

  sessions: {
    cookie: {
      // session expiration is set to 30 days
      // NO SESSION AUTO RENEWAL
      //WHAT IF USER FORGET TO LOGOUT ON PUBLIC COMPUTER?
      maxAge: 30 * 24 * (60 * 60 * 1000),

      // httpOnly flag makes sure the cookie is only accessed
      // through the HTTP protocol and not JS/browser
      httpOnly: true,

      // secure cookie should be turned to true to provide additional
      // layer of security so that the cookie is set only when working
      // in HTTPS mode.
      secure: false
    },

    // Cookie key name
    name: "sessionId",

    // Mongo store collection name
    collection: "sessions",
    uri: "mongodb://mongodb:27017/my_sessions",
    secret: 'ufoufoufo'
  },

  db: {
    uri: 'mongodb://mongodb:27017/my_database',
    options: {
      useMongoClient: true,
      config: {
        autoIndex: false
      }
    }
  },

  s3: {
    accessKeyId: 'AKIAI3WJWVHVQM4B7LMA',
    secretAccessKey: 'J+O/IQfIHRebc0ENmQQbdOfia+deJG9CsAym/xir'
    //subregion: 'us-east-1'
  }

  //
  // s3Detail: {
  //   Bucket: 'your-bucket-name',
  //   Key: 'your-key-name',
  //   Body: req.file.buffer,
  //   ACL: 'public-read', // your permisions
  // }
};
