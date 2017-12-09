"use strict";

const country_graph_left_offset = 0;
const country_graph = {
    size: box_size,
    x: country_graph_left_offset,
    y: height * sub_cst.graph_y / 100,
    offset: country_graph_left_offset,
    max_height: height * sub_cst.graph_height / 200,
    current_code: "CH",
    first_index_immigration_exit: 0,
    last_index_immigration_exit: 0,
    first_index_immigration_entry: 0,
    last_index_immigration_entry: 0,
    isValid: true
};


country_graph.graph = svg.append("text")
    .attr("x", country_graph.x)
    .attr("y", country_graph.y)
    .attr("font-size", country_graph.size)
    .attr("class", "unfocusable no_pointer_event");

country_graph.info_graph = d3.select("body").append("div").attr("class", "info_graph").style("opacity", 0);

country_graph.update_graph_new_country = function (country_code) {
    country_graph.load_data(country_code);
    country_graph.draw_graph_from_current_data();
};

country_graph.load_data = function (country_code) {
    country_graph.current_code = (country_code !== undefined) ? country_code : country_graph.current_code;

    let data_immigration_entry_filtered = project.data_immigration_entry.filter(x => x.country_asylum === country_graph.current_code);
    let data_immigration_exit_filtered = project.data_immigration_exit.filter(x => x.country_origin === country_graph.current_code);

    if (data_immigration_exit_filtered.length > 0 && data_immigration_entry_filtered.length > 0) {
        const max_entry = Math.max(...data_immigration_exit_filtered.map(x => x.value), ...data_immigration_entry_filtered.map(x => x.value));

        country_graph.domainOnlyScale_up = d3.scaleLinear()
            .domain([0, max_entry])
            .range([0, country_graph.max_height]);
        country_graph.domainOnlyScale_down = d3.scaleLinear()
            .domain([max_entry, 0])
            .range([-country_graph.max_height, 0]);

        const data_entry = [];
        const data_exit = [];
        const data_diff = [];

        country_graph.y_axis_up = d3.axisRight(country_graph.domainOnlyScale_up)
            .ticks(5)
            .tickFormat(d3.format("d"));
        country_graph.y_axis_down = d3.axisRight(country_graph.domainOnlyScale_down)
            .ticks(5)
            .tickFormat(d3.format("d"));

        for (let i = 0, i_entry = 0, i_exit = 0; i <= timevals.max_year - timevals.min_year; i++) {
            if (data_immigration_entry_filtered[i_entry] !== undefined && data_immigration_entry_filtered[i_entry].year === (timevals.min_year + i).toString()) {
                data_entry.push(country_graph.domainOnlyScale_up(data_immigration_entry_filtered[i_entry].value));
                i_entry++;
            } else {
                data_entry.push(0);
            }
            if (data_immigration_exit_filtered[i_exit] !== undefined && data_immigration_exit_filtered[i_exit].year === (timevals.min_year + i).toString()) {
                data_exit.push(country_graph.domainOnlyScale_up(data_immigration_exit_filtered[i_exit].value));
                i_exit++;
            } else {
                data_exit.push(0);
            }

            data_diff.push(data_entry[i] - data_exit[i])
        }
        country_graph.data_entry = data_entry;
        country_graph.data_exit = data_exit;
        country_graph.data_diff = data_diff;
        country_graph.max_entry = country_graph.domainOnlyScale_up(max_entry);
        country_graph.isValid = true;
    } else {
        country_graph.isValid = false;
    }
};

