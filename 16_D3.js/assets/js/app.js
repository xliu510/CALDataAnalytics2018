//define svg width and height
var svgWidth = 950;
var svgHeight = 650;

//set margin size
var margin = {
  top: 50,
  right: 50,
  bottom: 100,
  left: 100
};

//set chartgroup width
var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
var svg = d3
  .select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);


// Append an SVG group
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Initial Params
var chosenXAxis = "poverty";
var chosenYAxis = "obesity";

// function used for updating x-scale var upon click on axis label
function xScale(healthData, chosenXAxis) {
    // create x scales
    var xLinearScale = d3.scaleLinear()
      .domain([d3.min(healthData, d => d[chosenXAxis]) * 0.8,
        d3.max(healthData, d => d[chosenXAxis]) * 1.2
      ])
      .range([0, width]);
  
    return xLinearScale;
  
  }

function yScale(healthData, chosenYaxis) {
    // create y scales
    var yLinearScale = d3.scaleLinear()
      .domain([0, d3.max(healthData, d => d[chosenYaxis])])
      .range([height, 0]);

    return yLinearScale;
  
  }
  
// function used for updating xAxis var upon click on axis label
function renderAxes(newXScale, xAxis) {
  var bottomAxis = d3.axisBottom(newXScale);

  xAxis.transition()
    .duration(1000)
    .call(bottomAxis);
  
  return xAxis;
}

function renderYAxis(newYScale, yAxis) {
  var leftAxis = d3.axisLeft(newYScale);

  yAxis.transition()
    .duration(1000)
    .call(leftAxis);

  return yAxis;
}
  
// function used for updating circles group with a transition to new circles
function renderCircles(circlesGroup, newXScale, newYScale, chosenXaxis, chosenYaxis) {

  circlesGroup.transition()
    .duration(1000)
    .attr("cx", d => newXScale(d[chosenXaxis]))
    .attr("cy", d => newYScale(d[chosenYaxis]))

  return circlesGroup;
}

function stateAbbrText(stateAbbrTextTextGroup, newXScale, newYScale, chosenXaxis, chosenYaxis) {

  stateAbbrTextTextGroup.transition()
    .duration(1000)
    .attr("x", d => newXScale(d[chosenXaxis]))
    .attr("y", d => newYScale(d[chosenYaxis]));

  return stateAbbrTextTextGroup;
}
  
// function used for updating circles group with new tooltip
function updateToolTip(chosenXAxis, circlesGroup) {

    if (chosenXAxis === "poverty") {
      var label = "Poverty:";
    }
    else if (chosenXAxis === "age") {
      var label = "Age:";
    }
    else {
      var label = "Income:"
    }

    if (chosenYAxis === "obesity") {
        var ylabel = "Obesity:";
      }
      else if (chosenYAxis === "smokes") {
        var ylabel = "Smokes:";
      }
      else {
        var ylabel = "Healthcare:"
      }
  
    var toolTip = d3.tip()
      .attr('class', 'd3-tip')
      .offset([80, -60])
      .html(function(d) {
        if (chosenXAxis === "poverty") {
          return (`${d.state} <br> ${label} ${d[chosenXAxis]}% <br> ${ylabel} ${d.obesity}%`);
        }
        else if (chosenXAxis === "age") {
          return (`${d.state} <br> ${label} ${d[chosenXAxis]} <br> ${ylabel} ${d.obesity}%`);
        }
        else {
          return (`${d.state} <br> ${label} $${d[chosenXAxis]} <br> ${ylabel} ${d.obesity}%`);
        }
      });
  
    circlesGroup.call(toolTip);
  
    circlesGroup.on("mouseover", function(data) {
      toolTip.show(data);
    })
      // onmouseout event
      .on("mouseout", function(data, index) {
        toolTip.hide(data);
      });
  
    return circlesGroup;
  }
  

