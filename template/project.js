const margin = {top: 50, right: 50, bottom: 50, left: 50};
const width = 800 - margin.left - margin.right;
const height = 500 - margin.top - margin.bottom;

/* Constant values for the timeline*/
const timevals = {color: "teal", height: 50,
                  min_year:1950, max_year:2015};
const cursor = {height : 40, width: 2}

let year_scale = d3.scaleLinear()
                   .domain([timevals.min_year, timevals.max_year])
                   .range([0, width]);
let year_axis = d3.axisTop()
                  .scale(year_scale);
/* Constant values for the cursor*/

cursor.init = year_scale(2000);
/*False unless mouse is pressed on timeline. Stays true until release*/
let mouse_down = false;

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


let clamp = function(val, min, max){
  if(val < min){
    return min;
  }else if (val > max) {
    return max;
  }else{
    return val;
  }
}
svg.append("g")
  .attr("class", "axis")
  .attr("transform", "translate(" + margin.left + ","+ +(margin.top + timevals.height) +")")
  .attr("class", "unfocusable")
  .call(year_axis);

const mouse_adjustement = 8;

let relative_x = function(x){
    return x - margin.left;
}

let update_cursor = function(evt){
  if(mouse_down){
    let x = relative_x(evt.clientX) - mouse_adjustement;
    let new_x = clamp(round_cursor(x), margin.left, margin.left + width);
    timeline_cursor.attr("x", new_x);
  }
}

/* Maps a pixel x-coordinate[0, width] to a year value on the timeline*/
let rel_to_year = function(x_val){
  x_year = Math.round(timevals.min_year + (timevals.max_year - timevals.min_year)*x_val/width);
  return x_year;
}


let round_cursor = function(x_val){
  x_year = rel_to_year(x_val);
  new_x = year_scale(x_year);
  return new_x + margin.left;
}


let down_mouse = function(evt){
  timeline_cursor.attr("x", clamp(round_cursor(relative_x(evt.clientX) - mouse_adjustement),
  margin.left, margin.left + width));
  mouse_down = true;
}
let up_mouse = function(){
  mouse_down = false;
}

/*Return the position of the cursor relative to the timeline [0, width]*/
let get_relative_cursor_x = function(){
  return get_cursor_x() - margin.left;
}
let get_cursor_x = function(){
  let cur = document.getElementById("cursor");
  return cur.getAttribute("x");
}

let t = document.getElementById("timeline");
t.addEventListener("mousedown", down_mouse, false);
document.addEventListener("mouseup", up_mouse, false);
document.addEventListener("mousemove", update_cursor, false);
