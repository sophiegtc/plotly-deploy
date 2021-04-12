/**
 * Helper function to select stock data
 * Returns an array of values
 * @param {array} rows
 * @param {integer} index
 * index 0 - id
 * index 1 - otu_ids
 * index 2 - sample_values
 * index 3 - otu_labels
*/
function unpack(rows, index) {
    return rows.map(function(row) {
      return row[index];
    });
}

// convert int to UTO # format
function int2label(num) {
  return "UTO" + num.toString();
}

  
d3.json("samples.json").then(function(data) {
  var ids = unpack(data.samples, 'id');
  for (var i = 0; i < ids.length; i++) {
    $('#selDataset').append($('<option></option>').val(i).html(ids[i]));
  }


// Grab values from the response json object to build the plots
var metadata =data.metadata;
var sample_values = unpack(data.samples, 'sample_values');
var otu_ids = unpack(data.samples, 'otu_ids');
var otu_labels= unpack(data.samples, 'otu_labels');

//console.log(metadata[0])


// Display the default plots
function init() {
  var initdata = [{
    x: sample_values[0].slice(0, 10).reverse(),
    y: otu_ids[0].slice(0, 10).map(int2label).reverse(),
    type: "bar",
    text: otu_labels[0],
    hovertemplate: '%{text}',
    orientation: 'h',
  }];
  //console.log(sample_values[0])
  //console.log( otu_ids[0])
  //console.log( otu_labels[0])
  
  
  Plotly.newPlot("bar", initdata);

  var trace2 = {
    x: otu_ids[0],
    y: sample_values[0],
    mode: 'markers',
    text: otu_labels[0],
    marker: {
    color: otu_ids[0],
    size: sample_values[0]
    }
  };
  var bubbledata = [trace2];

  var layout = {
    title: "bubble chart",
    xaxis: { title: "OTU ID" },
  }
  Plotly.newPlot("bubble", bubbledata, layout);
  
  
  $('#sample-metadata').append('id: ' + data.metadata[0]["id"] + '</br>' + 
        'ethnicity: ' + data.metadata[0]["ethnicity"] + '</br>' + 
        'gender: ' + data.metadata[0]["gender"] + '</br>' + 
        'age: ' + data.metadata[0]["age"] + '</br>' + 
        'location: ' + data.metadata[0]["location"] + '</br>' + 
        'bbtype: ' + data.metadata[0]["bbtype"] + '</br>' + 
        'wfreq: ' + data.metadata[0]["wfreq"]);
}



// On change to the DOM, call getData()
d3.selectAll("#selDataset").on("change", getData);

// Function called by DOM changes
function getData() {
  var dropdownMenu = d3.select("#selDataset");
  // Assign the value of the dropdown menu option to a variable
  var dataset = dropdownMenu.property("value");

  //console.log(sample_values[dataset].slice(0, 10).reverse());

  var newdata = [{
    x: sample_values[dataset].slice(0, 10).reverse(),
    y: otu_ids[dataset].slice(0, 10).map(int2label).reverse(),
    type: "bar",
    text: otu_labels[dataset],
    hovertemplate: '%{text}',
    orientation: 'h',
  }];

  // Update the restyled plot's values
  Plotly.restyle("bar", "x", [sample_values[dataset].slice(0, 10).reverse()]);
  Plotly.restyle("bar", "y", [otu_ids[dataset].slice(0, 10).map(int2label).reverse()]);
  
  var update = {
    'marker.color': [otu_ids[dataset]],
    'marker.size': [sample_values[dataset]]
  };
  Plotly.restyle("bubble", "x", [otu_ids[dataset]]);
  Plotly.restyle("bubble", "y", [sample_values[dataset]]);
  Plotly.restyle("bubble", update);

  //Display each key-value pair from the metadata JSON object
  $('#sample-metadata').text("");
  $('#sample-metadata').append('id: ' + data.metadata[dataset]["id"] + '</br>' + 
        'ethnicity: ' + data.metadata[dataset]["ethnicity"] + '</br>' + 
        'gender: ' + data.metadata[dataset]["gender"] + '</br>' + 
        'age: ' + data.metadata[dataset]["age"] + '</br>' + 
        'location: ' + data.metadata[dataset]["location"] + '</br>' + 
        'bbtype: ' + data.metadata[dataset]["bbtype"] + '</br>' + 
        'wfreq: ' + data.metadata[dataset]["wfreq"]);
  

  

};
init();

});

// We want our chart to take up 50% of the circle
// Divide the 50% into 9 equal segments

var gaugedata = [
  {
    type: "indicator",
    mode: "gauge+needle",
    gauge: {
      axis: { range: [null, 540], tickwidth: 1, tickcolor: "darkblue" },
      bgcolor: "white",
      borderwidth: 2,
      bordercolor: "gray",
      steps: [
        { range: [0, 60], color: "navy" },
        { range: [60, 120], color: "blue" },
        { range: [120, 180], color: "steelblue" },
        { range: [180, 240], color: "maroon" },
        { range: [240, 300], color: "sandybrown" },
        { range: [300, 360], color: "wheat" },
        { range: [360, 420], color: "lightyellow" },
        { range: [420, 480], color: "indigo" },
        { range: [480, 540], color: "blueviolet" }
      ],
     
    }
  }
];

var layout = {
  width: 500,
  height: 400,
  margin: { t: 25, r: 25, l: 25, b: 25 },
  paper_bgcolor: "lavender",
  font: { color: "darkblue", family: "Arial" }
};

Plotly.newPlot('gauge', gaugedata, layout);
  
    
    
    
    
   