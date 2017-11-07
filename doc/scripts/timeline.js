/* Constant values for the timeline*/
const timevals = {
  color: "teal",
  height: 50,
  min_year: 1950,
  max_year: 2015
};

let year_scale = d3.scaleLinear()
  .domain([timevals.min_year, timevals.max_year])
  .range([0, width]);
let year_axis = d3.axisTop()
  .scale(year_scale);

/** Maps a pixel x-coordinate[0, width] to a year value on the timeline
 * @param {int} x_val a relative pixel position on the timeline
 * @return {int} The corresponding year value on the timeline
 */
let rel_to_year = function(x_val) {
  x_year = Math.round(timevals.min_year + (timevals.max_year - timevals.min_year) * x_val / width);
  return x_year;
}
