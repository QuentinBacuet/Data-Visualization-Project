"use strict";

const photo_gallery = {
    width_g: 500,
    height_g: 500,
    x: 1000,
    y: 0,
    isFocused: -1,
    urls: []
};

photo_gallery.div = d3.select("#gallery").append("text")
    .style("position", "relative")
    .style("width", photo_gallery.width_g + "px")
    .style("height", photo_gallery.height_g + "px")
    .style("left", photo_gallery.x + "px")
    .style("top", photo_gallery.y + "px")
    .attr("class", "unfocusable");

photo_gallery.draw = function () {
    let stratify = d3.stratify()
        .parentId(function (d) {
            return d.id.substring(0, d.id.lastIndexOf("."));
        });

    let root = stratify(photo_gallery.urls).sum(function (d) {
        return d.value
    });

    let treemap = d3.treemap()
        .tile(d3.treemapBinary)
        .size([photo_gallery.width_g, photo_gallery.height_g])
        .padding(1)
        .round(true);

    treemap(root);
    photo_gallery.drawTreemap(root)

};

photo_gallery.randomize = function (min, max) {
    photo_gallery.urls.filter(function (d) {
        return d.id !== "root"
    })
        .forEach(function (d) {
            d.value = ~~(d3.randomUniform(min, max)())
        })
};

photo_gallery.onClick = function (d, i) {

    if (photo_gallery.isFocused !== i) {
        photo_gallery.randomize(1, 3);
        photo_gallery.urls[i + 1].value = 20;
        photo_gallery.draw()
    } else {
        photo_gallery.randomize(1, 10);
        photo_gallery.draw()
    }

    photo_gallery.isFocused = i;
};

photo_gallery.drawTreemap = function (root) {

    let node = photo_gallery.div.selectAll(".node").data(root.children);

    let newNode = node.enter()
        .append("div").attr("class", "node").on('click', photo_gallery.onClick);

    node.merge(newNode)
        .transition()
        .duration(1000)
        .style("left", function (d) {
            return d.x0 + "px"
        })
        .style("top", function (d) {
            return d.y0 + "px"
        })
        .style("width", function (d) {
            return (d.x1 - d.x0) + "px"
        })
        .style("height", function (d) {
            return (d.y1 - d.y0) + "px"
        })
        .style("background-image", function (d) {
            return "url(".concat(d.data.img).concat(")");
        });
};

photo_gallery.addNewUrls = function (urls) {
    let temp = [{id: "root", value: null}];

    urls.forEach(function (url, i) {
        temp.push({id: "root.".concat(i), value: null, img: url})
    });

    photo_gallery.urls = temp;
    photo_gallery.isFocused = -1;
    photo_gallery.div.selectAll(".node").remove();

    photo_gallery.randomize(1, 10);
    photo_gallery.draw();
};