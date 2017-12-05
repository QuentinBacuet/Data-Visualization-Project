let dv_svg = d3.select("#divsvgmap")
    .style("height", 98 + "%")
    .style("width", 75 + "%")
    .style("left", margins.left)
    .style("top", margins.top)
    .style("float", "left")
    .style("position", "absolute")
    .attr("class", "unfocusable")
    .attr("display", "inline-block");

let svg = dv_svg
    .append("svg")
    .attr("width", "100%")
    .attr("height", "100%")
    .attr("viewBox", "0 0 600 400")
    .attr("position", "absolute")
    .attr("left", 0)
    .attr("top", 0)
    .attr("preserveAspectRatio", "none");

let dv_year = d3.select("#divsvgyear")
    .style("height", 10 + "%")
    .style("width", 22 + "%")
    .style("left", "77%")
    .style("top", margins.top)
    .style("float", "left")
    .style("position", "absolute")
    .attr("class", "unfocusable")
    .attr("display", "inline-block");

let svg_year = dv_year.append("svg")
    .attr("width", "100%")
    .attr("height", "100%")
    .attr("viewBox", "0 0 600 400")
    .attr("position", "absolute")
    .attr("left", 0)
    .attr("top", 0)
    .attr("preserveAspectRatio", "none");

let dv_events = d3.select("#divevents")
    .style("height", 44 + "%")
    .style("width", 22 + "%")
    .style("left", "77%")
    .style("top", "12%")
    .style("float", "left")
    .style("position", "absolute")
    .attr("class", "unfocusable")
    .attr("display", "inline-block");

let dv_images = d3.select("#divimages")
    .style("height", 42 + "%")
    .style("width", 22 + "%")
    .style("left", "77%")
    .style("top", "57%")
    .style("float", "left")
    .style("position", "absolute")
    .attr("class", "unfocusable")
    .attr("display", "inline-block");


