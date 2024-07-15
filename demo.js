const Api_Key = "1c355226209e376fa80d3c230c774388";

function renderWeather(temperature) {
  let newPara = document.createElement("p");
  newPara.textContent = `${temperature.toFixed(2)} ℃`;

  newPara.style.fontSize = "80px";
  newPara.style.color = "red";

  document.body.appendChild(newPara);
}

async function showWeather(lat, long) {
  //   const city = "Indore";

  const response = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=${Api_Key}`
  );

  const data = await response.json();
  console.log(data);

  let tempInCelsius = data.main.temp - 273.15;
  renderWeather(tempInCelsius);
}

function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition);
  } else {
    alert("Geolocation is not supported by this browser.");
  }
}

function showPosition(position) {
  let lat = position.coords.latitude;
  let long = position.coords.longitude;
  showWeather(lat, long);
}

// console.log("user can Search Your Location Weather", getLocation());
document.write("Ha Bablu");
getLocation();
