const userTab = document.querySelector("[data-userWeather]");
const searchTab = document.querySelector("[data-searchWeather]");
const userContainer = document.querySelector(".weather-container");
const grantAccessContainer = document.querySelector(
  ".grant-location-container"
);
const searchForm = document.querySelector("[data-searchForm]");
const loadingScreen = document.querySelector(".loading-container");
const userInfoContainer = document.querySelector(".user-info-container");
const errorMsg = document.querySelector(".error-container");
const eMsg = document.querySelector("[data-errorMsg]");

let currentTab = userTab;
const API_KEY = "1c355226209e376fa80d3c230c774388";
currentTab.classList.add("current-tab");
getfromSessionStorage();

//Switch - Tab Function
function switchTab(clickedTab) {
  if (clickedTab != currentTab) {
    currentTab.classList.remove("current-tab");
    currentTab = clickedTab;
    currentTab.classList.add("current-tab");

    if (!searchForm.classList.contains("active")) {
      // Kya Search form wala container is invisible, if yes then make it visible
      userInfoContainer.classList.remove("active");
      grantAccessContainer.classList.remove("active");
      errorMsg.classList.remove("active");
      searchForm.classList.add("active");
    } else {
      // main Pahle Search wale tab pr tha, ab muje your weather ko visible krna hai
      searchForm.classList.remove("active");
      userInfoContainer.classList.remove("active");
      errorMsg.classList.remove("active");

      // Ab main Your Weather Tab me Hu, to Muje Weather Show krna Padega Iske liye cordinate check out
      getfromSessionStorage();
    }
  }
}
// this function To Your Weather
userTab.addEventListener("click", () => {
  //pass clicked tab as input parameter
  switchTab(userTab);
});

// this function To Your Search-Weather
searchTab.addEventListener("click", () => {
  //pass clicked tab as input parameter
  switchTab(searchTab);
});

// check if cordinate are present in already in local storage
function getfromSessionStorage() {
  const localCoordinates = sessionStorage.getItem("user-coordinates");

  if (!localCoordinates) {
    // if local Coordinates are not present then show grant Access Location
    grantAccessContainer.classList.add("active");
  } else {
    const coordinates = JSON.parse(localCoordinates);
    fetchUserWeatherInfo(coordinates);
  }
}

async function fetchUserWeatherInfo(coordinates) {
  const { lat, long } = coordinates;
  // grant Access Invisible
  grantAccessContainer.classList.remove("active");
  //Make Loader Visible
  loadingScreen.classList.add("active");

  // call Api
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=${API_KEY}&units=metric`
    );
    const data = await response.json();
    // After fetch weather , invisible Loading screen
    loadingScreen.classList.remove("active");
    //show on your weather screen
    userInfoContainer.classList.add("active");
    renderWeatherInfo(data);
  } catch (e) {
    loadingScreen.classList.remove("active");
    errorMsg.classList.add("active");
    eMsg.innerText = "location not Found..";
    console.log(e);
  }
}

function renderWeatherInfo(weatherInfo) {
  // Firstly we have fetch the element
  let cityName = document.querySelector("[data-cityName]");
  let countryIcon = document.querySelector("[data-countryIcon]");
  let desc = document.querySelector("[data-weatherDesc]");
  let weatherIcon = document.querySelector("[data-weatherIcon]");
  let temp = document.querySelector("[data-temp]");
  let windSpeed = document.querySelector("[data-windSpeed]");
  let humidity = document.querySelector("[data-humidity]");
  let cloud = document.querySelector("[data-cloud]");

  //fetch weatherInfo Object to value and put in element & show UI
  cityName.innerText = weatherInfo?.name; // means if weatherInfo is present then show name
  countryIcon.src = `https://flagcdn.com/144x108/${weatherInfo?.sys?.country?.toLowerCase()}.png`;
  desc.innerText = weatherInfo?.weather?.[0]?.description;
  weatherIcon.src = `https://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;

  temp.innerText = `${weatherInfo?.main?.temp.toFixed(2)}℃`;

  windSpeed.innerText = `${weatherInfo?.wind?.speed}m/s`;
  humidity.innerText = `${weatherInfo?.main?.humidity}%`;
  cloud.innerText = `${weatherInfo?.clouds?.all}%`;
}
function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition);
  } else {
    // show an alert for no geolocation present in your browser
  }
}

function showPosition(position) {
  const userCoordinates = {
    lat: position.coords.latitude,
    long: position.coords.longitude,
  };
  sessionStorage.setItem("user-coordinates", JSON.stringify(userCoordinates));
  fetchUserWeatherInfo(userCoordinates);
}
const grantAccessButton = document.querySelector("[data-grantAccess]");
grantAccessButton.addEventListener("click", () => getLocation());

let searchInput = document.querySelector("[data-searchInput]");
searchForm.addEventListener("submit", (e) => {
  e.preventDefault();
  if (searchInput.value === "") return;

  fetchSearchWeatherInfo(searchInput.value);
});

async function fetchSearchWeatherInfo(city) {
  loadingScreen.classList.add("active");
  userInfoContainer.classList.remove("active");
  grantAccessContainer.classList.remove("active");
  try {
    let response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
    );
    const data = await response.json();
    loadingScreen.classList.remove("active");
    userInfoContainer.classList.add("active");
    renderWeatherInfo(data);
  } catch (e) {
    loadingScreen.classList.remove("active");
    errorMsg.classList.add("active");
    eMsg.innerText = `City  ${city} Not Found..`;
    // eMsg.innerText = "location not Found..";
  }
}
