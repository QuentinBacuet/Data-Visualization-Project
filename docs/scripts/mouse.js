const mouse = {
  mouse_adjustement: 8,
  /*False unless mouse is pressed on timeline. Stays true until release*/
  mouse_down: false
};

/** function called when mouse is clicked*/
mouse.down_mouse = function(evt) {
  play.stop_timer();
  mouse.mouse_down = true;
  update_cursor(evt);
}

/** function called when mouse is released*/
mouse.up_mouse = function() {
  mouse.mouse_down = false;
}
