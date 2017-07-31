function prune(obj, query) {
  let query_array = query.split(" ");
  let result = JSON.parse(JSON.stringify(obj));
  let obj_stack = [result];
  while (obj_stack.length) {
    let current_obj = obj_stack.pop();
    // console.log(current_obj);
    if (Array.isArray(current_obj)) {
      // console.log("array");
      let any = current_obj.some(e => has_relevant_children(e, query));
      current_obj.forEach((e, i) => {
        if (any && !has_relevant_children(e, query)) {
          current_obj.splice(i, 1);
        }
        else
          obj_stack.push(e);
      });
    }
    else if (current_obj === Object(current_obj)) {
      //console.log("object");
      let any = has_relevant_children(current_obj, query);
      //console.log(`any:${any}`)
      for (var key in current_obj) {
        if (any && !has_relevant_children(current_obj[key], query, key)) {
          delete current_obj[key];
        }
        else {
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

function has_relevant_children(obj, query_string, obj_name = "") {
  let query_array = query_string.split(/\W+/).filter(s=>s!=""),
  root = (obj_name? obj_name+":": "") + JSON.stringify(obj);
  root = root.replace(/([A-Z])/g," $1"); // deals with camel-case
  // console.log(root);
  // console.log(query_array)
  return includes_which(root, query_array).length > 0;
}
function includes_which(string, criteria) {
  return criteria.filter(c =>  string.match(RegExp(`.*\\b${c}\\b.*`,"i"))!=null);
}
function sub_intersect(strings1, strings2) {
  return strings1.filter(s1 => includes_which(s1, s2));
}
// TODO: deal with dupes
function intersect(array1, array2) {
  return array1.filter(e1 => array2.some(e2 => e2 == e1));
}

module.exports = prune;