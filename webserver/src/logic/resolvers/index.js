
const
  base = process.cwd(),
  path = require('path'),
  {
    fileLoader,
    mergeResolvers,
  } = require('merge-graphql-schemas'),
  resolvers = fileLoader(path.join(base, '/src/logic/resolvers'));

module.exports = mergeResolvers(resolvers);
