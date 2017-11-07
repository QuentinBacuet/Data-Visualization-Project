const country_graph_size = 24
const country_graph_left_offset = 20;
const country_graph_box = {
  size: box_size,
  x: margin.left + country_graph_left_offset,
  y: margin.top +
    timevals.height + country_graph_size,
  offset: country_graph_left_offset,
  max_height: 30
};

const data_entry = []
const data_exit = []
const data_diff = []

/** Generate data, give real data after*/
for (i = 0; i < 65; i++) {
  data_entry.push(i + Math.floor((Math.random() * 10) + 1))
  data_exit.push(i + Math.floor((Math.random() * 10) + 1))
  data_diff.push(data_entry[i] - data_exit[i])
}

max_entry = Math.max(...data_entry);
max_exit = Math.max(...data_exit);


let update_graph = function(yb) {
  a = rel_to_year(cursor.get_relative_cursor_x()) - timevals.min_year
  generate_graph(a)
}

let generate_graph = function(a) {

  const data_entry_slice = data_entry.slice(0, a)
  const data_exit_slice = data_exit.slice(0, a)
  const data_diff_slice = data_diff.slice(0, a)

  const offset = margin.top + (timevals.height) + country_graph_box.max_height

  svg.selectAll("#line")
    .remove()

  svg.selectAll("#graph_entry")
    .data(data_entry_slice)
    .exit()
    .remove()

  svg.selectAll("#graph_dot")
    .data(data_diff_slice)
    .exit()
    .remove()

  svg.selectAll("#graph_exit")
    .data(data_exit_slice)
    .exit()
    .remove()

  svg.selectAll("#graph_entry")
    .data(data_entry_slice)
    .enter()
    .append("rect")
    .attr("width", (d, i) => year_scale(i + 1) - year_scale(i))
    .attr("height", (d, i) => d)
    .attr("x", (d, i) => margin.left + (year_scale(i + 1) - year_scale(i)) * i)
    .attr("y", (d, i) => offset + max_entry - d)
    .attr("class", "unfocusable")
    .attr("id", "graph_entry");

  svg.selectAll("#graph_exit")
    .data(data_exit_slice)
    .enter()
    .append("rect")
    .attr("width", (d, i) => year_scale(i + 1) - year_scale(i))
    .attr("height", (d, i) => d)
    .attr("x", (d, i) => margin.left + (year_scale(i + 1) - year_scale(i)) * i)
    .attr("y", (d, i) => offset + max_entry)
    .attr("class", "unfocusable")
    .attr("id", "graph_exit");

  // Define the line
  var valueline = d3.line()
    .x((d, i) => margin.left + (year_scale(i + 1) - year_scale(i)) * (i + 0.5))
    .y((d, i) => offset + max_entry - d);


  // Add the valueline path.
  svg.selectAll("#line")
    .data(data_diff_slice)
    .enter()
    .append("path")
    .attr("id", "line")
    .attr("d", valueline(data_diff_slice));

  // Add the scatterplot
  svg.selectAll("I_DONT_EXIST_YET")
    .data(data_diff_slice)
    .enter()
    .append("circle")
    .attr("r", 3.5)
    .attr("cx", (d, i) => margin.left + (year_scale(i + 1) - year_scale(i)) * (i + 0.5))
    .attr("cy", (d, i) => offset + max_entry - d)
    .attr("id", "graph_dot");

}
