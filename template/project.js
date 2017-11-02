const margin = {top: 50, right: 50, bottom: 50, left: 50};
const width = 800 - margin.left - margin.right;
const height = 500 - margin.top - margin.bottom;

const timeline_color = "teal";
const timeline_height = 50;
const cursor_height = 40;
let mouse_down = false;
const min_year = 1950;
const max_year = 2015;

let svg = d3.select("body").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom);

let g = svg.append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

let timeline = svg.append("rect")
            .attr("width", width)
            .attr("height", timeline_height)
            .attr("x", margin.left)
            .attr("y", margin.top)
            .attr("fill", timeline_color)
            .attr("id", "timeline");

let timeline_cursor = svg.append("rect")
                         .attr("width", 2)
                         .attr("height", cursor_height)
                         .attr("x", margin.left + 10)
                         .attr("y", margin.top + (timeline_height - cursor_height))
                         .attr("class", "unfocusable")
                         .attr("id", "cursor")
let year_scale = d3.scaleLinear()
                        .domain([min_year, max_year])
                        .range([0, width]);
let year_axis = d3.axisTop()
                    .scale(year_scale);
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
  .attr("transform", "translate(" + margin.left + ","+ +(margin.top + timeline_height) +")")
  .attr("class", "unfocusable")
  .call(year_axis);

let update_cursor = function(evt){
  if(mouse_down){
    timeline_cursor.attr("x", clamp(round_cursor(evt.clientX - 8), margin.left, margin.left + width));
    console.log(cursor_pos_to_year(get_cursor_x()));
  }
}

let cursor_pos_to_year = function(x_val){
  timeline_x_cursor = x_val - margin.left;
  x_year = Math.round(min_year + (max_year - min_year)*timeline_x_cursor/width);
  return x_year;
}
let round_cursor = function(x_val){
  x_year = cursor_pos_to_year(x_val);
  new_x = year_scale(x_year);
  return new_x + margin.left;
}


let down_mouse = function(){
  mouse_down = true;
}
let up_mouse = function(){
  mouse_down = false;
}

let get_cursor_x = function(){
  let cursor = document.getElementById("cursor");
  return cursor.getAttribute("x");
}

let t = document.getElementById("timeline");
t.addEventListener("mousedown", down_mouse, false);
document.addEventListener("mouseup", up_mouse, false);
document.addEventListener("mousemove", update_cursor, false);
/*while(1){
console.log(cursor_pos_to_year(get_cursor_x()));
}*/
