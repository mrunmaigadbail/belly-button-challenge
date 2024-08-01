// Build the metadata panel
const url = 'https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json'
function buildMetadata(sample) {
  d3.json(url).then((data) => {

    // get the metadata field
    let metadata = data.metadata;

    // Filter the metadata for the object with the desired sample number
    let demographic_info = metadata.filter(person => person.id == sample)[0];

    // Use d3 to select the panel with id of `#sample-metadata`
    let panel = d3.select('#sample-metadata');

    // Use `.html("") to clear any existing metadata
    panel.html("");

    // Inside a loop, you will need to use d3 to append new
    // tags for each key-value in the filtered metadata.
    for (const [key, value] of Object.entries(demographic_info)) {
    
      panel.append('h6').text(`${key.toUpperCase()}: ${value}`);
    }


  });
}

// function to build both charts
function buildCharts(sample) {
  d3.json(url).then((data) => {

    // Get the samples field
    let sample_data = data.samples;

    // Filter the samples for the object with the desired sample number
    let info = sample_data.filter(person => person.id === sample)[0]

    // Get the otu_ids, otu_labels, and sample_values
    let otu_ids = info.otu_ids;
    let sample_values = info.sample_values;
    let otu_labels = info.otu_labels;



    // Build a Bubble Chart
    let bubble_trace = {
      x: otu_ids,
      y: sample_values,
      mode: 'markers',
      marker: {
        color: otu_ids,
        size: sample_values,
        colorscale: 'Earth'
      },
      text: otu_labels
      };

    


    // Render the Bubble Chart
    let bubble_traces = [bubble_trace];

    let bubble_layout = {
      title: {text: 'Bacteria Cultures per Sample'},
      xaxis: {title: 'OTU ID'},
      yaxis: {title: 'Number of Bacteria'}
    };

    Plotly.newPlot('bubble', bubble_traces, bubble_layout);



    // For the Bar Chart, map the otu_ids to a list of strings for your yticks
    let bar_y = otu_ids.map(person => `OTU: ${person}`);
    
    // Build a Bar Chart
    // Don't forget to slice and reverse the input data appropriately
    let bar_trace = {
      x: sample_values.slice(0, 10).reverse(),
      y: bar_y.slice(0, 10).reverse(),
      type: 'bar',
      color: "blue",
      text: otu_labels.slice(0, 10).reverse(),
      orientation: 'h'
    };



    // Render the Bar Chart
    let bar_traces = [bar_trace];
    let bar_layout = {
      title: {text:'Top 10 Bacteria Cultures Found'},
      xaxis: {title: 'Number of Bacteria'}
    };
    Plotly.newPlot('bar', bar_traces, bar_layout);




  });
}

// Function to run on page load
function init() {
  d3.json(url).then((data) => {

    // Get the names field
    let names = data.names;



    // Use d3 to select the dropdown with id of `#selDataset`
    let dropdown = d3.select('#selDataset');

    // Use the list of sample names to populate the select options
    // Hint: Inside a loop, you will need to use d3 to append a new
    // option for each sample name.

    for (let i = 0; i < names.length; i++){
      let name = names[i];
      dropdown.append('option').text(name);
    }

    // Get the first sample from the list
    let defaultId = names[0];
   
    // Build charts and metadata panel with the first sample
    buildCharts(defaultId);
    buildMetadata(defaultId);

  });
}

// Function for event listener
function optionChanged(newSubID) {
  // Build charts and metadata panel each time a new sample is selected
  buildCharts(newSubID);
  buildMetadata(newSubID);

}

// Initialize the dashboard
init();
