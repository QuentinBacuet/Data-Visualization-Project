const play = {
  x: 20,
  y: margin.top + timevals.height / 3,
  height: 18,
  width: 14,
  side: 15,
  timer_interval: 500
}

/** Defines whether the cursor is currently moving or not*/
let playing = false;

/** Saves the reference of the repeating calls on function moving cursor*/
let timer;

let stop_timer = function() {
  clearInterval(timer);
  playing = false;
  set_play_button();
}
/** Changes the shape of the play button into a triangle*/
let set_play_button = function() {
  play_btn.attr("points", play.x + " " +
    play.y + " " + +(play.x + play.width) +
    " " + +(play.y + play.height / 2) + " " + play.x +
    " " + +(play.y + play.height));
}

/** Changes the shape of the play button to a square*/
let set_stop_button = function() {
  play_btn.attr("points", play.x + " " + play.y +
    " " + +(play.x + play.side) + " " + play.y +
    " " + +(play.x + play.side) + " " + +(play.y + play.side) +
    " " + play.x + " " + +(play.y + play.side));
}

/** Sets/unsets interval of movement for the cursor depending on current state*/
let play_clicked = function() {
  playing = !playing;
  if (playing) {
    timer = setInterval(pass_year, play.timer_interval);
    set_stop_button();
  } else {
    clearInterval(timer);
    set_play_button();
  }
}
