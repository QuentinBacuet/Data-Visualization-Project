/** Constant values for the cursor*/
const cursor = {
  height: 40,
  width: 2,
  init: year_scale(2000)
}

let round_cursor = function(x_val) {
  x_year = rel_to_year(x_val);
  new_x = year_scale(x_year);
  return new_x + margin.left;
}

/** Return the position of the cursor relative to the timeline [0, width]*/
let get_relative_cursor_x = function() {
  return get_cursor_x() - margin.left;
}

/** Return the raw cursor x position*/
let get_cursor_x = function() {
  let cur = document.getElementById("cursor");
  return cur.getAttribute("x");
}
