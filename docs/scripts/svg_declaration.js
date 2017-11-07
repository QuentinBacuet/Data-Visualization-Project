let svg = d3.select("body")
    .append("svg")
    .style("position", "relative")
    .style("top", margins.top)
    .attr("width", width + margins.left + margins.right)
    .attr("height", height + margins.top + margins.bottom);

let g = svg.append("g")
    .attr("transform", "translate(" + margins.left + "," + margins.top + ")");