
function buildMetadata(sample) {

  // ##########################################################################
  // @TODO: Complete the following function that builds the metadata panel
  // ##########################################################################

  // Use `d3.json` to fetch the metadata for a sample
    // Use d3 to select the panel with id of `#sample-metadata`
  
  // selecting the number value from Select Sample: dropdown menu
  var selectSample = document.getElementById("selDataset").value;
  // using d3.json to grab metadata from user input url
  d3.json(`/metadata/${selectSample}`).then((sample) => {
    var panelMetaData = document.getElementById("sample-metadata");
    // Use `.html("") to clear any existing metadata
    panelMetaData.innerHTML = '';

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new tags for each key-value in the metadata.
    var panel = d3.select("#sample-metadata");
    Object.entries(sample).forEach(([key, value]) => {
      var h6tag = panel.append("h6");
      h6tag.text(`${key}: ${value}`);
    });
  });

  d3.json(`/metadata/${selectSample}`).then(function(responses) {
    let WFREQ_Value = Object.values(responses)
  
    const level = WFREQ_Value[5];
  
    // Trig to calc meter point
    var degrees = 180 - level*20,
        radius = .5;
    var radians = degrees * Math.PI / 180;
    var x = radius * Math.cos(radians);
    var y = radius * Math.sin(radians);
  
    // Path: may have to change to create a better triangle
    var mainPath = 'M -.0 -0.025 L .0 0.025 L ',
        pathX = String(x),
        space = ' ',
        pathY = String(y),
        pathEnd = ' Z';
    var path = mainPath.concat(pathX,space,pathY,pathEnd);
  
    var data = [{ type: 'scatter',
      x: [0], y:[0],
        marker: {size: 28, color:'850000'},
        showlegend: false,
        name: 'speed',
        text: level,
        hoverinfo: 'text+name'},
      { values: [50/9, 50/9, 50/9, 50/9, 50/9, 50/9, 50/9, 50/9, 50/9, 50],
      rotation: 90,
      text: ['8-9', '7-8', '6-7', '5-6', '4-5', '3-4', '2-3', '1-2', '0-1', ''],
      textinfo: 'text',
      textposition:'inside',      
      marker: {colors:['rgba(0, 105, 11, .5)', 'rgba(10, 120, 22, .5)',
                            'rgba(14, 127, 0, .5)', 'rgba(110, 154, 22, .5)',
                            'rgba(170, 202, 42, .5)', 'rgba(202, 209, 95, .5)',
                            'rgba(210, 206, 145, .5)', 'rgba(232, 226, 202, .5)',
                            'rgba(240, 230, 215, .5)', 'rgba(255, 255, 255, 0)']},
      labels: ['151-180', '121-150', '91-120', '61-90', '31-60', '0-30', ''],
      hoverinfo: 'label',
      hole: .5,
      type: 'pie',
      showlegend: false
    }];
  
    var layout = {
      shapes:[{
          type: 'path',
          path: path,
          fillcolor: '850000',
          line: {
            color: '850000'
          }
        }],
      title: '<b>Belly Button Washing Frequency</b> <br> Scrubs per Week',
      xaxis: {zeroline:false, showticklabels:false,
                showgrid: false, range: [-1, 1]},
      yaxis: {zeroline:false, showticklabels:false,
                showgrid: false, range: [-1, 1]}
    };
  
    var gaugeChart = document.getElementById('gauge');
    Plotly.newPlot(gaugeChart, data, layout, {showSendToCloud:true});
  
  });

}


