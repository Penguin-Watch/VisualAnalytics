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
            return b - a;
        } else {
            return b.datetime - a.datetime;
        }

    };

    var calculate_vis_width = function (containerId) {
        return d3.select(containerId).node().getBoundingClientRect().width
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
            .height(360)
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
        render: function (url, options) {

            var formatDateAsYear = d3.time.format("%Y");
            var formatDateAsMonth = d3.time.format("%b");

            d3.csv(url, function (data) {

                process_data(data);

                var cr_data = crossfilter(data),

                    by_date = cr_data.dimension(function (d) {
                        return d.datetime;
                    }),

                    byYear = cr_data.dimension(function (d) {
                        return formatDateAsYear(d.datetime);
                    }),

                    byMonth = cr_data.dimension(function (d) {
                        return formatDateAsMonth(d.datetime);
                    }),

                    byMoon = cr_data.dimension(function (d) {
                        return d.moon;
                    });

                var by_date_count_group = by_date.group(),

                    adult_date_group = by_date.group().reduceSum(function (d) {
                        return d.nadults;
                    }),
                    temperature_date_group = by_date.group().reduceSum(function (d) {
                        return +d.tempf;
                    }),

                    byYearGroup = byYear.group(),
                    byMonthGroup = byMonth.group(),
                    byMoonGroup = byMoon.group();


                var minDate = new Date(by_date.bottom(1)[0].datetime);
                var maxDate = new Date(by_date.top(1)[0].datetime);

                minDate.setDate(minDate.getDate() - 1);
                maxDate.setDate(maxDate.getDate() + 1);

                var rptLine = dc.compositeChart(document.getElementById("overview-vis"));

                rptLine
                    .width(1000)
                    .height(250)
                    .dimension(by_date)
                    .x(d3.time.scale().domain([minDate, maxDate]))
                    .xUnits(d3.time.days)
                    .xAxisLabel('Date')
                    .yAxisLabel('# Adult Penguins')
                    .elasticY(true)
                    .renderHorizontalGridLines(true)
                    .renderVerticalGridLines(true)
                    .compose([

                        dc.barChart(rptLine)
                            .dimension(by_date)
                            .group(adult_date_group, 'Adult Penguins')
                            .xUnits(d3.time.month)
                            .colors(generalColors),

                        dc.lineChart(rptLine)
                            .dimension(by_date)
                            .group(temperature_date_group, 'Temperature (F)')
                            .colors(temperatureColors)

                    ]);

                rptLine.legend(dc.legend().x(50).y(20).itemHeight(13).gap(5))
                    .brushOn(true);


                createRowChart("#year-chart", byYear, byYearGroup, generalColors, 500);
                createRowChart("#month-chart", byMonth, byMonthGroup, generalColors, 500);
                createRowChart("#moon-chart", byMoon, byMoonGroup, generalColors, 500);


                var detailTable = dc.dataTable('#image-detail');
                detailTable.dimension(by_date)
                    .group(function (d) {
                        return '<i class="fa fa-calendar"></i> ' + formatDate(d.datetime);
                    })

                    .columns([
                        function () {
                            return ""
                        },
                        function (d) {
                            return d.plid;
                        },

                        function (d) {
                            return '<img src="' + d.stablelink + '" width="100px">';
                        },

                        function (d) {
                            return '<span class="badge badge-success">' + d.tempf + ' F</span>';
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
