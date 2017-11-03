const play = {x: 20, y: margin.top + timevals.height/3, height: 18,
   width:14, side: 15, timer_interval: 500}
let playing = false;
let timer;

let set_play_button = function(){
  play_btn.attr("points", play.x +" " +
  play.y + " " + +(play.x + play.width)+
  " "+ +(play.y + play.height/2) + " " + play.x +
  " "+ +(play.y + play.height));
}

let set_stop_button = function(){
  play_btn.attr("points", play.x              +" "+  play.y
                + " "+ +(play.x + play.side) +" "+  play.y
                + " "+ +(play.x + play.side)+" "+ +(play.y + play.side)
                +" "+  play.x                 +" "+ +(play.y + play.side));
}
let play_clicked = function(){
    playing = !playing;
    if(playing){
      timer = setInterval(btnr_pressed, play.timer_interval);
      set_stop_button();
    }else{
      clearInterval(timer);
      set_play_button();
    }
}
