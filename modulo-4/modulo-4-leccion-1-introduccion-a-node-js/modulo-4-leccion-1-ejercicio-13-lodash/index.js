const _ = require('lodash');

const array1 = [1, 2, 3];
const array2 = [2, 3, 4];

const intersection = _.union(array1, array2);

console.log(intersection);
