let svg = d3.select("body")
    .append("svg")
    .style("position", "relative")
    .style("top", margins.top)
    .attr("width", width + margins.left + margins.right)
    .attr("height", height + margins.top + margins.bottom);

let g = svg.append("g")
    .attr("transform", "translate(" + margins.left + "," + margins.top + ")");

/** init timeline: a clickable rect*/
let timeline = svg.append("rect")
    .attr("width", width)
    .attr("height", timevals.height)
    .attr("x", svg_margins.left)
    .attr("y", svg_margins.top)
    .attr("fill", timevals.color)
    .attr("id", "timeline");

/** init cursor: a thin rect on the timeline*/
let timeline_cursor = svg.append("rect")
    .attr("width", cursor.width)
    .attr("height", cursor.height)
    .attr("x", svg_margins.left + cursor.init)
    .attr("y", svg_margins.top + (timevals.height - cursor.height))
    .attr("class", "unfocusable no_pointer_event")
    .attr("id", "cursor");


svg.append("g")
    .attr("class", "axis")
    .attr("transform", "translate(" + svg_margins.left + "," + +(svg_margins.top + timevals.height) + ")")
    .attr("class", "unfocusable no_pointer_event")
    .call(year_axis);

/** init year box: text that displays the value pointed by the cursor*/
let year_box = svg.append("text")
    .attr("x", box.x)
    .attr("y", box.y)
    .attr("font-size", box.size)
    .text(rel_to_year(get_relative_cursor_x()))
    .attr("class", "unfocusable no_pointer_event");

let country_graph = svg.append("text")
    .attr("x", country_graph_box.x)
    .attr("y", country_graph_box.y)
    .attr("font-size", country_graph_box.size)
    .attr("class", "unfocusable no_pointer_event");
update_graph(country_graph)


/** init left button: a button to decrease the year value by 1*/
let button_left = svg.append("polygon")
    .attr("points", +(button.left + button.width) + " " +
        button.y + " " + button.left + " " + +(button.y +
            button.height / 2) + " " + +(button.left + button.width) +
        " " + +(button.y + button.height))
    .attr("id", "btnL")
    .attr("stroke-width", "2")
    .attr("stroke", "black")
    .attr("fill", "white");

/** init right button: a button to increase the year value by 1*/
let button_right = svg.append("polygon")
    .attr("points", button.right + " " +
        button.y + " " + +(button.right + button.width) +
        " " + +(button.y + button.height / 2) + " " + button.right +
        " " + +(button.y + button.height))
    .attr("id", "btnR")
    .attr("stroke-width", "2")
    .attr("stroke", "black")
    .attr("fill", "white");


let play_btn = svg.append("polygon")
    .attr("points", play.x + " " +
        play.y + " " + +(play.x + play.width) +
        " " + +(play.y + play.height / 2) + " " + play.x +
        " " + +(play.y + play.height))
    .attr("id", "playBtn");
/** Called when any event has changed the year_value to move the cursor
 * and change the year_box accordingly
 */
let update_cursor = function (evt) {
    if (mouse_down) {
        let x = relative_x(evt.clientX) - mouse_adjustement;
        let new_x = clamp(round_cursor(x), margins.left, margins.left + width);
        timeline_cursor.attr("x", new_x);
        update_year_box(year_box);
        update_graph(country_graph)
    }
}

/** add listeners to every dynamic DOM element*/
{
    let t = document.getElementById("timeline");
    let btnr = document.getElementById("btnR");
    let btnl = document.getElementById("btnL");
    let playbtn = document.getElementById("playBtn");
    t.addEventListener("mousedown", down_mouse, false);
    btnr.addEventListener("click", btnr_pressed, false);
    btnl.addEventListener("click", btnl_pressed, false);
    playbtn.addEventListener("click", play_clicked, false);
    document.addEventListener("mouseup", up_mouse, false);
    document.addEventListener("mousemove", update_cursor, false);
}
