const button = {height: 18, width:14, left: 52, right: 122,
   y: margin.top + timevals.height + 8};

/** function called when right button is pressed*/
let btnr_pressed = function(){
  console.log("right");
       stop_timer();
       move_year(1 + rel_to_year(get_relative_cursor_x()));
   }

/** function called when left button is pressed*/
let btnl_pressed = function(){
  console.log("left");
      stop_timer();
       move_year(-1 + rel_to_year(get_relative_cursor_x()));
   }
