// pre-made json file
const statesDataUrl = "https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json";
const stateNames = {
  1: "Alabama", 2: "Alaska", 4: "Arizona", 5: "Arkansas", 6: "California",
  8: "Colorado", 9: "Connecticut", 10: "Delaware", 
  12: "Florida", 13: "Georgia", 15: "Hawaii", 16: "Idaho", 17: "Illinois",
  18: "Indiana", 19: "Iowa", 20: "Kansas", 21: "Kentucky", 22: "Louisiana",
  23: "Maine", 24: "Maryland", 25: "Massachusetts", 26: "Michigan",
  27: "Minnesota", 28: "Mississippi", 29: "Missouri", 30: "Montana",
  31: "Nebraska", 32: "Nevada", 33: "New Hampshire", 34: "New Jersey",
  35: "New Mexico", 36: "New York", 37: "North Carolina", 38: "North Dakota",
  39: "Ohio", 40: "Oklahoma", 41: "Oregon", 42: "Pennsylvania",
  44: "Rhode Island", 45: "South Carolina", 46: "South Dakota",
  47: "Tennessee", 48: "Texas", 49: "Utah", 50: "Vermont",
  51: "Virginia", 53: "Washington", 54: "West Virginia", 55: "Wisconsin",
  56: "Wyoming"
};

let states = [], currentStateIndex = 0, score = 0;

async function loadMap() {
  const res = await fetch(statesDataUrl);
  const topo = await res.json();
  const geojson = topojson.feature(topo, topo.objects.states);

  const svg = d3.select("#us-map");
   
  const projection = d3.geoAlbersUsa()
  .scale(1200)
  .translate([1050 / 2, 600 / 1.5]);

const path = d3.geoPath().projection(projection);

  states = geojson.features.map(f => ({
  id: +f.id,
  name: stateNames[+f.id],
  feature: f
})).filter(s => s.name && s.name !== "District of Columbia");

  svg.selectAll("path")
    .data(states)
    .enter()
    .append("path")
    .attr("d", path)
    .attr("d", d => path(d.feature))
    .attr("class", "state")
    .on("click", (event, d) => handleStateClick(event, d));

  states = states.sort(() => Math.random() - 0.5);
  askNextState();
}

function askNextState() {

  if (currentStateIndex >= states.length) {
    document.getElementById("question").textContent = `Game Over! Final Score: ${score}/50`;
    document.getElementById("restart").classList.remove("hidden");
    return;
  }
  document.getElementById("question").textContent = `Click on: ${states[currentStateIndex].name}`;
}

function handleStateClick(event, clickedState) {
  // debug checker
  console.log("Clicked on:", clickedState.name); 

  const correctState = states[currentStateIndex];

  if (clickedState.id === correctState.id) {
    score++;
    d3.select(event.target).classed("correct", true);
  } else {
    d3.select(event.target).classed("incorrect", true);
    d3.selectAll(".state")
      .filter(d => d.id === correctState.id)
      .classed("correct", true);
    
    setTimeout(() => {
      d3.select(event.target).classed("incorrect", false);
    }, 1000);
  }

  document.getElementById("score").textContent = `Score: ${score}/50`;
  currentStateIndex++;
  setTimeout(askNextState, 1200); 
}

document.getElementById("restart").addEventListener("click", () => {
  score = 0;
  currentStateIndex = 0;
  document.getElementById("score").textContent = "Score: 0/50";
  d3.selectAll(".state").classed("correct", false).classed("incorrect", false);
  states = states.sort(() => Math.random() - 0.5);
  askNextState();
  document.getElementById("restart").classList.add("hidden");
});

loadMap();