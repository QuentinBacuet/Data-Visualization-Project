const play = {
  x: 20,
  y: svg_margins.top + timevals.height / 3,
  height: 18,
  width: 14,
  side: 15,
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
    " " + +(play.x + play.side) + " " + play.y +
    " " + +(play.x + play.side) + " " + +(play.y + play.side) +
    " " + play.x + " " + +(play.y + play.side));
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

play.play_btn = svg.append("polygon")
    .attr("points", play.x + " " +
        play.y + " " + +(play.x + play.width) +
        " " + +(play.y + play.height / 2) + " " + play.x +
        " " + +(play.y + play.height))
    .attr("id", "playBtn");
