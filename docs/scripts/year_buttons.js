const button = {
  height: 18,
  width: 14,
  left: 52,
  right: 122,
  y: margins.top + timevals.height + 8
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
button.button_left = svg.append("polygon")
    .attr("points", +(button.left + button.width) + " " +
        button.y + " " + button.left + " " + +(button.y +
            button.height / 2) + " " + +(button.left + button.width) +
        " " + +(button.y + button.height))
    .attr("id", "btnL")
    .attr("stroke-width", "2")
    .attr("stroke", "black")
    .attr("fill", "white");

/** init right button: a button to increase the year value by 1*/
button.button_right = svg.append("polygon")
    .attr("points", button.right + " " +
        button.y + " " + +(button.right + button.width) +
        " " + +(button.y + button.height / 2) + " " + button.right +
        " " + +(button.y + button.height))
    .attr("id", "btnR")
    .attr("stroke-width", "2")
    .attr("stroke", "black")
    .attr("fill", "white");
