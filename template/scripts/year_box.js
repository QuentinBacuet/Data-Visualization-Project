const box_size = 24
const left_offset = 20;
const box = {
  size: box_size,
  x: margin.left + left_offset,
  y: margin.top +
    timevals.height + box_size,
  offset: left_offset
};

/** updates the year_box value accoridng to the cursor position*/
let update_year_box = function(yb) {
  yb.text(rel_to_year(get_relative_cursor_x()));
}

/**Changes the cursor position and value in the year_box to year_value
 * @param {int} year_value a year value to set the cursor and year_box to
 */
let move_year = function(year_value) {
  let clamped = clamp(year_value, timevals.min_year, timevals.max_year);
  timeline_cursor.attr("x", margin.left + year_scale(clamped));
  update_year_box(year_box)
}

let pass_year = function() {
  move_year(1 + rel_to_year(get_relative_cursor_x()));
}
