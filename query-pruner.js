function prune(obj, query) {
  let query_array = query.split(" ");
  let result = JSON.parse(JSON.stringify(obj));
  let obj_stack = [{ property: result, parent: null }];
  while (obj_stack.length) {
    let focus = obj_stack.pop();
    if (Array.isArray(focus)) {
      let any = focus.some(e => has_relevant_children(e, query));
      obj_stack = obj_stack +
        focus.filter(e = !any || has_relevant_children(e, query))
          .map(e => ({ property: e, parent:focus }));
    }
    else if (current_obj === Object(current_obj)) {
      let keys = Object.keys(current_obj);
      
    }
    else {
      return;
    }

  }
  return result;
}

function has_relevant_children(obj,query){
  return includes_which(JSON.stringify(obj),query).length>0;
}
function includes_which(string, criteria) {
  return criteria.filter(c => string.includes(c));
}
function sub_intersect(strings1, strings2) {
  return strings1.filter(s1 => includes_which(s1, s2));
}
// TODO: deal with dupes
function intersect(array1, array2) {
  return array1.filter(e1 => array2.some(e2 => e2 == e1));
}

console.log(intersect([1, 2, 3], [2, 3, 3, 4]));