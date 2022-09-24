import {
    viz as table
} from "@redsift/dc-js-sortable-table"
v = viz(
    "dc-table-graph", [{
            label: "True Label",
            field: "true_label"
        }, {
            field: "max_conf",
            descending: true
        },
        "misclassified"
    ],
    15,
    d => console.log(d)
)