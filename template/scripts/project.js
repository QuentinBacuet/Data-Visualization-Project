let svg = d3.select("body").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom);

let g = svg.append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

let timeline = svg.append("rect")
            .attr("width", width)
            .attr("height", timevals.height)
            .attr("x", margin.left)
            .attr("y", margin.top)
            .attr("fill", timevals.color)
            .attr("id", "timeline");

let timeline_cursor = svg.append("rect")
         .attr("width", cursor.width)
         .attr("height", cursor.height)
         .attr("x", margin.left + cursor.init)
         .attr("y", margin.top + (timevals.height - cursor.height))
         .attr("class", "unfocusable")
         .attr("id", "cursor");


svg.append("g")
  .attr("class", "axis")
  .attr("transform", "translate(" + margin.left + ","+ +(margin.top + timevals.height) +")")
  .attr("class", "unfocusable")
  .call(year_axis);

const box = {size:24};
let year_box = svg.append("text")
                       .attr("x", margin.left)
                       .attr("y", margin.top + timevals.height + box.size)
                       .attr("font-size", box.size)
                       .text(rel_to_year(get_relative_cursor_x()))
                       .attr("class", "unfocusable");
let update_year_box = function(){
  year_box.text(rel_to_year(get_relative_cursor_x()));
}
const button = {height: 18, width:14, left: 32, right: 102,
   y: margin.top + timevals.height + 8};
let button_left = svg.append("polygon")
                     .attr("points", +(button.left + button.width) +" " +
                     button.y + " " + button.left + " "+ +(button.y +
                      button.height/2) + " " + +(button.left + button.width) +
                       " "+ +(button.y + button.height))
                     .attr("id", "btnL")
                     .attr("stroke-width", "2")
                     .attr("stroke", "black")
                     .attr("fill", "white");
let button_right = svg.append("polygon")
                      .attr("points", button.right +" " +
                      button.y + " " + +(button.right + button.width)+
                      " "+ +(button.y + button.height/2) + " " + button.right +
                      " "+ +(button.y + button.height))
                     .attr("id", "btnR")
                     .attr("stroke-width", "2")
                     .attr("stroke", "black")
                     .attr("fill", "white");

let move_year = function(year_value){
        let clamped = clamp(year_value, timevals.min_year, timevals.max_year);
        timeline_cursor.attr("x", margin.left + year_scale(clamped));
        update_year_box()
                     }
let btnr_pressed = function(){
    move_year(1 + rel_to_year(get_relative_cursor_x()));
}
let btnl_pressed = function(){
    move_year(-1 + rel_to_year(get_relative_cursor_x()));
}


const mouse_adjustement = 8;

let update_cursor = function(evt){
  if(mouse_down){
    let x = relative_x(evt.clientX) - mouse_adjustement;
    let new_x = clamp(round_cursor(x), margin.left, margin.left + width);
    timeline_cursor.attr("x", new_x);
    update_year_box();
  }
}

let t = document.getElementById("timeline");
let btnr = document.getElementById("btnR");
let btnl = document.getElementById("btnL");
t.addEventListener("mousedown", down_mouse, false);
btnr.addEventListener("click", btnr_pressed, false);
btnl.addEventListener("click", btnl_pressed, false);
document.addEventListener("mouseup", up_mouse, false);
document.addEventListener("mousemove", update_cursor, false);
