/**
 * Created by eamonnmaguire on 20/01/2017.
 */

var dataPortal = (function () {

    var typeColors = d3.scaleOrdinal().domain(["adult", "chick", "other"]).range(["#1abc9c", "#e74c3c", "#f39c12"]);
    var generalColors = d3.scaleOrdinal().range(["#2980b9"]);
    var temperatureColors = d3.scaleOrdinal().range(["#be1e2d"]);

    var date_format = "%d %b %Y";

    var formatDate = d3.timeFormat(date_format);

    var parseDate = function (d) {
        //2012-12-13 16:00:00
        return new Date(d.substring(0, 4),
            d.substring(5, 7) - 1,
            d.substring(8, 10),
            d.substring(11, 13),
            d.substring(14, 16));
    };

    var sortByDateAscending = function (a, b) {

        if (typeof a === 'string') {
            var a = d3.timeParse(date_format)(a);
            var b = d3.timeParse(date_format)(b);
            return a - b;
        } else {
            return a.datetime - b.datetime;
        }

    };

    var calculate_vis_width = function (containerId) {
        return d3.select(containerId).node().getBoundingClientRect().width;
    };

    var process_data = function (data) {
        data.forEach(function (d, i) {
            d.index = i;

            d.datetime = parseDate(d.datetime);
        });
    };

    var createRowChart = function (placement, dimension, group, colors, width) {
        var chart = dc.rowChart(placement)
            .dimension(dimension)
            .height(250)
            .width(width)
            .group(group)
            .elasticX(true)
            .colors(colors);

        chart.xAxis().ticks(5);
        chart.ordering(function (d) {
            return -d.value;
        });
    };

    var getGroupExtent = function(group, variable) {
        var _min = +group.bottom(1)[0][variable];
        var _max = +group.top(1)[0][variable];

        return [_min, _max];
    }


    return {

        renderTimeSeriesOverMap: function (placement, nLocations, nPoints) {
            var svg = d3.select(placement).append('svg').attr('width', 500).attr('height', 500).append('g');

            var locations = [
                {
                    'name': 'Port Lockroy A',
                    'lat': 25.5,
                    'long': 0.1,
                    'adults': [14, 13, 11, 15, 42, 49, 45, 46, 40, 40, 37, 40, 44, 46, 2, 0, 0, 0, 0, 0, 3, 8, 34, 36, 48, 18, 15, 16, 90, 13],
                    'chicks': [0, 0, 0, 0, 0, 0, 3, 7, 9, 20, 23, 22, 20, 14, 8, 0, 0, 0, 0, 0, 0, 0, 2, 5]
                },
                {
                    'name': 'Port Lockroy B',
                    'lat': 26.6,
                    'long': 0.3,
                    'adults': [14, 13, 11, 15, 42, 49, 45, 46, 40, 40, 37, 35, 2, 1, 2, 0, 0, 0, 0, 0, 3, 8, 34, 36, 48, 18, 15, 16, 90, 13],
                    'chicks': [0, 0, 0, 0, 0, 0, 3, 7, 9, 20, 23, 22, 20, 14, 8, 0, 0, 0, 0, 0, 0, 0, 2, 5]
                },

                {
                    'name': 'Port Lockroy B',
                    'lat': 28.6,
                    'long': 4.3,
                    'adults': [14, 13, 11, 15, 42, 49, 45, 46, 40, 40, 37, 35, 2, 1, 2, 0, 0, 0, 0, 0, 3, 8, 34, 36, 48, 18, 15, 16, 90, 13],
                    'chicks': [0, 0, 0, 0, 0, 0, 3, 7, 9, 20, 23, 22, 20, 14, 8, 0, 0, 0, 0, 0, 0, 0, 2, 5]
                },

                {
                    'name': 'Port Lockroy B',
                    'lat': 31.6,
                    'long': 6.3,
                    'adults': [14, 13, 11, 15, 42, 49, 45, 46, 40, 40, 37, 35, 2, 1, 2, 0, 0, 0, 0, 0, 3, 8, 34, 36, 48, 18, 15, 16, 90, 13],
                    'chicks': [0, 0, 0, 0, 0, 0, 3, 7, 9, 20, 23, 22, 20, 14, 8, 0, 0, 0, 0, 0, 0, 0, 2, 5]
                },

                {
                    'name': 'Port Lockroy B',
                    'lat': 60.6,
                    'long': 92.2,
                    'adults': [14, 13, 11, 15, 42, 49, 45, 46, 40, 40, 37, 35, 2, 1, 2, 0, 0, 0, 0, 0, 3, 8, 34, 36, 48, 18, 15, 16, 34, 8],
                    'chicks': [3, 7, 9, 20, 23, 22, 20, 14, 8, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 5, 13, 14]
                },

                {
                    'name': 'Port Lockroy B',
                    'lat': 50.6,
                    'long': 92.2,
                    'adults': [14, 13, 11, 15, 42, 49, 45, 46, 40, 40, 37, 35, 2, 1, 2, 0, 0, 0, 0, 0, 3, 8, 34, 36, 48, 18, 15, 16, 45, 8],
                    'chicks': [3, 7, 9, 20, 23, 22, 20, 14, 8, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 5, 14]
                },
                {
                    'name': 'Port Lockroy B',
                    'lat': 80.6,
                    'long': 80.2,
                    'adults': [14, 13, 11, 15, 42, 49, 45, 46, 40, 40, 37, 35, 2, 1, 2, 0, 0, 0, 0, 0, 3, 8, 34, 36, 48, 18, 15, 16, 21, 9],
                    'chicks': [3, 7, 9, 20, 23, 22, 20, 14, 8, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 5, 3]
                },
                {
                    'name': 'Port Lockroy B',
                    'lat': 30.6,
                    'long': 3,
                    'adults': [14, 13, 11, 15, 42, 49, 45, 46, 40, 40, 37, 35, 2, 1, 2, 0, 0, 0, 0, 0, 3, 8, 34, 36, 48, 18, 15, 16, 32, 6],
                    'chicks': [0, 0, 0, 0, 0, 0, 3, 7, 9, 20, 23, 22, 20, 14, 8, 0, 0, 0, 0, 0, 0, 0, 2, 5, 16]
                },

                {
                    'name': 'Port Lockroy B',
                    'lat': 30.6,
                    'long': 5,
                    'adults': [14, 13, 11, 15, 42, 49, 45, 46, 40, 40, 37, 35, 2, 1, 2, 0, 0, 0, 0, 0, 3, 8, 34, 36, 48, 18, 15, 16, 34, 12],
                    'chicks': [0, 0, 0, 0, 0, 0, 3, 7, 9, 20, 23, 22, 20, 14, 8, 0, 0, 0, 0, 0, 0, 0, 2, 5, 6]
                },

                {
                    'name': 'Port Lockroy B',
                    'lat': 30.6,
                    'long': 5,
                    'adults': [0, 2, 10, 13, 13, 13, 45, 40, 12, 25, 28, 23, 2, 1, 2, 0, 0, 0, 0, 0, 3, 8, 34, 36, 48, 18, 15, 16, 45, 23],
                    'chicks': [0, 0, 0, 0, 0, 2, 6, 12, 3, 20, 23, 22, 20, 14, 8, 0, 0, 0, 0, 0, 0, 0, 2, 5, 9]
                }
            ];

            var xScale = d3.scaleLinear().domain([0, 100]).range([0, 500]);
            var yScale = d3.scaleLinear().domain([0, 100]).range([0, 500]);

            var locationGroup = svg.selectAll('g.location')
                .data(locations)
                .enter()
                .append('g')
                .attr('class', 'location')
                .attr('transform', function (d) {
                    return 'translate(' + xScale(d.long) + ',' + yScale(d.lat) + ')';
                });

            var rScale = d3.scaleLinear().domain([0, 100]).range([0, 13]);

            var adultIndicator = locationGroup.selectAll('g.adultGroup').data(function (d) {
                return d.adults;
            }).enter().append('circle').attr('r', 0).attr('cx', 10).attr('cy', 10)
                .style('opacity', 0.7)
                .style('fill', '#27aae1');


            adultIndicator.transition()
                .delay(function (d, i) {
                    return i * 600;
                })
                .duration(500)
                .attr('r', function (d) {
                    return rScale(d);
                })
                .transition().duration(1000).attr('r', 0);

            var chickIndicator = locationGroup.selectAll('g.chickGroup').data(function (d) {
                return d.chicks;
            }).enter()
                .append('circle').attr('r', 0).attr('cx', 10).attr('cy', 10)
                .style('opacity', 0.7)
                .style('fill', '#f15a29');

            chickIndicator.transition().delay(function (d, i) {
                return i * 600;
            }).duration(500)
                .attr('r', function (d) {
                    return rScale(d);
                })
                .transition().duration(1000).attr('r', 0);
        },

        render: function (url, options) {


            var formatDateAsYear = d3.timeFormat("%Y");
            var formatDateAsMonth = d3.timeFormat("%b");
            var formatDateAsHour = d3.timeFormat("%H");
            var formatDateAsHourMinute = d3.timeFormat("%H:%M");

            d3.csv(url).then(function (data) {

                process_data(data);

                var cr_data = crossfilter(data),

                    byDate = cr_data.dimension(function (d) {
                        return d.datetime;
                    }),

                    byYear = cr_data.dimension(function (d) {
                        return formatDateAsYear(d.datetime);
                    }),

                    byMonth = cr_data.dimension(function (d) {
                        return formatDateAsMonth(d.datetime);
                    }),

                    byHour = cr_data.dimension(function (d) {
                        return formatDateAsHour(d.datetime);
                    }),

                    byTemperature = cr_data.dimension(function (d) {
                        return +d.tempc;
                    }),

                    adultDistribution = cr_data.dimension(function (d) {
                        return +d.nadults;
                    });

                    chickDistribution = cr_data.dimension(function (d) {
                        return +d.nchicks;
                    });

                    eggDistribution = cr_data.dimension(function (d) {
                        return +d.neggs;
                    });

                    var adultDateGroup = byDate.group().reduceSum(function (d) {
                        return +d.nadults;
                    }),

                    chickDateGroup = byDate.group().reduceSum(function (d) {
                        return +d.nchicks;
                    }),

                    eggDateGroup = byDate.group().reduceSum(function (d) {
                        return +d.neggs;
                    }),

//                    byHourGroup = byHour.group().reduceSum(function (d) {
//                        return +d.nadults;
//                    }),
//
//                    byYearGroup = byYear.group().reduceSum(function (d) {
//                        return +d.nadults + +d.nchicks + +d.neggs;
//                    }),
//
//                    byMonthGroup = byMonth.group().reduceSum(function (d) {
//                        return +d.nadults  + +d.nchicks + +d.neggs;
//                    }),

                    adultTemperatureGroup = byTemperature.group().reduceSum(function (d) {
                        return +d.nadults;
                    }),

                    chickTemperatureGroup = byTemperature.group().reduceSum(function (d) {
                        return +d.nchicks;
                    }),

                    eggTemperatureGroup = byTemperature.group().reduceSum(function (d) {
                        return +d.neggs;
                    }),

                    adultDistributionGroup = adultDistribution.group(),
                    chickDistributionGroup = chickDistribution.group(),
                    eggDistributionGroup = eggDistribution.group();


                var minDate = new Date(byDate.bottom(1)[0].datetime);
                var maxDate = new Date(byDate.top(1)[0].datetime);

                minDate.setDate(minDate.getDate() - 1);
                maxDate.setDate(maxDate.getDate() + 1);


//                createRowChart("#year-chart", byYear, byYearGroup, generalColors, calculate_vis_width("#year-chart"));
//                createRowChart("#month-chart", byMonth, byMonthGroup, generalColors, calculate_vis_width(("#month-chart")));

                console.log(calculate_vis_width("#adults-time"));
                var col6Width = calculate_vis_width(".col-md-6");
                var col3Width = calculate_vis_width(".col-md-3");

                dc.barChart("#adults-time")
                    .width(col6Width)
                    .height(265)
                    .elasticY(true)
                    .dimension(byDate)
                    .x(d3.scaleTime().domain([minDate, maxDate]))
                    .xUnits(d3.timeDays)
                    .group(adultDateGroup, 'Adults')
                    .yAxisLabel('Number of Adults')
                    .xAxisLabel('Date')
                    .colors(generalColors);

                dc.barChart("#adults-distribution")
                    .width(col3Width)
                    .height(265)
                    .elasticY(true)
                    .dimension(adultDistribution)
                    .x(d3.scaleLinear().domain(getGroupExtent(adultDistribution, 'nadults')))
                    .group(adultDistributionGroup, 'Adults')
                    .yAxisLabel('Number of Images')
                    .xAxisLabel('# Adult Penguins')
                    .colors(generalColors);
//
                dc.barChart("#adults-temperature")
                    .width(col3Width)
                    .height(265)
                    .elasticY(true)
                    .dimension(byTemperature)
                    .x(d3.scaleLinear().domain(getGroupExtent(byTemperature, 'tempc')))
                    .group(adultTemperatureGroup)
                    .xAxisLabel('Temperature')
                    .yAxisLabel('# Adults')
                    .colors(temperatureColors);

                //Chicks
                dc.barChart("#chicks-time")
                    .width(col6Width)
                    .height(265)
                    .elasticY(true)
                    .dimension(byDate)
                    .x(d3.scaleTime().domain([minDate, maxDate]))
                    .xUnits(d3.timeDays)
                    .group(chickDateGroup, 'Chicks')
                    .yAxisLabel('Number of Chicks')
                    .xAxisLabel('# Penguin Chicks')
                    .colors(generalColors);

                dc.barChart("#chicks-distribution")
                    .width(col3Width)
                    .height(265)
                    .elasticY(true)
                    .dimension(chickDistribution)
                    .x(d3.scaleLinear().domain(getGroupExtent(chickDistribution, 'nchicks')))
                    .group(chickDistributionGroup, 'Adults')
                    .yAxisLabel('Number of Images')
                    .xAxisLabel('# Penguin Chicks')
                    .colors(generalColors);

                dc.barChart("#chicks-temperature")
                    .width(col3Width)
                    .height(265)
                    .elasticY(true)
                    .dimension(byTemperature)
                    .x(d3.scaleLinear().domain(getGroupExtent(byTemperature, 'tempc')))
                    .group(chickTemperatureGroup)
                    .xAxisLabel('Temperature')
                    .yAxisLabel('Number of Images')
                    .colors(temperatureColors);

                //Eggs
                dc.barChart("#eggs-time")
                    .width(col6Width)
                    .height(265)
                    .elasticY(true)
                    .dimension(byDate)
                    .x(d3.scaleTime().domain([minDate, maxDate]))
                    .xUnits(d3.timeDays)
                    .group(eggDateGroup, 'Eggs')
                    .yAxisLabel('Number of Images')
                    .xAxisLabel('# Penguin Eggs')
                    .colors(generalColors);

                dc.barChart("#eggs-distribution")
                    .width(col3Width)
                    .height(265)
                    .elasticY(true)
                    .dimension(eggDistribution)
                    .x(d3.scaleLinear().domain(getGroupExtent(eggDistribution, 'neggs')))
                    .group(eggDistributionGroup, 'Eggs')
                    .yAxisLabel('Number of Images')
                    .xAxisLabel('# Penguin Eggs')
                    .colors(generalColors);

                dc.barChart("#eggs-temperature")
                    .width(col3Width)
                    .height(265)
                    .elasticY(true)
                    .dimension(byTemperature)
                    .x(d3.scaleLinear().domain(getGroupExtent(byTemperature, 'tempc')))
                    .group(eggTemperatureGroup)
                    .xAxisLabel('Temperature')
                    .yAxisLabel('Number of Images')
                    .colors(temperatureColors);
//                    var hourChartWidth = calculate_vis_width("#hour-chart");
//                dc.barChart("#hour-chart")
//                    .width(hourChartWidth)
//                    .height(250)
//                    .elasticY(true)
//                    .dimension(byHour)
//                    .group(byHourGroup)
//                    .x(d3.scale.linear().domain([0, 23]))
//                    .xAxisLabel('Hour of Day')
//                    .yAxisLabel('# Penguins')
//                    .colors(generalColors);

                var detailTable = dc.dataTable('#image-detail');
                detailTable.dimension(byDate)
                    .section(function (d) {
                        return formatDate(d.datetime);
                    })
                    .columns([
                        function (d) {
                            return '<div class="row-fluid"><div class="col-md-7"> <img src="' + d.URL + '" alt="' + d.imageid + '" width="100%"></div>' +
                                '<div class="col-md-5">' +
                                '<p class="text-muted"<span>' + formatDateAsHourMinute(d.datetime) + '</span><br/>' +
                                '<span>' + d.tempc + ' &#186; Celcius</span><br/>' +
                                '<span>' + d.nadults + ' adults</span><br/>' +
                                '<span>' + d.nchicks + ' chicks</span><br/>' +
                                '<span>' + d.neggs + ' eggs</span></p></div></div>' +
                                '<div class="clearfix"></div> <br/>';
                        }
                    ]).sortBy(function (d) {
                        return d.datetime;
                    })
                    .order(sortByDateAscending);
                dc.renderAll();
            });
        }
    }


})();
