/** constants for the play_button*/
const play = {
  x: 125,
  y: box.size/2,
  height: 60,
  width: 40,
  side: 150,
  timer_interval: 2000,
    /** Defines whether the cursor is currently moving or not*/
    playing: false,
    timer: 0
};

/** Saves the reference of the repeating calls on function moving cursor*/
play.stop_timer = function() {
  clearInterval(play.timer);
  play.playing = false;
  play.set_play_button();
};
/** Changes the shape of the play button into a triangle*/
play.set_play_button = function() {
  play.play_btn.attr("points", play.x + " " +
    play.y + " " + +(play.x + play.width) +
    " " + +(play.y + play.height / 2) + " " + play.x +
    " " + +(play.y + play.height));
};

/** Changes the shape of the play button to a square*/
play.set_stop_button = function() {
  play.play_btn.attr("points", play.x + " " + play.y +
    " " + +(play.x + play.width) + " " + play.y +
    " " + +(play.x + play.width) + " " + +(play.y + play.height) +
    " " + play.x + " " + +(play.y + play.height));
};

/** Sets/unsets interval of movement for the cursor depending on current state*/
play.play_clicked = function() {
  play.playing = !play.playing;
  if (play.playing) {
    play.timer = setInterval(box.pass_year, play.timer_interval);
    play.set_stop_button();
  } else {
    clearInterval(play.timer);
    play.set_play_button();
  }
};

let path_xy1 = play.x + " " + play.y;
let path_xy2 = +(play.x + play.width) + " " + +(play.y + play.height / 2);
let path_xy3 = play.x + " " + +(play.y + play.height);
play.play_btn = svg_year.append("polygon")
    .attr("points", play.x + " " +
        play.y + " " + +(play.x + play.width) +
        " " + +(play.y + play.height / 2) + " " + play.x +
        " " + +(play.y + play.height))
    .attr("id", "playBtn");

