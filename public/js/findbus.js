const buses = [
    { id: 1, name: "Bus A", destination: "City Center" },
    { id: 2, name: "Bus B", destination: "Suburbia" },
    { id: 3, name: "Bus C", destination: "Beachside" }
  ];
  
  function displayBuses() {
    const busListElement = document.getElementById("busList");
  
    busListElement.innerHTML = "";
  
    const ul = document.createElement("ul");
    buses.forEach(bus => {
      const li = document.createElement("li");
      li.textContent = `${bus.name} - Destination: ${bus.destination}`;
      ul.appendChild(li);
    });
  
    busListElement.appendChild(ul);
  }
  
  const findBusesButton = document.getElementsByClassName("button");
  findBusesButton.addEventListener("click", displayBuses);
  