let prune = require('./query-pruner');
var exampleJSON = {
  val: 0, // fetch by key
  str: "hi", // fetch by key
  obj: { z: 1, y: 10, in1:{in2:{in3:{in4:{in5:{in6:1}}}}}}, // fetch by key
  arrayVals: [1, 10, 20], // enum, fetch by key-->index?
  arrayObj: [{ name:"joe", a: 1, b: 2 }, { guid: 12345, a: 4, b: 6 }, { name:12346, a: 11, z: 13 }], // fetch by value: "where"
  arrayArray: [[1, 2, 3], [2, 3, 4], [4, 5, 6]] // e

}

console.log("pruning; protect array (through camelCase):")
console.log(prune(exampleJSON, "array"));
console.log("pruning; protect str key:");
console.log(prune(exampleJSON, "str"));
console.log("pruning; protect in6 key:");
console.log(prune(exampleJSON, "in6"));
console.log("pruning; protect object with value of 6");
console.log(prune(exampleJSON,"6"));
console.log("pruning; protect object with val of 'z' ");
console.log(prune(exampleJSON,"z"));