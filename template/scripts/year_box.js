const box_size = 24
const box = {size:box_size, x: margin.left, y: margin.top +
  timevals.height + box_size};

/** updates the year_box value accoridng to the cursor position*/
let update_year_box = function(yb){
  yb.text(rel_to_year(get_relative_cursor_x()));
}
