"use strict";

const country_graph_left_offset = 0;
const country_graph = {
    size: box_size,
    x: country_graph_left_offset,
    y: height * sub_cst.graph_y / 100,
    offset: country_graph_left_offset,
    max_height: height * sub_cst.graph_height / 200,
    current_code: "CH",
    isValid: true,
    transition_time: 700
};

const color_normal_exit = "#f4b2b7";
const color_normal_entry = "#b2d2f4";
const color_focused_exit = "#b2182b";
const color_focused_entry = "#2166ac";


country_graph.graph = svg.append("text")
    .attr("x", country_graph.x)
    .attr("y", country_graph.y)
    .attr("font-size", country_graph.size)
    .attr("class", "unfocusable no_pointer_event");

country_graph.info_graph = d3.select("body").append("div").attr("class", "info_graph").style("opacity", 0);

country_graph.init = function () {
    country_graph.load_data(country_graph.current_code);

    // Make sure to have data exit and entry
    country_graph.draw_graph_from_new_country_data();
    country_graph.draw_graph_from_new_country_data();
};

country_graph.update_graph_new_country = function (country_code) {
    if (country_code !== country_graph.current_code) {
        country_graph.remove_axis();
        country_graph.load_data(country_code);
        country_graph.draw_graph_from_new_country_data();
    }
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


country_graph.update_graph_time = function () {
    const current_year_selected = timevals.rel_to_year(cursor.get_relative_cursor_x()) - timevals.min_year;

    svg.selectAll("#graph_entry")
        .data(country_graph.data_entry)
        .style("fill", (d, i) => {
                if (i === current_year_selected) {
                    return color_focused_entry
                } else return color_normal_entry
            }
        );

    svg.selectAll("#graph_exit")
        .data(country_graph.data_exit)
        .style("fill", (d, i) => {
                if (i === current_year_selected) {
                    return color_focused_exit
                } else return color_normal_exit
            }
        );
};

country_graph.draw_graph_from_new_country_data = function () {
    const current_year_selected = timevals.rel_to_year(cursor.get_relative_cursor_x()) - timevals.min_year;

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

        let entry = svg.selectAll("#graph_entry")
            .data(country_graph.data_entry);

        let exit = svg.selectAll("#graph_exit")
            .data(country_graph.data_exit);

        let line = svg.selectAll("#line")
            .data(country_graph.data_diff);

        let point = svg.selectAll("#graph_dot")
            .data(country_graph.data_diff);

        entry.enter()
            .append("rect")
            .attr("width", (d, i) => timevals.year_scale(i + 1) - timevals.year_scale(i))
            .attr("x", (d, i) => margins.inner + (timevals.year_scale(i + 1) - timevals.year_scale(i)) * (i - 1 / 2))
            .attr("class", "unfocusable")
            .attr("id", "graph_entry")
            .style("fill", (d, i) => {
                    if (i === current_year_selected) {
                        return color_focused_entry
                    } else return color_normal_entry
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

        exit.enter()
            .append("rect")
            .attr("width", (d, i) => timevals.year_scale(i + 1) - timevals.year_scale(i))
            .attr("x", (d, i) => margins.inner + (timevals.year_scale(i + 1) - timevals.year_scale(i)) * (i - 1 / 2))
            .attr("y", (d, i) => country_graph.y + country_graph.max_height)
            .attr("class", "unfocusable")
            .attr("id", "graph_exit")
            .style("fill", (d, i) => {
                if (i === current_year_selected) {
                    return color_focused_exit
                } else return color_normal_exit
            })
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

        line.enter()
            .append("path")
            .attr("id", "line");

        point.enter()
            .append("circle")
            .attr("r", 3)
            .attr("cx", (d, i) => margins.inner + (timevals.year_scale(i + 1) - timevals.year_scale(i)) * (i))
            .attr("id", "graph_dot");

        entry.exit().remove();
        exit.exit().remove();
        line.exit().remove();
        point.exit().remove();

        entry.transition()
            .duration(country_graph.transition_time)
            .attr("y", (d, i) => country_graph.y + (country_graph.max_entry - d) * country_graph.max_height / country_graph.max_entry)
            .attr("height", (d, i) => d * country_graph.max_height / country_graph.max_entry);

        exit.transition()
            .duration(country_graph.transition_time)
            .attr("height", (d, i) => d * country_graph.max_height / country_graph.max_entry);

        line.transition(country_graph.transition_time).attr("d", country_graph.valueline(country_graph.data_diff));

        point.transition(country_graph.transition_time)
            .attr("cy", (d, i) => country_graph.y + (country_graph.max_entry - d) * country_graph.max_height / country_graph.max_entry)

    } else {
        country_graph.removeAll();
    }
};

country_graph.valueline = d3.line()
    .x((d, i) => margins.inner + (timevals.year_scale(i + 1) - timevals.year_scale(i)) * (i))
    .y((d, i) => country_graph.y + (country_graph.max_entry - d) * country_graph.max_height / country_graph.max_entry);


country_graph.removeAll = function () {


    svg.selectAll("#graph_entry")
        .remove();

    svg.selectAll("#graph_exit")
        .remove();

    country_graph.remove_line();
    country_graph.remove_axis();
};

country_graph.remove_axis = function () {
    svg.selectAll("#y_axis")
        .remove();
};

country_graph.remove_line = function () {
    svg.selectAll("#line")
        .remove();

    svg.selectAll("#graph_dot")
        .remove();
};
