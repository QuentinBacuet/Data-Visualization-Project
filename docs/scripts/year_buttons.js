const button = {
  height: play.height,
  width: play.width,
  left: 325,
  right: 625,
  y: play.y
};

/** function called when right button is pressed*/
button.btnr_pressed = function() {
  play.stop_timer();
  box.move_year(1 + timevals.rel_to_year(cursor.get_relative_cursor_x()));
};

/** function called when left button is pressed*/
button.btnl_pressed = function() {
  play.stop_timer();
  box.move_year(-1 + timevals.rel_to_year(cursor.get_relative_cursor_x()));
};

/** init left button: a button to decrease the year value by 1*/
button.button_left = svg_year.append("polyline")
    .attr("points", +(button.left + button.width) + " " +
        button.y + " " + button.left + " " + +(button.y +
            button.height / 2) + " " + +(button.left + button.width) +
        " " + +(button.y + button.height))
    .attr("id", "btnL")
    .attr("stroke-width", "10")
    .attr("stroke", "black")
    .attr("stroke-linecap", "round")
    .attr("stroke-linejoin", "round")
    .attr("fill", "#f2f2f2");

/** init right button: a button to increase the year value by 1*/
button.button_right = svg_year.append("polyline")
    .attr("points", button.right + " " +
        button.y + " " + +(button.right + button.width) +
        " " + +(button.y + button.height / 2) + " " + button.right +
        " " + +(button.y + button.height))
    .attr("id", "btnR")
    .attr("stroke-width", "10")
    .attr("stroke", "black")
    .attr("stroke-linecap", "round")
    .attr("stroke-linejoin", "round")
    .attr("fill", "#f2f2f2");
