const button = {
  height: 18,
  width: 14,
  left: 52,
  right: 122,
  y: margins.top + timevals.height + 8
};

/** function called when right button is pressed*/
button.btnr_pressed = function() {
  console.log("right");
  play.stop_timer();
  move_year(1 + rel_to_year(cursor.get_relative_cursor_x()));
}

/** function called when left button is pressed*/
button.btnl_pressed = function() {
  console.log("left");
  play.stop_timer();
  move_year(-1 + rel_to_year(cursor.get_relative_cursor_x()));
}
