"use strict";

const country_graph_size = 24;
const country_graph_left_offset = 20;
const country_graph = {
    size: box_size,
    x: margins.left + country_graph_left_offset,
    y: margins.top +
    timevals.height + country_graph_size,
    offset: country_graph_left_offset,
    max_height: 30,
    current_code: "CH",
    first_index_immigration_exit: 0,
    last_index_immigration_exit: 0,
    first_index_immigration_entry: 0,
    last_index_immigration_entry:0
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


let getIndexes = function (data,current_code,tag_name) {
    let first_index_immigration = 0;
    let last_index_immigration = 0;
    let exit_found = false;

    let i = 0;

    while(i < data.length){
        if (!exit_found && data[i][tag_name] === current_code) {
            first_index_immigration = i;
            exit_found = true
        }

        if (exit_found && data[i][tag_name] !== current_code) {
            last_index_immigration = i;
            break
        }

        i ++;
    }
    return [first_index_immigration,last_index_immigration];
};


country_graph.update_graph = function (country_code) {
    d3.csv("data/data_immigration_entry.csv", function (data_immigration_entry) {
        d3.csv("data/data_immigration_exit.csv", function (data_immigration_exit) {
            const last_year_selected = timevals.rel_to_year(cursor.get_relative_cursor_x()) - timevals.min_year;

            const current_code = (country_code !== undefined) ? country_code : country_graph.current_code;
            const [first_index_immigration_exit,last_index_immigration_exit] = getIndexes(data_immigration_exit,current_code,'country_origin');
            const [first_index_immigration_entry,last_index_immigration_entry] = getIndexes(data_immigration_entry,current_code,'country_asylum');

            // Only if there is data change the data indexes.
            if(last_index_immigration_entry !== 0 && last_index_immigration_exit !== 0){
                country_graph.current_code = current_code;
                country_graph.first_index_immigration_exit = first_index_immigration_exit;
                country_graph.last_index_immigration_exit = last_index_immigration_exit;
                country_graph.first_index_immigration_entry = first_index_immigration_entry;
                country_graph.last_index_immigration_entry = last_index_immigration_entry;
            }

            let data_immigration_entry_slice = data_immigration_entry.slice(country_graph.first_index_immigration_entry,country_graph.last_index_immigration_entry);
            let data_immigration_exit_slice = data_immigration_exit.slice(country_graph.first_index_immigration_exit,country_graph.last_index_immigration_exit);

            const max_entry = Math.max(...data_immigration_exit_slice.map(x => x.Value),...data_immigration_entry_slice.map(x => x.Value));
            const domainOnlyScale_up = d3.scaleLinear().domain([0,max_entry]).range([0,100]);
            const domainOnlyScale_down = d3.scaleLinear().domain([max_entry,0]).range([-100,0]);

            const data_entry = [];
            const data_exit = [];
            const data_diff = [];

            country_graph.y_axis_up = d3.axisRight(domainOnlyScale_up).ticks(5);
            country_graph.y_axis_down = d3.axisRight(domainOnlyScale_down).ticks(5);


            for (let i = 0, i_entry = 0,i_exit= 0; i < timevals.max_year - timevals.min_year; i++) {
                if(data_immigration_entry_slice[i_entry].Year === (timevals.min_year + i).toString()){
                    data_entry.push(domainOnlyScale_up(data_immigration_entry_slice[i_entry].Value));
                    i_entry++;
                }else{
                    data_entry.push(0)
                }
                if(data_immigration_exit_slice[i_exit].Year === (timevals.min_year + i).toString()){
                    data_exit.push(domainOnlyScale_up(data_immigration_exit_slice[i_exit].Value));
                    i_exit++;
                }else{
                    data_exit.push(0)
                }

                data_diff.push(data_entry[i] - data_exit[i])
            }

            const data_entry_slice = data_entry.slice(0, last_year_selected);
            const data_exit_slice = data_exit.slice(0, last_year_selected);
            const data_diff_slice = data_diff.slice(0, last_year_selected);

            country_graph.draw_graph(domainOnlyScale_up(max_entry), data_entry_slice, data_exit_slice, data_diff_slice)
        })
    });
};

country_graph.draw_graph = function (max_entry, data_entry_slice, data_exit_slice, data_diff_slice) {
    const offset = margins.top + (timevals.height) + country_graph.max_height;

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

    svg.append("g")
        .attr("id", "y_axis")
        .attr("transform", "translate("+[width + margins.left, offset + max_entry]+")")
        .call(country_graph.y_axis_up);
    svg.append("g")
        .attr("id", "y_axis")
        .attr("transform", "translate("+[width+ margins.left, offset + max_entry]+")")
        .call(country_graph.y_axis_down);

    svg.selectAll("#graph_entry")
        .data(data_entry_slice)
        .enter()
        .append("rect")
        .attr("width", (d, i) => timevals.year_scale(i + 1) - timevals.year_scale(i))
        .attr("height", (d, i) => d)
        .attr("x", (d, i) => margins.left + (timevals.year_scale(i + 1) - timevals.year_scale(i)) * i)
        .attr("y", (d, i) => offset + max_entry - d)
        .attr("class", "unfocusable")
        .attr("id", "graph_entry");

    svg.selectAll("#graph_exit")
        .data(data_exit_slice)
        .enter()
        .append("rect")
        .attr("width", (d, i) => timevals.year_scale(i + 1) - timevals.year_scale(i))
        .attr("height", (d, i) => d)
        .attr("x", (d, i) => margins.left + (timevals.year_scale(i + 1) - timevals.year_scale(i)) * i)
        .attr("y", (d, i) => offset + max_entry)
        .attr("class", "unfocusable")
        .attr("id", "graph_exit");

    // Define the line
    let valueline = d3.line()
        .x((d, i) => margins.left + (timevals.year_scale(i + 1) - timevals.year_scale(i)) * (i + 0.5))
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
        .attr("cx", (d, i) => margins.left + (timevals.year_scale(i + 1) - timevals.year_scale(i)) * (i + 0.5))
        .attr("cy", (d, i) => offset + max_entry - d)
        .attr("id", "graph_dot");

};