// Retrieve data from the CSV file and execute everything below
d3.csv("assets/data/data.csv", function(err, healthData) {
    
    if (err) throw err;

    // parse data
    healthData.forEach(function(data) {
      data.poverty = +data.poverty;
      data.age = +data.age;
      data.income = +data.income;
      data.healthcare = +data.healthcare;
      data.smokes = +data.smokes;
      data.obesity = +data.obesity;
    });
  
    // xLinearScale function above csv import
    var xLinearScale = xScale(healthData, chosenXAxis);
  
    // Create y scale function
    var yLinearScale = yScale(healthData, chosenYAxis);
  
    // Create initial axis functions
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);
  
    // append x axis
    var xAxis = chartGroup.append("g")
      .classed("x-axis", true)
      .attr("transform", `translate(0, ${height})`)
      .call(bottomAxis);
  
    // append y axis
    var yAxis = chartGroup.append("g")
      .classed("y-axis", true)
      .call(leftAxis);
  
    // append initial circles
    var circlesGroup = chartGroup.selectAll("circle")
      .data(healthData)
      .enter()
      .append("circle")
      .attr("cx", d => xLinearScale(d[chosenXAxis]))
      .attr("cy", d => yLinearScale(d[chosenYAxis]))
      .attr("r", 13)
      .attr("fill", "#39a1ee")
      .attr("opacity", ".5");

    // append text to circle
    var stateAbbrTextTextGroup = chartGroup.selectAll()
      .data(healthData)
      .enter()
      .append("text")
      .attr("x", d => xLinearScale(d[chosenXAxis]))
      .attr("y", d => yLinearScale(d[chosenYAxis]))
      .style("font-size", "10px")
      .style("text-anchor", "middle")
      .style('fill', 'white')
      .text(d => (d.abbr));
  
    // Create group for 3 x-axis labels
    var xlabelsGroup = chartGroup.append("g")
      .attr("transform", `translate(${width / 2}, ${height + 20})`);
  
    var xPovertyLabel = xlabelsGroup.append("text")
      .attr("x", 0)
      .attr("y", 20)
      .attr("value", "poverty") // value to grab for event listener
      .classed("active", true)
      .text("In Poverty (%)");
  
    var xAgeLabel = xlabelsGroup.append("text")
      .attr("x", 0)
      .attr("y", 40)
      .attr("value", "age") // value to grab for event listener
      .classed("inactive", true)
      .text("Age (Median)");

    var xIncomeLabel = xlabelsGroup.append("text")
      .attr("x", 0)
      .attr("y", 60)
      .attr("value", "income") // value to grab for event listener
      .classed("inactive", true)
      .text("Household Income (Median)");
  

    // Create group for 3 y-axis labels
    var ylabelsGroup = chartGroup.append("g")
      .attr("transform", `translate(0, ${height / 2})`);

    var yHealthcareLabel = ylabelsGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", -40)
      .attr("x", 0)
      .attr("value", "healthcare")
      .classed("inactive", true)
      .text("Lacks Healthcare (%)");

    var ySmokesLabel = ylabelsGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", -60)
      .attr("x", 0)
      .attr("value", "smokes")
      .classed("inactive", true)
      .text("Smokes (%)");

    var yObesityLabel = ylabelsGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", -80)
      .attr("x", 0)
      .attr("value", "obesity")
      .classed("active", true)
      .text("Obesity (%)");
  
    // updateToolTip function above csv import
    var circlesGroup = updateToolTip(chosenXAxis, circlesGroup);
  
    // x axis labels event listener
    xlabelsGroup.selectAll("text")
      .on("click", function() {
        // get value of selection
        var value = d3.select(this).attr("value");
        if (value !== chosenXAxis) {
  
          // replaces chosenXAxis with value
          chosenXAxis = value;

          // functions here found above csv import and updates x scale for new data
          xLinearScale = xScale(healthData, chosenXAxis);
          yLinearScale = yScale(healthData, chosenYAxis);
  
          // updates x axis with transition
          xAxis = renderAxes(xLinearScale, xAxis);
          yAxis = renderYAxis(yLinearScale, yAxis);  
  
          // updates circles with new x values
          circlesGroup = renderCircles(circlesGroup, xLinearScale, yLinearScale, chosenXAxis, chosenYAxis);
  
          // updates tooltips with new info
          circlesGroup = updateToolTip(chosenXAxis, circlesGroup);

          // update text for circle with new x values
          stateAbbrTextTextGroup = stateAbbrText(stateAbbrTextTextGroup, xLinearScale, yLinearScale, chosenXAxis, chosenYAxis);
  
          // changes classes to change bold text
          if (chosenXAxis === "poverty") {
            xPovertyLabel
              .classed("active", true)
              .classed("inactive", false);
            xAgeLabel
              .classed("active", false)
              .classed("inactive", true);
            xIncomeLabel
              .classed("active", false)
              .classed("inactive", true);
          } else if (chosenXAxis === "income"){
            xPovertyLabel
              .classed("active", false)
              .classed("inactive", true);
            xAgeLabel
              .classed("active", false)
              .classed("inactive", true);
            xIncomeLabel
              .classed("active", true)
              .classed("inactive", false);
          } else if (chosenXAxis === "age") {
            xPovertyLabel
              .classed("active", false)
              .classed("inactive", true);
            xAgeLabel
              .classed("active", true)
              .classed("inactive", false);
            xIncomeLabel
              .classed("active", false)
              .classed("inactive", true);
          }
        }
      });

    // y axis labels event listener
    ylabelsGroup.selectAll("text")
      .on("click", function() {
        // get value of selection
        var value = d3.select(this).attr("value");
        if (value !== chosenYAxis) {
  
          // replaces chosenYAxis with value
          chosenYAxis = value;
  
          // functions here found above csv import and updates x scale for new data
          xLinearScale = xScale(healthData, chosenXAxis);
          yLinearScale = yScale(healthData, chosenYAxis);
  
          // updates y axis with transition
          xAxis = renderAxes(xLinearScale, xAxis);
          yAxis = renderYAxis(yLinearScale, yAxis);  
  
          // updates circles with new y values
          circlesGroup = renderCircles(circlesGroup, xLinearScale, yLinearScale, chosenXAxis, chosenYAxis);
  
          // updates tooltips with new info
          circlesGroup = updateToolTip(chosenXAxis, circlesGroup);

          // update text for circle with new y values
          stateAbbrTextTextGroup = stateAbbrText(stateAbbrTextTextGroup, xLinearScale, yLinearScale, chosenXAxis, chosenYAxis);
  
          // changes classes to change bold text
          if (chosenYAxis === "healthcare") {
            yHealthcareLabel
              .classed("active", true)
              .classed("inactive", false);
            ySmokesLabel
              .classed("active", false)
              .classed("inactive", true);
            yObesityLabel
              .classed("active", false)
              .classed("inactive", true);
          } else if (chosenYAxis === "smokes"){
            yHealthcareLabel
              .classed("active", false)
              .classed("inactive", true);
            ySmokesLabel
              .classed("active", true)
              .classed("inactive", false);
            yObesityLabel
              .classed("active", false)
              .classed("inactive", true);
          } else if (chosenYAxis === "obesity") {
            yHealthcareLabel
              .classed("active", false)
              .classed("inactive", true);
            ySmokesLabel
              .classed("active", false)
              .classed("inactive", true);
            yObesityLabel
              .classed("active", true)
              .classed("inactive", false);
          }
        }
      });
  });
  
