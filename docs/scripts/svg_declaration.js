
const ratios = {map_width: 65, year_height : 10, list_height: 40};

let root = d3.select("#root")
    .style("height", 100 - 2*margins.root + "%")
    .style("width", 100 - 2*margins.root + "%")
    .style("left", margins.root + "%")
    .style("top", margins.root + "%")
    .style("float", "left")
    .style("position", "absolute")
    .attr("class", "unfocusable")
    .attr("display", "inline-block");

let left = root.append("info_graph")
    .attr("id","left")
    .style("float", "left")
    .style("width", cst.left_div_width + "%")
    .style("position", "absolute")
    .attr("class", "unfocusable")
    .attr("display", "inline-block");

let right = root.append("info_graph")
    .attr("id", "right")
    .style("height", 100 + "%")
    .style("width", sub_cst.right_div_width + "%")
    .style("left", sub_cst.right_div_x + "%")
    .style("float", "left")
    .style("position", "absolute")
    .attr("class", "unfocusable")
    .attr("display", "inline-block");

//Left children
let svg = left
    .append("svg")
    .attr("width", "100%")
    .attr("height", "100%")
    .attr("viewBox", "0 0 600 400")
    .attr("position", "absolute")
    .attr("left", 0)
    .attr("top", 0)
    .attr("preserveAspectRatio", "none");

//Right Children
let dv_year = right.append("info_graph")
    .attr("id", "div_year")
    .style("height", cst.year_div_height + "%")
    .style("float", "left")
    .style("width", 100+"%")
    .style("position", "absolute")
    .attr("class", "unfocusable")
    .attr("display", "inline-block");

let svg_year = dv_year.append("svg")
    .attr("id", "svg_year")
    .attr("height", "100%")
    .style("width", 100 +"%")
    .attr("viewBox", "0 0 1000 50")
    .attr("position", "absolute")
    .attr("left", 0)
    .attr("top", 0)
    .attr("preserveAspectRatio", "xMinYMin");

let dv_events = right.append("info_graph")
    .attr("id", "div_events")
    .style("height", cst.events_height + "%")
    .style("width", 100 + "%")
    //.style("left",  + "%")
    .style("top", sub_cst.events_y + "%")
    .style("float", "left")
    .style("position", "absolute")
    .attr("class", "unfocusable")
    .attr("display", "inline-block");

let dv_images = right.append("info_graph")
    .attr("id", "dv_images")
    .style("height", sub_cst.images_height + "%")
    .style("width", 100 + "%")
    .style("top",  + sub_cst.images_y +"%")
    .style("float", "left")
    .style("position", "absolute")
    .attr("class", "unfocusable")
    .attr("display", "inline-block");


