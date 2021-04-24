function createLineGraph(csv, csv2, div_id, selection) {
    var margin = {top: 50, right: 1, bottom: 30, left: 50},
    width = 1000 - margin.left - margin.right,
    height = 600 - margin.top - margin.bottom;

    // Bisector credit: https://bl.ocks.org/mbostock/3902569
    var bisectDate = d3.bisector(function(d) { return d.date; }).left

    // append the svg object to the body of the page
    var svg = d3.select(div_id)
    .append("svg")
        .attr("width", width + margin.left + margin.right + 4)
        .attr("height", height + margin.top + margin.bottom)
    .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");



    function helper(data, data2) {

        // Add X axis; use date range for sentiment data
        var x1 = d3.scaleTime()
            .domain(d3.extent(data2, function(d) { return d.date; }))
            .range([ 0, width ]);
        svg.append("g")
            .attr("transform", "translate(0," + (height / 2) + ")")
            .call(d3.axisBottom(x1));

        var x2 = d3.scaleTime()
            .domain(d3.extent(data2, function(d) { return d.date; }))
            .range([ 0, width ]);
        svg.append("g")
            .attr("transform", "translate(0," + (height) + ")")
            .call(d3.axisBottom(x2));
    
        // Add Y axis
        var y1 = d3.scaleLinear()
            .domain([0, d3.max(data, function(d) { return +d.value; })])
            .range([ height / 2, 0]);
        
        var yAxis1 = svg.append("g")
            .call(d3.axisLeft(y1));
        
        var y2 = d3.scaleLinear()
            .domain([.5, .65])
            .range([ height, height / 2 + 40]);

        var yAxis2 = svg.append("g")
            .call(d3.axisLeft(y2));
        
        svg.append("g")
            .call(d3.axisLeft(y2));
    
        // Add the line to chart
        var graph = svg.append("path")
            .datum(data)
            .attr("class", "top-line")
            .attr("fill", "none")
            .attr("stroke", "steelblue")
            .attr("stroke-width", 1.5)
            .attr("d", d3.line()
            .x(function(d) { return x1(d.date) })
            .y(function(d) { return y1(d.value) })
            )
            

        svg.append("path")
            .datum(data2)
            .attr("class", "bottom-line")
            .attr("fill", "none")
            .attr("stroke", "steelblue")
            .attr("stroke-width", 1.5)
            .attr("d", d3.line()
            .x(function(d) { return x2(d.date) })
            .y(function(d) { return y2(d.value) })
            )

        // text label for the x axis
        svg.append("text")             
        .attr("transform",
                "translate(" + (width/2) + " ," + 
                            (height + margin.top + 30) + ")")
        .style("text-anchor", "middle")
        .text("Date");

        // text label for the y axis
        svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left)
        .attr("x",0 - (height / 4 ))
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text("Average daily cases");

        svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left)
        .attr("x",0 - (height * 3 / 4 ))
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text("Average polarity score");

        // Label for Title
        svg.append("text")
        .attr("x", (width / 2))             
        .attr("y", 0 - (margin.top / 2))
        .attr("text-anchor", "middle")  
        .style("font-size", "30px") 
        .style("font-style", "italic")
        .style("text-decoration", "underline")  
        .text("Daily Covid Cases and Sentiment Over Time: " + selection);
        
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
            .attr("ry", 4)
            .attr("overflow", "hidden");
    
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

        // Second text box follows bottom line
        var focus2 = svg.append("g")
            .style("display", "none");
        
        focus2.append("circle")
            .attr("r", 4.5);
    
        focus2.append("rect")
            .attr("fill", "white")
            .attr("stroke", "black")
            .attr("width", 190)
            .attr("height", 50)
            .attr("x", 10)
            .attr("y", -22)
            .attr("rx", 4)
            .attr("ry", 4);
    
        focus2.append("text")
            .attr("x", 18)
            .attr("y", -2)
            .attr("font-weight", "bold")
            .text("Week of: ");
    
    
        focus2.append("text")
            .attr("class", "tooltip-date")
            .attr("x", 80)
            .attr("y", -2);
    
        focus2.append("text")
            .attr("x", 18)
            .attr("y", 18)
            .attr("font-weight", "bold")
            .text("Average sentiment:");
    
        focus2.append("text")
            .attr("class", "tooltip-value")
            .attr("x", 150)
            .attr("y", 18)
        
        focus2.append("text")
            .attr("x", 9)
            .attr("dy", ".35em");
    
        var line = svg.append("g").append("line")
                .attr("class", "vertical_line")
                .attr('x1', 0)
                .attr('x2', 0)
                .attr('y1', height)
                .attr('y2', 0)
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
                focus2.style("display", null);  
                line.style("display", null);
            })
            .on("mouseout", function() { 
                focus.style("display", "none"); 
                focus2.style("display", "none"); 
                line.style("display", "none");
            })
            .on("mousemove", mousemove);
        
        var date_format = d3.timeFormat('%Y-%m-%d');
        
        function mousemove() {
            var x0 = x1.invert(d3.mouse(this)[0])
            console.log(d3.mouse(this))
            i = bisectDate(data, x0, 1),
            d0 = data[i - 1],
            d1 = data[i],
            d = x0 - d0.date > d1.date - x0 ? d1 : d0;
            focus.attr("transform", "translate(" + x1(d.date) + "," + y1(d.value) + ")");
            focus.select(".tooltip-date").text(date_format(d.date));
            focus.select(".tooltip-value").text(Math.round(d.value));

            i = bisectDate(data2, x0, 1),
            d0 = data2[i - 1],
            d1 = data2[i],
            d = x0 - d0.date > d1.date - x0 ? d1 : d0;
            focus2.attr("transform", "translate(" + x2(d.date) + "," + y2(d.value) + ")");
            focus2.select(".tooltip-date").text(date_format(d.date));
            focus2.select(".tooltip-value").text(parseFloat(d.value).toPrecision(4));
            line.attr("transform", "translate(" + x1(d.date) + ")")
        }



    
    }


//Read the data
d3.csv(csv, 

  function(d){
    return { date : d3.timeParse("%Y-%m-%d")(d.date), value: d[selection]}
  },

  function(data1) {
      d3.csv(csv2, 
        function(d){
            return { date : d3.timeParse("%Y-%m-%d")(d.date), value: d[selection]}
          },
          
        function(data2) {
        helper(data1, data2)
      }
      )
  }
)
}

createLineGraph("data/covid_case_data.csv", "data/sentiment_data.csv", "#chart1", "Boston")
createLineGraph("data/covid_case_data.csv", "data/sentiment_data.csv", "#chart2", "New York City")
createLineGraph("data/covid_case_data.csv", "data/sentiment_data.csv", "#chart3", "Chicago")
createLineGraph("data/covid_case_data.csv", "data/sentiment_data.csv", "#chart4", "Miami")