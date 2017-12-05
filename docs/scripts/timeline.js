/* Constant values for the timeline*/
const timevals = {
    color: "steelblue",
    height: height/20,
    width: 600,
    min_year: 1985,
    max_year: 2016,
    y: height*75/100,
    x: 0,
    axis_height: 1.6
};

/** init timeline: a clickable rect*/
let timeline = svg.append("rect")
    .attr("width", timevals.width)
    .attr("height", timevals.height)
    .attr("x", timevals.x)
    .attr("y", timevals.y)
    .attr("fill", timevals.color)
    .attr("id", "timeline");

let range = function(start, end ,step){
    res = [];
    for(let i = 0; start + i*step < end; i++){
        res[i] = start + i*step;
    }
    return res;
};

timevals.year_scale = d3.scaleLinear()
  .domain([timevals.min_year, timevals.max_year])
  .range([0, timevals.width - 1]);
timevals.year_axis = d3.axisTop()
  .scale(timevals.year_scale)
    .tickFormat(d3.format("d"))
    .tickValues(range(1986, 2016, 1));

/** Maps a pixel x-coordinate[0, width] to a year value on the timeline
 * @param {int} x_val a relative pixel position on the timeline
 * @return {int} The corresponding year value on the timeline
 */
timevals.rel_to_year = function(x_val) {
  x_year = Math.round(timevals.min_year + (timevals.max_year - timevals.min_year) * (x_val - margins.left) / width);
  return x_year;
};

/*timevals.axis_resize = function(){
    console.log("axis_resize");
    timevals.year_scale.range([0, document.body.clientWidth*timevals.width/100 ]);

    timevals.axis_ref
        .attr("transform", "translate(" + document.body.clientWidth*svg_margins.left/100 +
            "," +document.body.clientHeight*(timevals.y + timevals.height)/100 + ")")
        .call(timevals.year_axis);

};*/

timevals.axis_ref = svg.append("g")
    .style("font", "8px times")
    .attr("class", "axis")
    .attr("transform", "translate(" + 0 + "," + +(timevals.y + timevals.height) + ")")
    .attr("class", "unfocusable no_pointer_event")
    .call(timevals.year_axis);
