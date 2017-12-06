
const ratios = {map_width: 65, year_height : 10, list_height: 40};
const img_height = 100 - ratios.year_height - ratios.list_height - 2*margins.inner;

let root = d3.select("#root")
    .style("height", 100 - 2*margins.root + "%")
    .style("width", 100 - 2*margins.root + "%")
    .style("left", margins.root + "%")
    .style("top", margins.root + "%")
    .style("float", "left")
    .style("position", "absolute")
    .attr("class", "unfocusable")
    .attr("display", "inline-block");

//<div id="divsvgmap"></div>
let dv_svg = root.append("div")
    .attr("id","divsvgmap")
    .style("height", 98 + "%")
    .style("width", ratios.map_width + "%")
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

//<div id="divsvgyear"></div>
let left = root.append("div")
    .attr("id", "left_div")
    .style("height", 100 + "%")
    .style("width", 100 - ratios.map_width - margins.inner + "%")
    .style("left", ratios.map_width + margins.inner + "%")
    //.style("top", margins.top)
    .style("float", "left")
    .style("position", "absolute")
    .attr("class", "unfocusable")
    .attr("display", "inline-block");

let dv_year = left.append("div")
    .attr("id", "div_year")
    .style("height", ratios.year_height + "%")
    //.style("width", 100 + "%")
    //.style("left", ratios.map_width + margins.inner + "%")
    //.style("top", margins.top)
    .style("float", "left")
    .style("position", "absolute")
    .attr("class", "unfocusable")
    .attr("display", "inline-block");

let svg_year = dv_year.append("svg")
    .attr("id", "svg_year")
    //.attr("width", "100%")
    .attr("height", "100%")
    .attr("viewBox", "0 0 600 400")
    .attr("position", "absolute")
    .attr("left", 0)
    .attr("top", 0)
    .attr("preserveAspectRatio", "none");

let dv_events = left.append("div")
    .attr("id", "div_events")
    .style("height", ratios.list_height + "%")
    .style("width", 100 + "%")
    //.style("left",  + "%")
    .style("top", ratios.year_height + margins.inner + "%")
    .style("float", "left")
    .style("position", "absolute")
    .attr("class", "unfocusable")
    .attr("display", "inline-block");

let dv_images = left.append("div")
    .attr("id", "dv_images")
    .style("height", img_height + "%")
    .style("width", 100 + "%")
    //.style("left", 0+ "%")
    .style("top", ratios.year_height + ratios.list_height + 2*margins.inner +"%")
    .style("float", "left")
    .style("position", "absolute")
    .attr("class", "unfocusable")
    .attr("display", "inline-block");


