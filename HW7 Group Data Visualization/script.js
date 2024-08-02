// Set dimensions and margins
const margin = {top: 50, right: 30, bottom: 70, left: 60};
const width = 800 - margin.left - margin.right;
const height = 400 - margin.top - margin.bottom;

// Create SVG for bar chart
const svgBar = d3.select("#barChart")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

// Create SVG for line chart
const svgLine = d3.select("#lineChart")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

// Create tooltip
const tooltip = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

// Load data
d3.csv("pet_adoption_data.csv").then(function(data) {
    // Data preprocessing
    const petTypeAvgAdoptionFee = d3.rollup(data, v => +d3.mean(v, d => d.AdoptionFee).toFixed(2), d => d.PetType);
    const petTypeAvgAge = d3.rollup(data, v => +d3.mean(v, d => d.AgeMonths).toFixed(2), d => d.PetType);

    const petTypeAvgAdoptionFeeArray = Array.from(petTypeAvgAdoptionFee, ([PetType, AdoptionFee]) => ({PetType, AdoptionFee}));
    const petTypeAvgAgeArray = Array.from(petTypeAvgAge, ([PetType, AgeMonths]) => ({PetType, AgeMonths}));

    // Create bar chart
    createBarChart(petTypeAvgAdoptionFeeArray);

    // Create line chart
    createLineChart(petTypeAvgAgeArray);
});

function createBarChart(data) {
    // Set up x-axis
    const x = d3.scaleBand()
        .range([0, width])
        .domain(data.map(d => d.PetType))
        .padding(0.1);

    svgBar.append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x))
        .selectAll("text")
        .attr("transform", "translate(-10,0)rotate(-45)")
        .style("text-anchor", "end");

    // Set up y-axis
    const y = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.AdoptionFee)])
        .range([height, 0]);

    svgBar.append("g")
        .call(d3.axisLeft(y));

    // Create bars
    svgBar.selectAll("rect")
        .data(data)
        .enter()
        .append("rect")
        .attr("x", d => x(d.PetType))
        .attr("y", d => y(d.AdoptionFee))
        .attr("width", x.bandwidth())
        .attr("height", d => height - y(d.AdoptionFee))
        .attr("class", d => `bar ${d.PetType.toLowerCase()}`)
        .on("mouseover", function(event, d) {
            d3.select(this).attr("fill", "#FF69B4");
            tooltip.transition()
                .duration(200)
                .style("opacity", .9);
            tooltip.html(`Pet Type: ${d.PetType}<br/>Average Adoption Fee: ${d.AdoptionFee.toFixed(2)}`)
                .style("left", (event.pageX) + "px")
                .style("top", (event.pageY - 28) + "px");
            highlightLine(d.PetType);
        })
        .on("mouseout", function(d) {
            d3.select(this).attr("class", `bar ${d.PetType.toLowerCase()}`);
            tooltip.transition()
                .duration(500)
                .style("opacity", 0);
            resetLine();
        })
        .on("click", function(event, d) {
            showPetEmoji(d.PetType);
        });

    // Add title
    svgBar.append("text")
        .attr("x", width / 2)
        .attr("y", 0 - margin.top / 2)
        .attr("class", "title")
        .text("Average Adoption Fee by Pet Type");
}

function createLineChart(data) {
    // Set up x-axis
    const x = d3.scaleBand()
        .range([0, width])
        .domain(data.map(d => d.PetType))
        .padding(0.1);

    svgLine.append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x))
        .selectAll("text")
        .attr("transform", "translate(-10,0)rotate(-45)")
        .style("text-anchor", "end");

    // Set up y-axis
    const y = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.AgeMonths)])
        .range([height, 0]);

    svgLine.append("g")
        .call(d3.axisLeft(y));

    // Create line
    const line = d3.line()
        .x(d => x(d.PetType) + x.bandwidth() / 2)
        .y(d => y(d.AgeMonths));

    svgLine.append("path")
        .datum(data)
        .attr("class", "line")
        .attr("d", line)
        .attr("fill", "none")
        .attr("stroke", "#FF69B4") // Set line color to pink
        .attr("stroke-width", 2);

    // Create dots
    svgLine.selectAll(".dot")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", d => x(d.PetType) + x.bandwidth() / 2)
        .attr("cy", d => y(d.AgeMonths))
        .attr("r", 5)
        .attr("class", d => `dot ${d.PetType.toLowerCase()}`)
        .on("mouseover", function(event, d) {
            d3.select(this).attr("fill", "#FF69B4");
            tooltip.transition()
                .duration(200)
                .style("opacity", .9);
            tooltip.html(`Pet Type: ${d.PetType}<br/>Average Age: ${d.AgeMonths.toFixed(2)} months`)
                .style("left", (event.pageX) + "px")
                .style("top", (event.pageY - 28) + "px");
            highlightBar(d.PetType);
        })
        .on("mouseout", function(d) {
            d3.select(this).attr("class", `dot ${d.PetType.toLowerCase()}`);
            tooltip.transition()
                .duration(500)
                .style("opacity", 0);
            resetBar();
        })
        .on("click", function(event, d) {
            showPetEmoji(d.PetType);
        });

    // Add title
    svgLine.append("text")
        .attr("x", width / 2)
        .attr("y", 0 - margin.top / 2)
        .attr("class", "title")
        .text("Average Age by Pet Type (Months)");
}

function highlightBar(petType) {
    svgBar.selectAll("rect")
        .attr("opacity", 0.2)
        .filter(d => d.PetType === petType)
        .attr("opacity", 1)
        .attr("fill", "#FF69B4");
}

function resetBar() {
    svgBar.selectAll("rect")
        .attr("opacity", 1)
        .attr("class", d => `bar ${d.PetType.toLowerCase()}`);
}

function highlightLine(petType) {
    svgLine.selectAll(".dot")
        .attr("opacity", 0.2)
        .filter(d => d.PetType === petType)
        .attr("opacity", 1)
        .attr("fill", "#FF69B4");
}

function resetLine() {
    svgLine.selectAll(".dot")
        .attr("opacity", 1)
        .attr("class", d => `dot ${d.PetType.toLowerCase()}`);
}

// Show pet emoji function
function showPetEmoji(petType) {
    const petEmojis = {
        "Bird": "🐦",
        "Rabbit": "🐰",
        "Dog": "🐶",
        "Cat": "🐱",
    };
    const emoji = petEmojis[petType];
    if (emoji) {
        d3.select("#emojiContainer").text(emoji);
    } else {
        d3.select("#emojiContainer").text("");
    }
}
