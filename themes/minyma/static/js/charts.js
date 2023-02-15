$(document).ready(function() {
    var items;
    $.getJSON('../json/allocation_pie.json', (data) => {
        items = data.items
        console.log(items)
    })

    var jsonfile = {
        "jsonarray": [
            {
                "Name": "Equities",
                "Size": 0.1
            },
            {
                "Name": "Bonds",
                "Size": 0.05
            },
            {
                "Name": "ETFs",
                "Size": 0.05
            },
            {
                "Name": "Equity Algorithms",
                "Size": 0.2
            },
            {
                "Name": "Cryptocurrency Algorithms",
                "Size": 0.4
            },
            {
                "Name": "Commodity Algorithms",
                "Size": 0.1
            }
        ]
    };

    var labels = jsonfile.jsonarray.map(function (e) {
        console.log(e.Name);
        return e.Name;
    });
    var data = jsonfile.jsonarray.map(function (e) {
        return e.Size;
    });

    var ctx = $('#myChart')

    Chart.Tooltip.positioners.cursor = function (chartElements, coordinates) {
        return coordinates;
    };

    var config = {
        type: 'pie',
        data: {
            labels: labels,
            datasets: [{
                label: 'Allocation',
                data: data,
                backgroundColor: [
                    '#3B82F6',
                    '#10B981',
                    '#EF4444',
                    '#FCD34D',
                    '#8B5CF6',
                    '#EC4899'
                ],
            }]
        },
        options: {
            animation: false,
            plugins: {
                tooltip: {
                    mode: 'index',
                    animation: false,
                    position: 'average',
                    // position: 'cursor',
                    backgroundColor: '#000',
                    usePointStyle: true,
                }
            }
        }
    };

    var chart = new Chart(ctx, config);
});