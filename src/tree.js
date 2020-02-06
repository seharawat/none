import React, { Component, useState, useEffect } from 'react';
import { debounce } from './utils';
const TreeContainer = (props) => {
    const colorCode = [
        "#BEDAC1",
        "#CEF0B9",
        "#AFCCD1",
        "#CEEDFD",
        "#F7FCE3",
        "#F3F0F5"
    ];
    const sectorColors = [
        "#026B73",
        "#5E6C38",
        "#61797B",
        "#296486",
        "#94515D",
        "#376D5F",
        "#A46E45",
        "#5A526E",
        "#478A80",
        "#264355",
        "#836C43"
    ];
    let bodyNode;
    const traverseSubsector = (array, parentColor) => {
        array.forEach(ele => {
            ele.color = parentColor;
            traverseSubsector(ele.children, parentColor);
        });
    }
    const removeDuplicateNodes = (bodyNode) => {
        while (bodyNode.firstChild) {
            document.querySelector("#zoomRange").value = 50;
            bodyNode.removeChild(bodyNode.firstChild);
            var indexList = document.querySelector(".indexList table");
            indexList.parentNode.removeChild(indexList);
        }
        var sectorList = document.querySelector("div.sectorLegend");
        // while (sectorList.firstChild) {
        //     sectorList.removeChild(sectorList.firstChild);
        // }
    }
    const setSectorColor = (sectors) => {
        if (!Array.isArray(sectors) && sectors.length == 0) return;
        let colorIndex = 0;
        sectors.forEach((ele, idx) => {
            if (colorIndex > 10) colorIndex = 0;
            ele.color = sectorColors[colorIndex];
            traverseSubsector(ele.children, ele.color);
            colorIndex++;
        });
    }

    useEffect(() => {
        bodyNode = document.getElementById("body");
        removeDuplicateNodes(bodyNode);
        let responseData = props.data;
        let jsonData = responseData.data;
        setSectorColor(jsonData.children);
        createSectorMenu(jsonData.children);
        let columns = responseData.columnNames;
        if (jsonData.name != "") {
            createMenu(responseData.columnNames, colorCode);
            drawTree(jsonData, columns.length, 20);
        }
    });
    const createMenu = (columns, color) => {
        let relTree = document.querySelector(".indexList");
        let table = document.createElement("table");
        relTree.appendChild(table);
        let colorIndex = 0;
        columns.forEach((e, i) => {
            let tr = document.createElement("tr");
            let td = document.createElement("td");
            let spanColor = document.createElement("span");
            let spanText = document.createElement("span");
            spanText.textContent = e;
            if (colorIndex > 5) {
                colorIndex = 0;
            }
            spanColor.style.backgroundColor = color[colorIndex];
            td.appendChild(spanColor);
            td.appendChild(spanText);
            tr.appendChild(td);
            table.appendChild(tr);
            colorIndex++;
        });
    }

    const createSectorMenu = (data) => {
        let div = document.querySelector("div.sectorLegend");
        data.forEach(ele => {
            let colorBox = document.createElement("span");
            colorBox.style.backgroundColor = ele.color;
            colorBox.classList.add("colorBox");
            div.appendChild(colorBox);
            let textBox = document.createElement("span");
            textBox.textContent = ele.name;
            div.appendChild(textBox);
        });
    }

    function drawTree(root, colm, tableRowHeight) {
        let margin = {
            top: 20,
            right: 120,
            bottom: 20,
            left: 120
        },
            width = 960 - margin.right - margin.left,
            height = 800 - margin.top - margin.bottom;

        let mouseWheelName;
        let rectNode = {
            width: 120,
            height: 45,
            textMargin: 5
        };
        const duration = 400;

        let i = 0,
            defs;

        let tree = window.d3.layout
            .cluster()
            .nodeSize([rectNode.width + 20, rectNode.height]);
        let toolTipContent,
            toolTipDiv = window.d3
                .select("body")
                .append("div")
                .attr("class", "tooltip")
                .style("opacity", 0);
        let maxDepth = 0;
        let maxTreeWidth = levelTraversal(tree.nodes(root), function (currentLevel) {
            maxDepth++;
        });
        height = maxTreeWidth * (rectNode.height + 20) - margin.right - margin.left;
        width = maxDepth * (rectNode.width * 1.7) - margin.top - margin.bottom;

        tree.separation(function separation(a, b) {
            return a.parent == b.parent ? 0.9 : 0.9;
        });
        let zm = window.d3.behavior
            .zoom()
            .scaleExtent([0.2, 3])
            .on("zoom", redraw);
        var dr = window.d3.behavior
            .drag()
            .on("dragstart", dragstarted)
            .on("dragend", dragended);
        let svg = window.d3
            .select("#body")
            .append("svg")
            .attr("class", "grab")
            .classed("svg-content-responsive", true)
            .attr("width", window.innerWidth)
            .attr("height", window.innerHeight)
            .call(zm)
            .append("g")
            .attr("transform", "translate(" + 700 + "," + 20 + ") scale(1)");

        window.d3.select("svg").call(dr);

        zm.translate([350, 20]);

        root.x0 = 0;
        root.y0 = height / 2;

        function collapse(d) {
            if (d.children) {
                d._children = d.children;
                d._children.forEach(collapse);
                d.children = null;
            }
        }
        setMouseWheelEvent();
        window.d3.select("#body")
            .select("svg")
            .on(mouseWheelName, null);
        window.d3.select("#body")
            .select("svg")
            .on("dblclick.zoom", null);
        defs = svg.append("defs");
        initArrowDef(defs);
        initDropShadow(defs);
        root.children.forEach(collapse);
        update(root);
        window.onresize = debounce(reportWindowSize, 300);

        function update(source) {
            let nodes = tree.nodes(root).reverse(),
                links = tree.links(nodes);
            nodes.forEach(function (d) {
                let lineHeight = colm + 2;
                if (d.depth == 0 && d.name != "Root") {
                    d.y = -(tableRowHeight * lineHeight + 40 - tableRowHeight * colm);
                    let attr = window.d3
                        .select("#body")
                        .select("svg g")
                        .attr("transform");
                    if (attr == "translate(700,20) scale(1)") {
                        window.d3
                            .select("#body")
                            .select("svg g")
                            .attr(
                                "transform",
                                "translate(" + 700 + "," + (20 - d.y) + ") scale(1)"
                            )
                    };
                }
                if (d.depth == 1) {
                    lineHeight = 2;
                    d.y = d.depth * (tableRowHeight * lineHeight + 40);
                } else if (d.depth > 1) {
                    d.y =
                        d.depth * (tableRowHeight * lineHeight + 40) - tableRowHeight * colm;
                }
            });

            // 1) ******************* Update the nodes *******************
            let node = svg.selectAll("g.node").data(nodes, function (d) {
                return d.id || (d.id = ++i);
            });
            let nodeEnter = node
                .enter()
                .insert("g", "g.node")
                .attr("class", "node")
                .attr("transform", function (d) {
                    return "translate(" + source.y0 + "," + source.x0 + ")";
                })
                .on("click", function (d) {
                    click(d);
                });

            let foreignObject = nodeEnter
                .append("foreignObject")
                .attr("x", rectNode.textMargin)
                .attr("y", rectNode.textMargin)
                .attr("width", function () {
                    return rectNode.width - rectNode.textMargin * 2 < 0 ?
                        0 :
                        rectNode.width - rectNode.textMargin * 2;
                })
                .attr("height", function (d) {
                    let colmVar = colm;
                    if (d.name == "Root") colmVar = 0;
                    return (colmVar + 1) * tableRowHeight + 1;
                })
                .html(nodeLayout)
                .on("mouseover", function (d) {
                    if (d.name == "Root") return;
                    toolTipContent = d;
                    toolTipDiv
                        .transition()
                        .duration(200)
                        .style("opacity", 0.8);
                    toolTipDiv
                        .html(toolTipLayout(toolTipContent))
                        .style("left", window.d3.event.pageX + "px")
                        .style("top", window.d3.event.pageY + "px");
                })
                .on("mouseout", function (d) {
                    toolTipDiv
                        .transition()
                        .duration(500)
                        .style("opacity", 0);
                });
            let nodeUpdate = node
                .transition()
                .duration(duration)
                .attr("transform", function (d) {
                    return "translate(" + d.x + "," + d.y + ")";
                });

            nodeUpdate.select("foreignObject").attr("class", function (d) {
                return d._children ? "node-rect-closed" : "node-rect";
            });

            nodeUpdate.select("text").style("fill-opacity", 1);

            let nodeExit = node
                .exit()
                .transition()
                .duration(duration)
                .attr("transform", function (d) {
                    return "translate(" + source.x + "," + source.y + ")";
                })
                .remove();

            nodeExit.select("text").style("fill-opacity", 1e-6);

            // 2) ******************* Update the links *******************
            let link = svg.selectAll("path.link").data(links, function (d) {
                return d.target.id;
            });

            let linkenter = link
                .enter()
                .insert("path", "g")
                .attr("class", "link")
                .attr("id", function (d) {
                    return "linkID" + d.target.id;
                })
                .attr("d", function (d) {
                    var o = {
                        x: source.y0,
                        y: source.x0
                    };
                    return elbow({
                        source: o,
                        target: o
                    });
                })
                .attr("marker-end", "url(#end-arrow)");

            let linkUpdate = link
                .transition()
                .duration(duration)
                .attr("d", function (d) {
                    return elbow(d);
                });

            link
                .exit()
                .transition()
                .remove();

            nodes.forEach(function (d) {
                d.y0 = d.x;
                d.x0 = d.y;
            });
        }

        function setMouseWheelEvent() {
            if (
                window.d3
                    .select("#body")
                    .select("svg")
                    .on("wheel.zoom")
            ) {
                mouseWheelName = "wheel.zoom";
                return window.d3
                    .select("#body")
                    .select("svg")
                    .on("wheel.zoom");
            }
            if (
                window.d3
                    .select("#body")
                    .select("svg")
                    .on("mousewheel.zoom") != null
            ) {
                mouseWheelName = "mousewheel.zoom";
                return window.d3
                    .select("#body")
                    .select("svg")
                    .on("mousewheel.zoom");
            }
            if (
                window.d3
                    .select("#body")
                    .select("svg")
                    .on("DOMMouseScroll.zoom")
            ) {
                mouseWheelName = "DOMMouseScroll.zoom";
                return window.d3
                    .select("#body")
                    .select("svg")
                    .on("DOMMouseScroll.zoom");
            }
        }

        function click(d) {
            if (d.children) {
                d._children = d.children;
                d.children = null;
            } else {
                d.children = d._children;
                d._children = null;
            }
            update(d);
        }

        function redraw() {
            let transformAttr = window.d3.select("svg g").attr("transform");
            let transformAttrs = transformAttr.split(" ");
            svg.attr(
                "transform",
                "translate(" + window.d3.event.translate + ") " + transformAttrs[1]
            );
        }

        function dragstarted() {
            let svg = document.querySelector("svg");
            svg.classList.remove("grab");
            svg.classList.add("grabbing");
        }

        function dragended() {
            let svg = document.querySelector("svg");
            svg.classList.remove("grabbing");
            svg.classList.add("grab");
        }

        function elbow(d) {
            let dept;
            if (d.source.depth == 0 && d.source.name == "Root") {
                dept = 1;
            } else {
                dept = colm + 1;
            }
            return (
                "M " +
                (d.source.x + rectNode.width / 2) +
                " " +
                (d.source.y + 12) +
                " V " +
                (d.source.y + dept * tableRowHeight + 40) +
                " H " +
                (d.target.x + rectNode.width / 2) +
                " V " +
                (d.target.y - 12)
            );
        }

        function initDropShadow(e) {
            let filter = e
                .append("filter")
                .attr("id", "drop-shadow")
                .attr("color-interpolation-filters", "sRGB");

            filter
                .append("feOffset")
                .attr("result", "offOut")
                .attr("in", "SourceGraphic")
                .attr("dx", 0)
                .attr("dy", 0);

            filter.append("feGaussianBlur").attr("stdDeviation", 2);

            filter
                .append("feOffset")
                .attr("dx", 2)
                .attr("dy", 2)
                .attr("result", "shadow");

            filter
                .append("feComposite")
                .attr("in", "offOut")
                .attr("in2", "shadow")
                .attr("operator", "over");
        }

        function initArrowDef(e) {
            e.append("marker")
                .attr("id", "end-arrow")
                .attr("viewBox", "0 -5 10 10")
                .attr("refX", 0)
                .attr("refY", 0)
                .attr("markerWidth", 6)
                .attr("markerHeight", 6)
                .attr("orient", "auto")
                .attr("class", "arrow")
                .append("path")
                .attr("d", "M0,-5L10,0L0,5");

            e.append("marker")
                .attr("id", "end-arrow-selected")
                .attr("viewBox", "0 -5 10 10")
                .attr("refX", 0)
                .attr("refY", 0)
                .attr("markerWidth", 6)
                .attr("markerHeight", 6)
                .attr("orient", "auto")
                .attr("class", "arrowselected")
                .append("path")
                .attr("d", "M0,-5L10,0L0,5");
        }

        function levelTraversal(tree, func) {
            let max = 0;
            if (tree && tree.length > 0) {
                let currentDepth = tree[0].depth;
                let fifo = [];
                let currentLevel = [];

                fifo.push(tree[0]);
                while (fifo.length > 0) {
                    let node = fifo.shift();
                    if (node.depth > currentDepth) {
                        func(currentLevel);
                        currentDepth++;
                        max = Math.max(max, currentLevel.length);
                        currentLevel = [];
                    }
                    currentLevel.push(node);
                    if (node.children) {
                        for (let j = 0; j < node.children.length; j++) {
                            fifo.push(node.children[j]);
                        }
                    }
                }
                func(currentLevel);
                return Math.max(max, currentLevel.length);
            }
            return 0;
        }

        function collision(siblings) {
            debugger;
            let minPadding = 5;
            if (siblings) {
                for (let i = 0; i < siblings.length - 1; i++) {
                    if (siblings[i + 1].x - (siblings[i].x + rectNode.width) < minPadding)
                        siblings[i + 1].x = siblings[i].x + rectNode.width + minPadding;
                }
            }
        }

        function createTable(d, tableRowHeight) {
            if (d.name != "Root") {
                let colorIndex = 0;
                return d.values
                    .map((col, idx) => {
                        if (colorIndex > 5) {
                            colorIndex = 0;
                        }
                        return (
                            '<tr style="background-color:' +
                            colorCode[colorIndex++] +
                            "; text-align: center; width: 100%; height:" +
                            tableRowHeight +
                            'px;"><td valign="center">' +
                            col[1] +
                            "</td></tr>"
                        );
                    })
                    .join(" ");
            }
            return "";
        }
        let zoom = window.d3.behavior.zoom();

        function createTooltipInfo(d) {
            if (d.name != "Root") {
                return d.values
                    .map((col, idx) => {
                        return "<b>" + col[0] + ": </b>" + col[1] + "<br>";
                    })
                    .join("");
            }
            return "";
        }

        function toolTipLayout(toolTipContent) {
            return (
                '<div  class="tooltip-text wordwrap">' +
                "<b>" +
                toolTipContent.name +
                "</b><br>" +
                createTooltipInfo(toolTipContent) +
                "</div>"
            );
        }

        function nodeLayout(d) {
            let borderColor = d._children || d.children ? "#fff" : "#000";
            let rt =
                '<div style="width: ' +
                (rectNode.width - rectNode.textMargin * 2) +
                'px;text-align:center;overflow: hidden;" class="node-text divSec wordwrap">' +
                '<table class="data-table" style="width:' +
                (rectNode.width - rectNode.textMargin * 2) +
                "px;border-color:" +
                borderColor +
                '" ><tr style="text-align: center; width:' +
                (rectNode.width - rectNode.textMargin * 2) +
                "px; height: " +
                tableRowHeight +
                "px;background-color:" +
                d.color +
                '"><td valign="center">' +
                d.name +
                "</td></tr>" +
                createTable(d, tableRowHeight) +
                "</table></div>";
            return rt;
        }

        function reportWindowSize() {
            let svgTag = document.getElementsByTagName("svg")[0];
            svgTag.setAttribute("height", window.innerHeight);
            svgTag.setAttribute("width", window.innerWidth);
        }
    }

    return (
        <div id="body"></div>
    )
}

export default TreeContainer;
