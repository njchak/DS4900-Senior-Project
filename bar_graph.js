//From: https://www.d3-graph-gallery.com/graph/line_select.html
// set the dimensions and margins of the graph
var margin = {top: 10, right: 100, bottom: 30, left: 60},
    width = 500 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg = d3.select("#bar_chart")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

//Read the data
d3.csv("data/bar_graph_data/sentiment_title_counts.csv", function(data) {

    data.forEach(function(d) {
        d.Sentiment = d.Sentiment;
        d.value = parseInt(d.Boston);
    });
    // List of groups (here I have one group per column)
    var allGroup = ["Boston", "Chicago", "New York City", "Miami"]

    // add the options to the button
    d3.select("#selectButton")
      .selectAll('myOptions')
     	.data(allGroup)
      .enter()
    	.append('option')
      .text(function (d) { return d; }) // text showed in the menu
      .attr("value", function (d) { return d; }) // corresponding value returned by the button


    // Add X axis --> it is a date format
    var x = d3.scaleBand()
      .domain(data.map(function(d) { return d.Sentiment; }))
      .range([ 0, width ])
      .paddingInner(0.2)
      .paddingOuter(0.2);
    svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));

    // Add Y axis
    var y = d3.scaleLinear()
    .domain([0, d3.max(data, function(d) { return d.value; })])
      .range([ height, 0 ]);

    var yAxis = svg.append("g")
      .call(d3.axisLeft(y));


    svg.selectAll(".bar")
      .data(data)
    .enter().append("rect")
      .style("fill", "steelblue")
      .attr("class", "bar")
      .attr("x", function(d) {  return x(d.Sentiment)})
      .attr("y", function(d) { return y(d.value); })
      .attr("width", function(d) { return x.bandwidth(); })
      .attr("height", function(d) { return height - y(d.value); });

    // A function that update the chart
    function update(selectedGroup) {

      // Create new data with the selection
      var dataFilter = data.map(function(d){return {Sentiment: d.Sentiment, value:parseInt(d[selectedGroup])} })
        
      // Update
      y.domain([0, d3.max(dataFilter, function(d) { return d.value; })])
      yAxis.transition().duration(500).call(d3.axisLeft(y));
      // Give these new data to update line
      svg.selectAll(".bar").data(dataFilter)
          .transition()
          .duration(500)
          .attr("y", function(d) {return y(d.value); })
          .attr("height", function(d) { return height - y(d.value); });
    }

    // When the button is changed, run the updateChart function
    d3.select("#selectButton").on("change", function(d) {
        // recover the option that has been chosen
        var selectedOption = d3.select(this).property("value")
        // run the updateChart function with this selected option
        update(selectedOption)
    })

})