// Set dimensions
const width = 2000;
const height = 6000;
const colorMap = {
  "Automation Potential": "red",
  "The Big Unknown": "yellow",
  "Augmentation Potential": "blue",
  "Not Affected": "grey"
};

// Append the SVG object to the body
const svg = d3.select("#tree-container")
  .append("svg")
  .attr("width", width)
  .attr("height", height)
  .append("g")
  .attr("transform", "translate(50,0)");

// Create the tree layout
const tree = d3.tree().size([height, width - 400]);

// Load JSON data
d3.json("output_data.json").then(data => {
  const root = d3.hierarchy(data);

  // Assign the tree layout to the data
  tree(root);

  // Links
  svg.selectAll("path")
    .data(root.links())
    .enter()
    .append("path")
    .attr("class", "link")
    .attr("fill", "none")
    .attr("stroke", "#ccc")
    .attr("stroke-width", 2)
    .attr("d", d3.linkHorizontal()
      .x(d => d.y)
      .y(d => d.x));

  // Nodes
  const node = svg.selectAll("g.node")
    .data(root.descendants())
    .enter()
    .append("g")
    .attr("transform", d => `translate(${d.y},${d.x})`);

  // Add circles to the nodes with color mapping based on risk
  node.append("circle")
    .attr("r", 5)
    .attr("fill", d => colorMap[d.data.risk] || "green");  // Default to green for missing values

  // Add labels to the nodes
  node.append("text")
    .attr("dy", 3)
    .attr("x", d => d.children ? -10 : 40)
    .style("text-anchor", d => d.children ? "end" : "start")
    .style("font-size", "11px")
    .text(d => d.data.name);
}).catch(error => {
  console.error("Error loading the data:", error);
});
