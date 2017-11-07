/* Constant values for the timeline*/
const timevals = {
    color: "steelblue",
    height: 50,
    min_year: 1950,
    max_year: 2016
};

/** init timeline: a clickable rect*/
let timeline = svg.append("rect")
    .attr("width", width)
    .attr("height", timevals.height)
    .attr("x", svg_margins.left)
    .attr("y", svg_margins.top)
    .attr("fill", timevals.color)
    .attr("id", "timeline");

timevals.year_scale = d3.scaleLinear()
  .domain([timevals.min_year, timevals.max_year])
  .range([0, width]);
timevals.year_axis = d3.axisTop()
  .scale(timevals.year_scale);

/** Maps a pixel x-coordinate[0, width] to a year value on the timeline
 * @param {int} x_val a relative pixel position on the timeline
 * @return {int} The corresponding year value on the timeline
 */
timevals.rel_to_year = function(x_val) {
  x_year = Math.round(timevals.min_year + (timevals.max_year - timevals.min_year) * x_val / width);
  return x_year;
};

timevals.axis_ref = svg.append("g")
    .attr("class", "axis")
    .attr("transform", "translate(" + svg_margins.left + "," + +(svg_margins.top + timevals.height) + ")")
    .attr("class", "unfocusable no_pointer_event")
    .call(timevals.year_axis);
