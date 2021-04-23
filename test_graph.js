function createLineGraph(csv, div_id) {
    var margin = {top: 10, right: 1, bottom: 30, left: 60},
    width = 1000 - margin.left - margin.right,
    height = 600 - margin.top - margin.bottom;

    // Bisector credit: https://bl.ocks.org/mbostock/3902569
    var bisectDate = d3.bisector(function(d) { return d.date; }).left

    // append the svg object to the body of the page
    var svg = d3.select(div_id)
    .append("svg")
        .attr("width", width + margin.left + margin.right + 200)
        .attr("height", height + margin.top + margin.bottom)
    .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

    function helper(data, is_top_graph) {

        // Add X axis
        var x = d3.scaleTime()
            .domain(d3.extent(data, function(d) { return d.date; }))
            .range([ 0, width ]);
        svg.append("g")
            .attr("transform", "translate(0," + (is_top_graph ? height / 2 : height) + ")")
            .call(d3.axisBottom(x));
    
        // Add Y axis
        var y = d3.scaleLinear()
            .domain([0, d3.max(data, function(d) { return +d.value; })])
            .range([ is_top_graph ? height / 2 : height, is_top_graph ? 0 : height / 2 + 40]);
        svg.append("g")
            .call(d3.axisLeft(y));
    
        // Add the line to chart
        svg.append("path")
            .datum(data)
            .attr("fill", "none")
            .attr("stroke", "steelblue")
            .attr("stroke-width", 1.5)
            .attr("d", d3.line()
            .x(function(d) { return x(d.date) })
            .y(function(d) { return y(d.value) })
            )
        
        // Code from: https://bl.ocks.org/Qizly/8f6ba236b79d9bb03a80
        var focus = svg.append("g")
            .style("display", "none");
        
        focus.append("circle")
            .attr("r", 4.5);
    
        focus.append("rect")
            .attr("fill", "white")
            .attr("stroke", "black")
            .attr("width", 190)
            .attr("height", 50)
            .attr("x", 10)
            .attr("y", -22)
            .attr("rx", 4)
            .attr("ry", 4);
    
        focus.append("text")
            .attr("x", 18)
            .attr("y", -2)
            .attr("font-weight", "bold")
            .text("Week of: ");
    
    
        focus.append("text")
            .attr("class", "tooltip-date")
            .attr("x", 80)
            .attr("y", -2);
    
        focus.append("text")
            .attr("x", 18)
            .attr("y", 18)
            .attr("font-weight", "bold")
            .text("Average daily cases:");
    
        focus.append("text")
            .attr("class", "tooltip-value")
            .attr("x", 160)
            .attr("y", 18)
        
        focus.append("text")
            .attr("x", 9)
            .attr("dy", ".35em");
    
        var line = svg.append("g").append("line")
                .attr("class", "vertical_line")
                .attr('x1', 0)
                .attr('x2', 0)
                .attr('y1', height)
                .attr('y2', -height)
                .style("stroke", "black")
                .style("stroke-width", "1px")
                .style("opacity", "1");
    
        svg.append("rect")
            .attr("fill", "none")
            .attr("width", width)
            .attr("height", height)
            .attr("pointer-events", "all")
            .on("mouseover", function() { 
                focus.style("display", null); 
                line.style("display", null);
            })
            .on("mouseout", function() { 
                focus.style("display", "none"); 
                line.style("display", "none");
            })
            .on("mousemove", mousemove);
        
        var date_format = d3.timeFormat('%Y-%m-%d');
        
        function mousemove() {
            var x0 = x.invert(d3.mouse(this)[0])
            i = bisectDate(data, x0, 1),
            d0 = data[i - 1],
            d1 = data[i],
            d = x0 - d0.date > d1.date - x0 ? d1 : d0;
            focus.attr("transform", "translate(" + x(d.date) + "," + y(d.value) + ")");
            focus.select(".tooltip-date").text(date_format(d.date));
            focus.select(".tooltip-value").text(Math.round(d.value));
            line.attr("transform", "translate(" + x(d.date) + ")")
        }
    
    }


//Read the data
d3.csv(csv, 

  function(d){
    return { date : d3.timeParse("%Y-%m-%d")(d.date), value : d.value}
  },

  function(data) {
      helper(data, true)
      helper(data, false)
  }
)
}

createLineGraph("data/avg_daily_cases_by_week_mia.csv", "#chart1")
//createLineGraph("data/avg_daily_cases_by_week_mia.csv", "#chart2")