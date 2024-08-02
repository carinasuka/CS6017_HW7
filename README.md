# Pet Adoption Data Visualization

This project visualizes pet adoption data using D3.js. It includes interactive bar and line charts to display the average adoption fees and average age of pets by type.

## Data Source

The data source is from: [Kaggle - Predict Pet Adoption Status Dataset](https://www.kaggle.com/datasets/rabieelkharoua/predict-pet-adoption-status-dataset?resource=download).

## Implementation Details

### Including D3 Library

In the HTML file, the D3 library is included by adding the script:
```html
<script src="https://d3js.org/d3.v6.min.js"></script>
```

### Creating SVG Containers

Two SVG containers are created using JavaScript code for drawing a bar chart and a line chart, respectively.

### Loading and Processing Data

D3's API is used to load the CSV data, process it, and pass it to the chart creation functions.

### Enhancing Interactivity

Mouseover and click events are set up to enhance interactivity, such as displaying tooltips and showing corresponding pet emojis.