country_graph.draw_graph_from_current_data = function () {

    const current_year_selected = timevals.rel_to_year(cursor.get_relative_cursor_x()) - timevals.min_year;

    country_graph.removeAll();

    if (country_graph.isValid) {
        svg.append("g")
            .attr("id", "y_axis")
            .attr("transform", "translate(" + [(cst.graph_width + 2) * width / 100, country_graph.y + country_graph.max_height] + ")")
            .attr("class", "unfocusable no_pointer_event")
            .call(country_graph.y_axis_up);
        svg.append("g")
            .attr("id", "y_axis")
            .attr("transform", "translate(" + [(cst.graph_width + 2) * width / 100, country_graph.y + country_graph.max_height] + ")")
            .attr("class", "unfocusable no_pointer_event")
            .call(country_graph.y_axis_down);

        svg.selectAll("#graph_entry")
            .data(country_graph.data_entry)
            .enter()
            .append("rect")
            .attr("width", (d, i) => timevals.year_scale(i + 1) - timevals.year_scale(i))
            .attr("height", (d, i) => d * country_graph.max_height / country_graph.max_entry)
            .attr("x", (d, i) => margins.inner + (timevals.year_scale(i + 1) - timevals.year_scale(i)) * (i - 1 / 2))
            .attr("y", (d, i) => country_graph.y + (country_graph.max_entry - d) * country_graph.max_height / country_graph.max_entry)
            .attr("class", "unfocusable")
            .attr("id", (d, i) => {
                    if (i === current_year_selected) {
                        return "graph_entry_focused"
                    } else return "graph_entry"
                }
            )
            .on("mouseover", d => {
                country_graph.info_graph.transition()
                    .duration(200)
                    .style("opacity", .9);
                country_graph.info_graph.html(Math.ceil(country_graph.domainOnlyScale_up.invert(d)))
                    .style("left", (d3.event.pageX) + "px")
                    .style("top", (d3.event.pageY - 28) + "px");
            })
            .on("mouseout", () => {
                country_graph.info_graph.transition()
                    .duration(300)
                    .style("opacity", 0);
            });

        svg.selectAll("#graph_exit")
            .data(country_graph.data_exit)
            .enter()
            .append("rect")
            .attr("width", (d, i) => timevals.year_scale(i + 1) - timevals.year_scale(i))
            .attr("height", (d, i) => d * country_graph.max_height / country_graph.max_entry)
            .attr("x", (d, i) => margins.inner + (timevals.year_scale(i + 1) - timevals.year_scale(i)) * (i - 1 / 2))
            .attr("y", (d, i) => country_graph.y + country_graph.max_height)
            .attr("class", "unfocusable")
            .attr("id", (d, i) => {
                    if (i === current_year_selected) {
                        return "graph_exit_focused"
                    } else return "graph_exit"
                }
            )
            .on("mouseover", d => {
                country_graph.info_graph.transition()
                    .duration(200)
                    .style("opacity", .9);
                country_graph.info_graph.html(Math.ceil(country_graph.domainOnlyScale_down.invert(d)))
                    .style("left", (d3.event.pageX) + "px")
                    .style("top", (d3.event.pageY - 28) + "px");
            })
            .on("mouseleave", () => {
                country_graph.info_graph.transition()
                    .duration(300)
                    .style("opacity", 0);
            });

        // Define the line
        let valueline = d3.line()
            .x((d, i) => margins.inner + (timevals.year_scale(i + 1) - timevals.year_scale(i)) * (i))
            .y((d, i) => country_graph.y + (country_graph.max_entry - d) * country_graph.max_height / country_graph.max_entry);


        // Add the valueline path.
        svg.selectAll("#line")
            .data(country_graph.data_diff)
            .enter()
            .append("path")
            .attr("id", "line")
            .attr("d", valueline(country_graph.data_diff));

        // Add the scatterplot
        svg.selectAll("I_DONT_EXIST_YET")
            .data(country_graph.data_diff)
            .enter()
            .append("circle")
            .attr("r", 3.5)
            .attr("cx", (d, i) => margins.inner + (timevals.year_scale(i + 1) - timevals.year_scale(i)) * (i))
            .attr("cy", (d, i) => country_graph.y + (country_graph.max_entry - d) * country_graph.max_height / country_graph.max_entry)
            .attr("id", "graph_dot");
    }
};

country_graph.removeAll = function () {
    svg.selectAll("#y_axis")
        .remove();

    svg.selectAll("#line")
        .remove();

    svg.selectAll("#graph_entry")
        .remove();

    svg.selectAll("#graph_entry_focused")
        .remove();

    svg.selectAll("#graph_exit")
        .remove();

    svg.selectAll("#graph_exit_focused")
        .remove();

    svg.selectAll("#graph_dot")
        .remove();
};
