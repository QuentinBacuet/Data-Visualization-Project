"use strict";

const country_graph_size = 24;
const country_graph_left_offset = 20;
const country_graph = {
    size: box_size,
    x: country_graph_left_offset,
    y: timevals.y + timevals.height + height*2/100,
    offset: country_graph_left_offset,
    max_height: height*0.08,
    current_code: "CH",
    first_index_immigration_exit: 0,
    last_index_immigration_exit: 0,
    first_index_immigration_entry: 0,
    last_index_immigration_entry: 0
};


country_graph.graph = svg.append("text")
    .attr("x", country_graph.x)
    .attr("y", country_graph.y)
    .attr("font-size", country_graph.size)
    .attr("class", "unfocusable no_pointer_event");

country_graph.update_new_graph = function (country_code) {
    svg.selectAll("#graph_entry")
        .remove();

    svg.selectAll("#graph_exit")
        .remove();

    svg.selectAll("#graph_dot")
        .remove();

    country_graph.update_graph(country_code);
};

country_graph.update_graph = function (country_code) {
    const last_year_selected = timevals.rel_to_year(cursor.get_relative_cursor_x()) - timevals.min_year + 1;

    country_graph.current_code = (country_code !== undefined) ? country_code : country_graph.current_code;

    let data_immigration_entry_slice = project.data_immigration_entry.filter(x => x.country_asylum === country_graph.current_code);
    let data_immigration_exit_slice = project.data_immigration_exit.filter(x => x.country_origin === country_graph.current_code);

    if (data_immigration_exit_slice.length > 0 && data_immigration_entry_slice.length > 0) {
        const max_entry = Math.max(...data_immigration_exit_slice.map(x => x.value), ...data_immigration_entry_slice.map(x => x.value));

        country_graph.domainOnlyScale_up = d3.scaleLinear().domain([0, max_entry]).range([0, 100]);
        country_graph.domainOnlyScale_down = d3.scaleLinear().domain([max_entry, 0]).range([-100, 0]);

        const data_entry = [];
        const data_exit = [];
        const data_diff = [];

        country_graph.y_axis_up = d3.axisRight(country_graph.domainOnlyScale_up).ticks(5);
        country_graph.y_axis_down = d3.axisRight(country_graph.domainOnlyScale_down).ticks(5);

        for (let i = 0, i_entry = 0, i_exit = 0; i <= timevals.max_year - timevals.min_year; i++) {
            if (data_immigration_entry_slice[i_entry] !== undefined && data_immigration_entry_slice[i_entry].year === (timevals.min_year + i).toString()) {
                data_entry.push(country_graph.domainOnlyScale_up(data_immigration_entry_slice[i_entry].value));
                i_entry++;
            } else {
                data_entry.push(0)
                data_entry.push(0)
            }
            if (data_immigration_exit_slice[i_exit] !== undefined && data_immigration_exit_slice[i_exit].year === (timevals.min_year + i).toString()) {
                data_exit.push(country_graph.domainOnlyScale_up(data_immigration_exit_slice[i_exit].value));
                i_exit++;
            } else {
                data_exit.push(0)
            }

            data_diff.push(data_entry[i] - data_exit[i])
        }

        const data_entry_slice = data_entry.slice(0, last_year_selected);
        const data_exit_slice = data_exit.slice(0, last_year_selected);
        const data_diff_slice = data_diff.slice(0, last_year_selected);

        country_graph.draw_graph(country_graph.domainOnlyScale_up(max_entry), data_entry_slice, data_exit_slice, data_diff_slice)
    } else {
        country_graph.removeAll();
    }
};

