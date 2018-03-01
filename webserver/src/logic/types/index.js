// const base = process.cwd(), 	path = require('path'), {fileLoader, mergeTypes}
// = require('merge-graphql-schemas'), 	types = fileLoader(path.join(base,
// '/src/logic/types'));
//
// module.exports = mergeTypes(types);

import path from 'path';
import {fileLoader, mergeTypes} from 'merge-graphql-schemas';

const typesArray = fileLoader(path.join(__dirname, './'));

export default mergeTypes(typesArray);
