const margins = {
    root: 1,
    inner: 1,
};

const cst = {
    left_div_width: 65,
    map_height: 65,
    timeline_width: 90,
    timeline_height: 5,
    graph_width : 90,
    year_div_height: 5,
    events_height: 40
};
const sub_cst = {
    graph_height: 100 - cst.map_height
    - cst.timeline_height - 3*margins.inner,

    images_height: 100 - cst.year_div_height
    - cst.events_height - 2*margins.inner,

    timeline_y: cst.map_height + margins.inner,
    graph_y: cst.map_height + cst.timeline_height + 2*margins.inner,
    right_div_x: cst.left_div_width + margins.inner,
    events_y: cst.year_div_height + margins.inner,
    images_y: cst.year_div_height + cst.events_height + 2*margins.inner,

    right_div_width: 100 - cst.left_div_width - margins.inner
};

const width = 600;
const height = 400;

