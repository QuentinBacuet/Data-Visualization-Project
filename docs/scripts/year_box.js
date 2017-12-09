const box_size = 180;
const left_offset = 20;
const box = {
    size: box_size,
    x: 120,
    y: box_size,
    offset: left_offset
};

/** updates the year_box value accoridng to the cursor position*/
box.update_year_box = function (yb) {
    yb.text(timevals.rel_to_year(cursor.get_relative_cursor_x()));
};

/**Changes the cursor position and value in the year_box to year_value
 * @param {int} year_value a year value to set the cursor and year_box to
 */
box.move_year = function (year_value) {
    let clamped = helpers.clamp(year_value, timevals.min_year, timevals.max_year);
    console.log("move year", year_value);

    let new_cursor_x = timevals.year_scale(clamped);

    project.update_cursor(new_cursor_x);
    box.update_year_box(box.year_box);
};

box.pass_year = function () {
    box.move_year(1 + timevals.rel_to_year(cursor.get_relative_cursor_x()));
};

/** init year box: text that displays the value pointed by the cursor*/
box.year_box = svg_year.append("text")
    .attr("x", box.x)
    .attr("y", box.y)
    //.attr("font-size", box.size)
    .text(timevals.rel_to_year(cursor.get_relative_cursor_x()))
    .attr("class", "year_label unfocusable no_pointer_event");
