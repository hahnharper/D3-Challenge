var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 60,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
var svg = d3.select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

d3.select(".chart").append("div").attr("class", "tooltip").style("opacity", 0);

// Import Data
d3.csv("data.csv", function(err, healthData) {
  if (err) throw err;
      // Step 1: Parse Data/Cast as numbers
   // ==============================
    healthData.forEach(function(data) {
    data.poverty = +data.poverty;
    data.healthcare = +data.healthcare;
  });
console.log(healthData)



  // Step 2: Create scale functions
  // ==============================
  var yLinearScale = d3.scaleLinear().range([height, 0]);
  var xLinearScale = d3.scaleLinear().range([0, width]);

  // Step 3: Create axis functions
  // ==============================
  var bottomAxis = d3.axisBottom(xLinearScale);
  var leftAxis = d3.axisLeft(yLinearScale);

//   Scale domain
  var xMin;
  var xMax;
  var yMin;
  var yMax;
  
  xMin = d3.min(healthData, function(data) {
      return data.poverty * 0.95;
  });
  
  xMax = d3.max(healthData, function(data) {
      return data.poverty * 1.05;
  });
  
  yMin = d3.min(healthData, function(data) {
      return data.healthcare * 0.98;
  });
  
  yMax = d3.max(healthData, function(data) {
      return data.healthcare * 1.02;
  });
  
  xLinearScale.domain([xMin, xMax]);
  yLinearScale.domain([yMin, yMax]);
  console.log(xMin);
  console.log(yMax);


  //  Step 5: Create Circles
  // ==============================
var circleGroup = chartGroup.selectAll("circle")
  .data(healthData)
  .enter()
  .append("circle")
  .attr("cx", d => xLinearScale(d.poverty))
  .attr("cy", d => yLinearScale(d.healthcare))
  .attr("r", "12")
  .attr("fill", "lightblue")
  .attr("opacity", 1)



// Step 6: Initialize tool tip
  // ==============================
  var toolTip = d3.tip()
    .attr("class", "tooltip")
    .offset([80, -60])
    .html(function(d) {
      return (`${d.state}<br> In Poverty: ${d.poverty} % <br> Lacks Healthcare: ${d.healthcare} %`);
      });

// Step 7: Create tooltip in the chart
  // ==============================
  circleGroup.call(toolTip)

//   Display
    .on("mouseover", function(data){
        toolTip.show(data);
    })

// Hide
    .on("mouseout", function(data) {
    toolTip.hide(data);
  });
  
  // Create axes labels
  
  chartGroup.append("text")
  .style("text-anchor", "middle")
  .style("font-size", "12px")
  .selectAll("tspan")
  .data(healthData)
  .enter()
  .append("tspan")
      .attr("x", function(data) {
          return xLinearScale(data.poverty - 0);
      })
      .attr("y", function(data) {
          return yLinearScale(data.healthcare - 0.2);
      })
      .text(function(data) {
          return data.abbr
      });

  // Step 4: Append Axes to the chart
  // ==============================
  chartGroup.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);

  chartGroup.append("g")
    .call(leftAxis);

  chartGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left + 40)
    .attr("x", 0 - (height / 2))
    .attr("dy", "1em")
    .attr("class", "axisText")
    .text("Lacks Healthcare (%)");

  chartGroup.append("text")
    .attr("transform", `translate(${width / 2}, ${height + margin.top + 7})`)
    .attr("x", 0)
    .attr("y", 20)
    .attr("class", "axisText")
    .text("In Poverty (%)");
});





  