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

const mouse_adjustement = 8;

let update_cursor = function(evt){
  if(mouse_down){
    let x = relative_x(evt.clientX) - mouse_adjustement;
    let new_x = clamp(round_cursor(x), margin.left, margin.left + width);
    timeline_cursor.attr("x", new_x);
  }
}

let t = document.getElementById("timeline");
t.addEventListener("mousedown", down_mouse, false);
document.addEventListener("mouseup", up_mouse, false);
document.addEventListener("mousemove", update_cursor, false);
