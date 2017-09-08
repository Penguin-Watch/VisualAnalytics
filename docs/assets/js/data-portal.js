/**
 * Created by eamonnmaguire on 20/01/2017.
 */

var dataPortal = (function () {

    var typeColors = d3.scale.ordinal().domain(["adult", "chick", "other"]).range(["#1abc9c", "#e74c3c", "#f39c12"]);
    var generalColors = d3.scale.ordinal().range(["#2980b9"]);
    var temperatureColors = d3.scale.ordinal().range(["#be1e2d"]);

    var date_format = "%d %b %Y";

    var formatDate = d3.time.format(date_format);

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
            var a = d3.time.format(date_format).parse(a);
            var b = d3.time.format(date_format).parse(b);
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

            var xScale = d3.scale.linear().domain([0, 100]).range([0, 500]);
            var yScale = d3.scale.linear().domain([0, 100]).range([0, 500]);

            var locationGroup = svg.selectAll('g.location')
                .data(locations)
                .enter()
                .append('g')
                .attr('class', 'location')
                .attr('transform', function (d) {
                    return 'translate(' + xScale(d.long) + ',' + yScale(d.lat) + ')';
                });

            var rScale = d3.scale.linear().domain([0, 100]).range([0, 13]);

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

            var formatDateAsYear = d3.time.format("%Y");
            var formatDateAsMonth = d3.time.format("%b");
            var formatDateAsHour = d3.time.format("%H");
            var formatDateAsHourMinute = d3.time.format("%H:%M");

            d3.csv(url, function (data) {

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
                        return d.tempf;
                    }),

                    byMoon = cr_data.dimension(function (d) {
                        return d.moon;
                    }),

                    byAdult = cr_data.dimension(function (d) {
                        return d.nadults;
                    });

                var by_date_count_group = byDate.group(),

                    adult_date_group = byDate.group().reduceSum(function (d) {
                        return +d.nadults;
                    }),
                    temperature_date_group = byDate.group().reduceSum(function (d) {
                        return +d.tempf;
                    }),

                    byHourGroup = byHour.group().reduceSum(function (d) {
                        return +d.nadults;
                    }),

                    byYearGroup = byYear.group().reduceSum(function (d) {
                        return +d.nadults;
                    }),
                    byMonthGroup = byMonth.group().reduceSum(function (d) {
                        return +d.nadults;
                    }),
                    byMoonGroup = byMoon.group().reduceSum(function (d) {
                        return +d.nadults;
                    }),

                    byTemperatureGroup = byTemperature.group().reduceSum(function (d) {
                        return +d.nadults;
                    }),

                    byAdultGroup = byAdult.group();


                var minDate = new Date(byDate.bottom(1)[0].datetime);
                var maxDate = new Date(byDate.top(1)[0].datetime);

                minDate.setDate(minDate.getDate() - 1);
                maxDate.setDate(maxDate.getDate() + 1);

                var rptLine = dc.compositeChart(document.getElementById("overview-vis"));

                var fullWidth = calculate_vis_width(".full-width");
                console.log(fullWidth);

                rptLine
                    .width(fullWidth)
                    .height(250)
                    .dimension(byDate)
                    .x(d3.time.scale().domain([minDate, maxDate]))
                    .xUnits(d3.time.days)
                    .xAxisLabel('Date')
                    .yAxisLabel('# Adult Penguins')
                    .elasticY(true)
                    .renderHorizontalGridLines(true)
                    .renderVerticalGridLines(true)
                    .compose([
                        dc.lineChart(rptLine)
                            .dimension(byDate)
                            .xUnits(d3.time.hours)
                            .group(temperature_date_group, 'Temperature (F)')
                            .colors(temperatureColors),

                        dc.barChart(rptLine)
                            .dimension(byDate)
                            .group(adult_date_group, 'Adult Penguins')
                            .xUnits(d3.time.hours)
                            .colors(generalColors)

                    ]);

                rptLine.legend(dc.legend().x(50).y(20).itemHeight(13).gap(5))
                    .brushOn(true);


                createRowChart("#year-chart", byYear, byYearGroup, generalColors, calculate_vis_width("#year-chart"));
                createRowChart("#month-chart", byMonth, byMonthGroup, generalColors, calculate_vis_width(("#month-chart")));
                createRowChart("#moon-chart", byMoon, byMoonGroup, generalColors, calculate_vis_width("#moon-chart"));


                var hourChartWidth = calculate_vis_width("#hour-chart");
                dc.barChart("#hour-chart")
                    .width(hourChartWidth)
                    .height(250)
                    .dimension(byHour)
                    .group(byHourGroup)
                    .x(d3.scale.linear().domain([0, 23]))
                    .xAxisLabel('Hour of Day')
                    .yAxisLabel('# Penguins')
                    .colors(generalColors);


                dc.barChart("#adults-chart")
                    .width(hourChartWidth)
                    .height(265)
                    .dimension(byAdult)
                    .x(d3.scale.linear().domain([0, 40]))
                    .group(byAdultGroup, 'Adults')
                    .yAxisLabel('Number of Images')
                    .xAxisLabel('# Penguins')
                    .colors(generalColors);


                dc.barChart("#temperature-chart")
                    .width(hourChartWidth)
                    .height(265)
                    .dimension(byTemperature)
                    .x(d3.scale.linear().domain([10, 66]))
                    .group(byTemperatureGroup)
                    .xAxisLabel('Temperature')
                    .yAxisLabel('# Penguins')
                    .colors(temperatureColors);

                var detailTable = dc.dataTable('#image-detail');
                detailTable.dimension(byDate)
                    .group(function (d) {
                        return formatDate(d.datetime);
                    })
                    .columns([
                        function (d) {
                            return '<div class="row-fluid"><div class="col-md-7"> <img src="' + d.stablelink + '" alt="' + d.plid + '" width="100%"></div>' +
                                '<div class="col-md-5">' +
                                '<p class="text-muted"<span>' + formatDateAsHourMinute(d.datetime) + '</span><br/>' +
                                '<span>' + d.tempf + ' F</span><br/>' +
                                '<span>' + d.nadults + ' penguins present</span></p></div></div>' +
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
