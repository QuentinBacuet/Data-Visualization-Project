/*False unless mouse is pressed on timeline. Stays true until release*/
let mouse_down = false;
const mouse_adjustement = 8;

/** function called when mouse is clicked*/
let down_mouse = function(evt) {
  stop_timer();
  mouse_down = true;
  update_cursor(evt);
}

/** function called when mouse is released*/
let up_mouse = function() {
  mouse_down = false;
}
