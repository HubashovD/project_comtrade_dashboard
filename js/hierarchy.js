function hierarchy() {



    function update() {

        var list = document.getElementById('hierarchyBlock')
        try {
            while (list.firstChild) {
                list.removeChild(list.lastChild);
            }
        } catch {}
        il = document.createElement('div');
        il.id = 'hierarchy'
        list.appendChild(il)


        var diameter = 700,
            radius = diameter / 2,
            innerRadius = radius - 120;

        var cluster = d3.cluster()
            .size([360, innerRadius]);

        var line = d3.radialLine()
            .curve(d3.curveBundle.beta(0.85))
            .radius(function(d) { return d.y; })
            .angle(function(d) { return d.x / 180 * Math.PI; });

        var svg = d3.select("#hierarchy").append("svg")
            .attr("width", diameter)
            .attr("height", diameter)
            .append("g")
            .attr("transform", "translate(" + radius + "," + radius + ")");

        var link = svg.append("g").selectAll(".link"),
            node = svg.append("g").selectAll(".node");

        country = document.querySelector('#countrySelector').querySelector('.select__toggle').value
        year = document.querySelector('#yearSelector').querySelector('.select__toggle').value

        d3.json("https://raw.githubusercontent.com/HubashovD/project_comtrade_dashboard/main/data/hierarchy;" + year + country + ".json", function(classes) {
            console.log("https://raw.githubusercontent.com/HubashovD/project_comtrade_dashboard/main/data/hierarchy;" + year + country + ".json")

            // classes.forEach(d => console.log(d))

            var root = packageHierarchy(classes)
                .sum(function(d) { return d.size; });

            cluster(root);

            link = link
                .data(packageImports(root.leaves()))
                .enter().append("path")
                .each(function(d) { d.source = d[0], d.target = d[d.length - 1]; })
                .attr("class", "link")
                .attr("d", line);

            node = node
                .data(root.leaves())
                .enter().append("text")
                .attr("class", "node")
                .attr("dy", "0.31em")
                .attr("transform", function(d) { return "rotate(" + (d.x - 90) + ")translate(" + (d.y + 8) + ",0)" + (d.x < 180 ? "" : "rotate(180)"); })
                .attr("text-anchor", function(d) { return d.x < 180 ? "start" : "end"; })
                .text(function(d) { return d.data.key; });
        });

        // Lazily construct the package hierarchy from class names.
        function packageHierarchy(classes) {
            var map = {};

            function find(name, data) {
                var node = map[name],
                    i;
                if (!node) {
                    node = map[name] = data || { name: name, children: [] };
                    if (name.length) {
                        node.parent = find(name.substring(0, i = name.lastIndexOf(".")));
                        node.parent.children.push(node);
                        node.key = name.substring(i + 1);
                    }
                }
                return node;
            }

            classes.forEach(function(d) {
                find(d.name, d);
            });

            return d3.hierarchy(map[""]);
        }

        // Return a list of imports for the given array of nodes.
        function packageImports(nodes) {
            var map = {},
                imports = [];

            // Compute a map from name to node.
            nodes.forEach(function(d) {
                map[d.data.name] = d;
            });

            // For each import, construct a link from the source to target node.
            nodes.forEach(function(d) {
                if (d.data.imports) d.data.imports.forEach(function(i) {
                    try {
                        // console.log(i)
                        imports.push(map[d.data.name].path(map[i]));
                    } catch {}
                });
            });

            return imports;
        }
    }
    update()

    document.querySelector('#yearSelector').addEventListener('select.change', (e) => {
        const btn = e.target.querySelector('.select__toggle');
        update_bar_chart()
    });
}