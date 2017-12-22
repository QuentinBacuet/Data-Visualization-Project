
let initial_year = 2001;
/** Constant values for the cursor*/
const cursor = {
  height: 4*height/100,
  width: width/300,
  init: timevals.year_scale(initial_year)

};

/** transform a given value into an exact value on the year_sclae*/
cursor.round_cursor = function(x_val) {
  let x_year = timevals.rel_to_year(x_val);
  let new_x = timevals.year_scale(x_year);
  return new_x;
};

/** Return the position of the cursor relative to the timeline [0, width]*/
cursor.get_relative_cursor_x = function() {
    return +(+(cursor.get_cursor_x()) + margins.inner);
};

/** Return the raw cursor x position*/
cursor.get_cursor_x = function() {
  let cur = document.getElementById("cursor");
  return cur.getAttribute("x");
};

/** init cursor: a thin rect on the timeline*/
cursor.timeline_cursor = svg.append("rect")
    .attr("width", cursor.width)
    .attr("height", cursor.height)
    .attr("x", cursor.init)
    .attr("y", timevals.height + timevals.y - cursor.height)
    .attr("class", "unfocusable no_pointer_event")
    .attr("position", "absolute")
    .attr("id", "cursor");