country_graph.draw_graph = function (max_entry, data_entry_slice, data_exit_slice, data_diff_slice) {
    const offset = margins.top + (timevals.height) + country_graph.max_height;

    country_graph.remove(data_entry_slice, data_exit_slice, data_diff_slice);

    const widthRect = (timevals.year_scale(1) - timevals.year_scale(0));
    let div = d3.select("body").append("div")
        .attr("class", "tooltip").style("opacity", 0);


    svg.append("g")
        .attr("id", "y_axis")
        .attr("transform", "translate(" + [width + margins.left + widthRect / 2, offset + max_entry] + ")")
        .attr("class", "unfocusable no_pointer_event")
        .call(country_graph.y_axis_up);
    svg.append("g")
        .attr("id", "y_axis")
        .attr("transform", "translate(" + [width + margins.left + widthRect / 2, offset + max_entry] + ")")
        .attr("class", "unfocusable no_pointer_event")
        .call(country_graph.y_axis_down);

    svg.selectAll("#graph_entry")
        .data(data_entry_slice)
        .enter()
        .append("rect")
        .attr("width", (d, i) => timevals.year_scale(i + 1) - timevals.year_scale(i))
        .attr("height", (d, i) => d*country_graph.max_height/max_entry)
        .attr("x", (d, i) => margins.left + (timevals.year_scale(i + 1) - timevals.year_scale(i)) * (i - 1 / 2))
        .attr("y", (d, i) => country_graph.y + (max_entry - d)*country_graph.max_height/max_entry)
        .attr("class", "unfocusable")
        .attr("id", "graph_entry")
        .on("mouseover", d => {
            div.transition()
                .duration(200)
                .style("opacity", .9);
            div.html(Math.ceil(country_graph.domainOnlyScale_up.invert(d)))
                .style("left", (d3.event.pageX) + "px")
                .style("top", (d3.event.pageY - 28) + "px");
        })
        .on("mouseout", () => {
            div.transition()
                .duration(300)
                .style("opacity", 0);
        });

    svg.selectAll("#graph_exit")
        .data(data_exit_slice)
        .enter()
        .append("rect")
        .attr("width", (d, i) => timevals.year_scale(i + 1) - timevals.year_scale(i))
        .attr("height", (d, i) => d*country_graph.max_height/max_entry)
        .attr("x", (d, i) => margins.left + (timevals.year_scale(i + 1) - timevals.year_scale(i)) * (i - 1 / 2))
        .attr("y", (d, i) => country_graph.y + country_graph.max_height)
        .attr("class", "unfocusable")
        .attr("id", "graph_exit")
        .on("mouseover", d => {
            div.transition()
                .duration(200)
                .style("opacity", .9);
            div.html(Math.ceil(country_graph.domainOnlyScale_down.invert(d)))
                .style("left", (d3.event.pageX) + "px")
                .style("top", (d3.event.pageY - 28) + "px");
        })
        .on("mouseout", () => {
            div.transition()
                .duration(300)
                .style("opacity", 0);
        });

    // Define the line
    let valueline = d3.line()
        .x((d, i) => margins.left + (timevals.year_scale(i + 1) - timevals.year_scale(i)) * (i))
        .y((d, i) => country_graph.y + (max_entry - d)*country_graph.max_height/max_entry);


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
        .attr("cx", (d, i) => margins.left + (timevals.year_scale(i + 1) - timevals.year_scale(i)) * (i))
        .attr("cy", (d, i) => country_graph.y  + (max_entry - d)*country_graph.max_height/max_entry)
        .attr("id", "graph_dot");
};

country_graph.removeAll = function () {
    svg.selectAll("#y_axis")
        .remove();

    svg.selectAll("#line")
        .remove();

    svg.selectAll("#graph_entry")
        .remove();

    svg.selectAll("#graph_dot")
        .remove();

    svg.selectAll("#graph_exit")
        .remove();
};


country_graph.remove = function (data_entry_slice, data_exit_slice, data_diff_slice) {
    svg.selectAll("#y_axis")
        .remove();

    svg.selectAll("#line")
        .remove();

    svg.selectAll("#graph_entry")
        .data(data_entry_slice)
        .exit()
        .remove();

    svg.selectAll("#graph_dot")
        .data(data_diff_slice)
        .exit()
        .remove();

    svg.selectAll("#graph_exit")
        .data(data_exit_slice)
        .exit()
        .remove();
};
