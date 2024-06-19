document.addEventListener('DOMContentLoaded', function() {
    const sourceSelect = document.getElementById('source');
    const destinationSelect = document.getElementById('destination');
    const busResultsDiv = document.getElementById('busResults');
  
    // Define your bus data
    const buses = [
      { busNumber: 'A1', source: 'Source1', destination: 'Destination1', distance: 10, fare: 10 },
      { busNumber: 'B2', source: 'Source2', destination: 'Destination2', distance: 15, fare: 15 },
      // Add more bus objects as needed
    ];
  
    // Populate source and destination options
    const sources = Array.from(new Set(buses.map(bus => bus.source)));
    const destinations = Array.from(new Set(buses.map(bus => bus.destination)));
  
    sources.forEach(source => {
      const option = document.createElement('option');
      option.value = source;
      option.textContent = source;
      sourceSelect.appendChild(option);
    });
  
    destinations.forEach(destination => {
      const option = document.createElement('option');
      option.value = destination;
      option.textContent = destination;
      destinationSelect.appendChild(option);
    });
  
    // Handle form submission
    document.getElementById('bookingForm').addEventListener('submit', function(event) {
      event.preventDefault();
  
      const selectedSource = sourceSelect.value;
      const selectedDestination = destinationSelect.value;
  
      // Filter buses based on selected source and destination
      const filteredBuses = buses.filter(bus => bus.source === selectedSource && bus.destination === selectedDestination);
  
      // Display filtered bus results
      let html = '<h2>Available Buses</h2>';
      if (filteredBuses.length === 0) {
        html += '<p>No buses found for the selected route.</p>';
      } else {
        html += '<ul>';
        filteredBuses.forEach(bus => {
          html += `<li>Bus Number: ${bus.busNumber}</li>`;
          html += `<li>Distance: ${bus.distance} km</li>`;
          html += `<li>Fare: $${bus.fare}</li>`;
        });
        html += '</ul>';
      }
  
      busResultsDiv.innerHTML = html;
    });
  });
  