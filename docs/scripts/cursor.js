/** Constant values for the cursor*/
let cursor = {
  height: 40,
  width: 2,
  init: year_scale(1955)

}

cursor.round_cursor = function(x_val) {
  x_year = rel_to_year(x_val);
  new_x = year_scale(x_year);
  return new_x + margin.left;
}

/** Return the position of the cursor relative to the timeline [0, width]*/
cursor.get_relative_cursor_x = function() {
    return cursor.get_cursor_x() - margin.left;
}

/** Return the raw cursor x position*/
cursor.get_cursor_x = function() {
  let cur = document.getElementById("cursor");
  return cur.getAttribute("x");
}
