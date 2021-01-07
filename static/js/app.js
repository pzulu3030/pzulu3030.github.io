// Functions for events
function getDemoInfo(id_number) {
  // Search jason file for input names value
  // console.log(id);
  d3.json("samples.json").then((data) => {
    metadata = data.metadata;
    // console.log(metadata);
    result = metadata.filter((meta) => meta.id.toString() === id_number)[0];

    // result1 = metadata.filter((meta) => meta.id.toString() === id_number);
    // console.log(result1);
    let wfreq = result.wfreq;
    buildGauge(wfreq);

    let demographicInfo = d3.select("#sample-metadata");
    demographicInfo.html("");
    // to display list of values for subject id
    Object.entries(result).forEach((key) => {
      demographicInfo.append("h5").text(key[0] + ": " + key[1] + "\n");
    });
  });
}
function optionChanged(id) {
  getDemoInfo(id);
  plotCharts(id);
}
function plotCharts(id_number) {
  d3.json("samples.json").then((data) => {
    // console.log(data);
    sampledata = data.samples;
    result = sampledata.filter((meta) => meta.id.toString() === id_number)[0];
    // console.log(result);

    let sampleValues = result.sample_values.slice(0, 10).reverse();
    // console.log(sampleValues);
    let labels = result.otu_labels.slice(0, 10);
    // console.log(labels);
    let top10_otu = result.otu_ids.slice(0, 10).reverse();
    // console.log(top10_otu);
    let otu_id = top10_otu.map((d) => "OTU " + d);
    // console.log(data.samples[0].otu_ids);
    let trace = {
      x: sampleValues,
      y: otu_id,
      text: labels,
      marker: {
        color: "blue",
      },
      type: "bar",
      orientation: "h",
    };

    data = [trace];
    let layout = {
      // title: " Top 10 OTU",
      yaxis: {
        tickmode: "linear",
      },
      margin: {
        l: 120,
        r: 100,
        t: 0,
        b: 0,
      },
    };
    Plotly.newPlot("bar", data, layout);
    // Create bubble chart
    let trace1 = {
      x: result.otu_ids,
      y: result.sample_values,
      mode: "markers",
      marker: {
        size: result.sample_values,
        color: result.otu_ids,
      },
      text: labels,
    };
    let layout2 = {
      xaxis: { title: "OTU ID" },
      // height: 500,
      // width: 1000,
    };
    let data1 = [trace1];
    Plotly.newPlot("bubble", data1, layout2);
  });
}

function buildGauge(wfreq) {
  // pie chart converted to gauge chart
  console.log("Call for buildGauge");
  let traceGauge = {
    type: "pie",
    showlegend: false,
    hole: 0.4,
    rotation: 90,
    values: [
      180 / 9,
      180 / 9,
      180 / 9,
      180 / 9,
      180 / 9,
      180 / 9,
      180 / 9,
      180 / 9,
      180 / 9,
      180,
    ],
    text: ["0-1", "1-2", "2-3", "3-4", "4-5", "5-6", "6-7", "7-8", "8-9"],
    direction: "clockwise",
    textinfo: "text",
    textposition: "inside",
    marker: {
      colors: [
        "#F8F3EC",
        "#F4F1E5",
        "#E9E6CA",
        "#E2E4B1",
        "#D5E49D",
        "#B7CC92",
        "#8CBF88",
        "#8ABB8F",
        "#85B48A",
        "white",
      ],
      labels: [
        "0-1",
        "1-2",
        "2-3",
        "3-4",
        "4-5",
        "5-6",
        "6-7",
        "7-8",
        "8-9",
        "",
      ],
      hoverinfo: "label",
    },
    hoverinfo: "skip",
  };

  // the dot where the needle "originates"
  let dot = {
    type: "scatter",
    x: [0],
    y: [0],
    marker: {
      size: 12,
      color: "#850000",
    },
    showlegend: false,
    hoverinfo: "skip",
  };

  // the needle (triangular version)

  // add weights to the degrees to correct needle
  let weight = 0;
  if (wfreq == 2 || wfreq == 3) {
    weight = 3;
  } else if (wfreq == 4) {
    weight = 1;
  } else if (wfreq == 5) {
    weight = -0.5;
  } else if (wfreq == 6) {
    weight = -2;
  } else if (wfreq == 7) {
    weight = -3;
  }

  let degrees = 180 - (20 * wfreq + weight); // 20 degrees for each of the 9 gauge sections
  // console.log(degrees);
  let radius = 0.4;
  let radians = (degrees * Math.PI) / 180;
  // console.log(`radian is :${radians}`);
  let aX = 0.025 * Math.cos((radians * Math.PI) / 180);
  // console.log(aX);
  let aY = 0.025 * Math.sin((radians * Math.PI) / 180);
  let bX = -0.025 * Math.cos((radians * Math.PI) / 180);
  let bY = -0.025 * Math.sin((radians * Math.PI) / 180);
  let cX = radius * Math.cos(radians);
  let cY = radius * Math.sin(radians);

  // draw the triangle
  let path =
    "M " + aX + " " + aY + " L " + bX + " " + bY + " L " + cX + " " + cY + " Z";
  console.log(path);
  let gaugeLayout = {
    title: "<b>Belly Button Washing Frequency</b><br>Scrubs per Week",
    xaxis: {
      zeroline: false,
      showticklabels: false,
      showgrid: false,
      range: [-1, 1],
      fixedrange: true,
    },
    yaxis: {
      zeroline: false,
      showticklabels: false,
      showgrid: false,
      range: [-1, 1],
      fixedrange: true,
    },
    shapes: [
      {
        type: "path",
        path: path,
        fillcolor: "#850000",
        line: {
          color: "red",
        },
      },
    ],
  };

  Plotly.newPlot("gauge", [traceGauge, dot], gaugeLayout);
}

//Initialize the display page
function init() {
  let dropdown = d3.select("#selDataset");
  d3.json("samples.json").then((data) => {
    data.names.forEach(function (name) {
      dropdown.append("option").text(name).property("value");
    });
    // display the data and the plots on the page
    // display demographic data
    getDemoInfo(data.names[0]);
    id = data.names[0];
    //display plot
    plotCharts(id);
  });
}

init();
