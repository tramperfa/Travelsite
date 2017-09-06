const
  base = process.cwd(),
  path = require('path'),
  {
    fileLoader,
    mergeTypes,
  } = require('merge-graphql-schemas'),
  types = fileLoader(path.join(base, '/src/logic/types'));

module.exports = mergeTypes(types);
