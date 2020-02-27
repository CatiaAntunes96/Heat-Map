document.addEventListener("DOMContentLoaded", () => {
  
  let months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
  let colors = ["#4219E6", "#0063FF", "#008CFF", "#00CAFF", "#C3FCF2", "#F9F871", "#F7C15B", "#FFA700", "#FF6D07", "#D64357", "#DD1717"]
  
  let width = 1400,
  height = 650,
  padding = 80;
  // Define the div for the tooltip
  let tooltip = d3.select("body").append("div")
    .attr("class", "tooltip")
    .attr("id", "tooltip")
    .style("opacity", 0);
  
  //Add svg
  let svg = d3.select(".svg-container").append("svg")
  .attr("width", width)
  .attr("height", height);
  
  //Add color legend
  svg.selectAll("rect")
    .data(colors)
    .enter()
    .append("rect")
    .attr("x", (d, i) => 30 * i + 80)
    .attr("y", 595)
    .attr("width", 30)
    .attr("height", 30)
    .style("fill", color => color)
    .attr("class", "rects");

  const legendX = d3.scaleLinear()
    .domain([2.8, 12.8])
    .range([0, 270]);

  const legendXAxis = d3.axisBottom(legendX)
    .tickSize(10, 0)
    .tickValues([2.8,3.9,5.1,6.1,7.2,8.3,9.5,10.6,11.7,12.8])
    .tickFormat(d3.format(".1f"));

  let legend = svg.append("g")
    .classed("legend", true)
    .call(legendXAxis)
    .attr("transform", "translate(109, 625)")
    

  //Add years legend
  const xLabel = svg.append("text")
    .text("Years")
    .attr("x", width / 2)
    .attr("y", height - 17)
    .attr("class", "subtitle");

  //Add months legend
  const yLabel = svg.append("text")
    .text("Months")
    .attr("x", -350)
    .attr("y", 20)
    .attr("transform", "rotate(-90)")
    .attr("class", "subtitle");

  const symbAdd = value => {
    value = value.toFixed(2).toString().split("");
    if (value[0] != "-") {
      value.unshift("+")
    }
    value = value.join("");
    return value  
  }

  const arrReader = (temp, arr) => {
    switch (true) {
      case temp < 2.8:
        return arr[0];
      case temp < 3.9:
        return arr[1];
      case temp < 5.0:
        return arr[2];
      case temp < 6.1:
        return arr[3];
      case temp < 7.2:
        return arr[4];
      case temp < 8.3:
        return arr[5];
      case temp < 9.5:
        return arr[6];
      case temp < 10.6:
        return arr[7];
      case temp < 11.7:
        return arr[8];
      case temp < 12.8:
        return arr[9];
      case temp >= 12.8:
        return arr[10];
      default:
        return "white";
    }
  };
  
  d3.json("https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json")
  .then(data => {
    
    //Define de text for h2
     let addDescription = d3.select("#description")
    .html(data.monthlyVariance[0].year + " - " + data.monthlyVariance[data.monthlyVariance.length-1].year 
    + ": base temperature " + data.baseTemperature + "ºC")
    
    //Add values for y-axis
    const yScale = d3.scaleLinear()
      .domain([0.5, 12.5])
      .range([padding, height - padding]);

    const yAxis = d3.axisLeft(yScale)
      .tickFormat(d => months[d - 1]);

    svg.append("g")
      .call(yAxis)
      .attr("transform", "translate (" + padding + ",0)")
      .attr("class", "axisValues")
      .attr("id", "y-axis");

    //Define values for x-axis
    const xScale = d3.scaleLinear()
      .domain([d3.min(data.monthlyVariance, item => item.year), d3.max(data.monthlyVariance, item => item.year + 1)])
      .range([padding, width - padding]);

    const xAxis = d3.axisBottom(xScale)
      .tickFormat(d3.format("d"));

    svg.append("g")
      .call(xAxis.ticks(20))
      .attr("transform", "translate (0," + (height - padding) + ")")
      .attr("class", "axisValues")
      .attr("id", "x-axis");


    let yearRange = data.monthlyVariance[data.monthlyVariance.length-1].year - data.monthlyVariance[0].year;
  
    //Add values of variance to chart
    svg.selectAll("rect")
      .data(data.monthlyVariance)
      .enter()
      .append("rect")
      .attr("class", "cell")
      .attr("width", width / yearRange - 1)
      .attr("height", (height - 2 * padding) / 12)
      .attr("data-month", el => el.month - 1)
      .attr("data-year", el => el.year)
      .attr("data-temp", el => el.baseTemperature - el.variance)
      .attr("x", el => xScale(el.year))
      .attr("y", el => yScale(el.month - 0.5))
      .style("fill", el => {
        let temperature = data.baseTemperature + el.variance;
        return arrReader(temperature, colors)
      })
      .on("mouseover", el => {
        tooltip.transition()
          .duration(200)
          .style("opacity", 0.9);
          
        tooltip.html(
            months[el.month - 1] + " - " + el.year + "<br>"
            + (data.baseTemperature + el.variance).toFixed(2) + "ºC <br>"
            + symbAdd(el.variance) + "ºC"
          )
          .style("left", d3.event.pageX - 50 + "px")
          .style("top", d3.event.pageY - 87 + "px");
        tooltip.attr("data-year", el.year);
      })
        
      .on("mouseout", () => {
        tooltip.transition()
          .duration(500)
          .style("opacity", 0);
      });


  })
  
  
})