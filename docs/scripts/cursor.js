/** Constant values for the cursor*/
const cursor = {
  height: 40,
  width: 2,
  init: timevals.year_scale(1955)

};

cursor.round_cursor = function(x_val) {
  let x_year = timevals.rel_to_year(x_val);
  let new_x = timevals.year_scale(x_year);
  return new_x + margins.left;
};

/** Return the position of the cursor relative to the timeline [0, width]*/
cursor.get_relative_cursor_x = function() {
    return cursor.get_cursor_x() - margins.left;
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
    .attr("x", svg_margins.left + cursor.init)
    .attr("y", svg_margins.top + (timevals.height - cursor.height))
    .attr("class", "unfocusable no_pointer_event")
    .attr("id", "cursor");