function buildCharts(sample) {

  // ################################################################
  // @TODO: Use `d3.json` to fetch the sample data for the plots
  // ################################################################

  // selecting the number value from Select Sample: dropdown menu
  var selectSample = document.getElementById("selDataset").value;
  // using d3.json to grab metadata from user input url
  d3.json(`/samples/${selectSample}`).then(function(result) {
    // creating variables to store values needed to plot
    let xValues, markerColors, yValues, markerSize, textValues;
    xValues = result.otu_ids;
    yValues = result.sample_values;
    markerSize = result.sample_values;
    markerColors = result.otu_ids;
    textValues = result.otu_labels;

    // #####################################################
    // @TODO: Build a Bubble Chart using the sample data
    // #####################################################

    // creating a variable to store bubble plot data
    var bubbleData = [{
      x: xValues,
      y: yValues,
      text: textValues,
      mode: 'markers',
      marker: {
        size: markerSize,
        color: markerColors,
      }
    }];

    // creating a variable to store bubble plot layout value
    var bubbleLayout = {
      margin: { t: 0 },
      hovermode: 'closest',
      xaxis: { title: 'OTU ID' }
    };

    // Selecting the section to place the pie plot and using plotly to plot
    var bubbleChart = document.getElementById('bubble');
    Plotly.plot(bubbleChart, bubbleData, bubbleLayout);

    // #######################################################################################################
    // @TODO: Build a Pie Chart
    // HINT: You will need to use slice() to grab the top 10 sample_values, otu_ids, and labels (10 each).
    // #######################################################################################################

    // Defining variables to write a loop to rearrange data from object of arrays to array of objects
    var number_of_items = result.otu_ids.length;
    var number_of_keys = Object.keys(result).length;
    var data_keys = Object.keys(result);
    var data_values = Object.values(result);

    // Creating a new blank array
    var new_array_of_objects = [];

    // Looping through the results to create array of objects
    for(var i = 0; i < number_of_items; i++){
      var current_obj = {};
      for(var j = 0; j < number_of_keys; j++){
        current_obj[data_keys[j]] = data_values[j][i]
      }
      new_array_of_objects.push(current_obj)
    }

    // Sorting the array of objects to get the objects in decending order according sample_values 
    new_array_of_objects.sort(function(a, b) {
      return parseFloat(b.sample_values - a.sample_values);
    });

    // Extracting the top objects
    new_array_of_objects = new_array_of_objects.slice(0, 10);

    // Creating arrays needed for plot using the .map method
    var pieValues, pieLabels, pieHovertext;
    pieValues = new_array_of_objects.map(function(value) {
      return value.sample_values;
    });

    // Creating arrays needed for plot using the .map method with ES6 syntax
    pieLabels = new_array_of_objects.map(label => label.otu_ids);
    pieHovertext = new_array_of_objects.map(hovertext => hovertext.otu_labels);

    // Creating a trace for pie plot
    var tracePie = {
      labels: pieLabels,
      values: pieValues,
      hovertext: pieHovertext,
      type: 'pie'
    };

    var dataPie = [tracePie];

    // Creating a layout for pie plot
    var layoutPie = {
      title: "<b>Top 10 Bacteria Sample</b>"
    };

    // Selecting the section to place the pie plot and using plotly to plot
    var pieChart = document.getElementById('pie');
    Plotly.plot(pieChart, dataPie, layoutPie);
  });
}


function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}


function updateBubbleChart(newBubbleData) {

  var selectSample = document.getElementById("selDataset").value;
  d3.json(`/samples/${selectSample}`).then(function(result) {
    let updatedxValues, updatedmarkerColors, updatedyValues, updatedmarkerSize, updatedtextValues;
    updatedxValues = result.otu_ids;
    updatedyValues = result.sample_values;
    updatedmarkerSize = result.sample_values;
    updatedmarkerColors = result.otu_ids;
    updatedtextValues = result.otu_labels;
    
    var updateBubble = document.getElementById('bubble');
    Plotly.restyle(updateBubble, 'x', [updatedxValues]);
    Plotly.restyle(updateBubble, 'y', [updatedyValues]);
    Plotly.restyle(updateBubble, 'text', [updatedtextValues]);
    Plotly.restyle(updateBubble, 'marker.size', [updatedmarkerSize]);
    Plotly.restyle(updateBubble, 'marker.color', [updatedmarkerColors]);

  });
}

// #################################################
                    // Pie Chart
// #################################################

function updatePieChart(newPieData) {

  var selectSample = document.getElementById("selDataset").value;
  d3.json(`/samples/${selectSample}`).then(function(result) {

    // Defining variables to write a loop to rearrange data from object of arrays to array of objects
    var number_of_pie_items = result.otu_ids.length;
    var number_of_pie_keys = Object.keys(result).length;
    var pie_data_keys = Object.keys(result);
    var pie_data_values = Object.values(result);

    // Creating a new blank array
    var new_pie_array = [];

    // Looping through the results to create array of objects
    for(var i = 0; i < number_of_pie_items; i++){
      var current_obj = {};
      for(var j = 0; j < number_of_pie_keys; j++){
        current_obj[pie_data_keys[j]] = pie_data_values[j][i]
      }
      new_pie_array.push(current_obj)
    }

    // Sorting the array of objects to get the objects in decending order according sample_values 
    new_pie_array.sort(function(a, b) {
      return parseFloat(b.sample_values - a.sample_values);
    });

    // Extracting the top objects
    new_pie_array = new_pie_array.slice(0, 10);

    // Creating arrays needed for plot using the .map method with ES6 syntax
    updatedpieValues = new_pie_array.map(value => value.sample_values);
    updatedpieLabels = new_pie_array.map(label => label.otu_ids);
    updatedpieHovertext = new_pie_array.map(hovertext => hovertext.otu_labels);

    var updatedPie = document.getElementById('pie');
    var updatedPiePlot = {
      labels: [updatedpieLabels],
      values: [updatedpieValues],
      hovertext: [updatedpieHovertext],
      type: 'pie'
    };
    Plotly.restyle(updatedPie, updatedPiePlot);

  });
}


function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  updateBubbleChart(newSample);
  updatePieChart(newSample);
  buildMetadata(newSample);
}


// Initialize the dashboard
init();
