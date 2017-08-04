const ID_words = "name|identifier|\\w{0,2}id|(?:\\w+\\s)?code".split("|");
function prune(obj, query, identifier_words = ID_words) {
  let query_array = query.split(" ");
  let result = JSON.parse(JSON.stringify(obj));
  let obj_stack = [result];
  while (obj_stack.length) {
    let current_obj = obj_stack.shift();
    // console.log(current_obj);
    if (Array.isArray(current_obj)) {
      // console.log("array");
      let query_array2 = query_array.concat(ID_words);

      let any_children = current_obj.some(e => has_relevant_children(e, query_array2));
      for(var i = 0; i<current_obj.length; i = i+1){
        // console.log("here");
        if (any_children && !has_relevant_children(current_obj[i], query_array2)) {
          current_obj.splice(i, 1);
          i = i-1;
        }
        else {
          obj_stack.push(current_obj[i]);
        }
      }
    }
    else if (current_obj === Object(current_obj)) {
      // console.log("object");
      let keys = Object.keys(current_obj);
      let any_key = keys.some(key => includes_which(key, query_array).length);
      let any_children = has_relevant_children(current_obj, query_array);
      for (var key in current_obj) {
        if (any_key && !includes_which(key, query_array).length) {
          // console.log(`immediate key ${key} is not in ${query_array}`);
          delete current_obj[key];
        }
        else if (any_children && !has_relevant_children(current_obj[key], query_array, key)) {
          // console.log(`no descendants of ${key} ${current_obj[key]} has ${query}`)
          delete current_obj[key];
        }
        else {
          // console.log(`key ${key} is safe`);
          obj_stack.push(current_obj[key]);
        }
      }
    }
    else {
      // console.log("primitive");
      continue;
    }
  }
  return result;
}

function has_relevant_children(obj, query_array, obj_name = "") {
  var root = (obj_name ? obj_name + ":" : "") + JSON.stringify(obj);
  root = root.replace(/([A-Z])/g, " $1"); // deals with camel-case
  // console.log(root);
  // console.log(query_array)
  return includes_which(root, query_array).length > 0;
}
function includes_which(string, criteria) {
  return criteria.filter(c => 
    string.match(RegExp(`.*\\b${c}\\b.*`, "i")) != null);
}
function sub_intersect(strings1, strings2) {
  return strings1.filter(s1 => includes_which(s1, s2));
}
// TODO: deal with dupes
function intersect(array1, array2) {
  return array1.filter(e1 => array2.some(e2 => e2 == e1));
}

module.exports = prune;