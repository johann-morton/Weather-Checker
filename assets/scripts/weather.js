// *** Weather Report JavaScript *** //

// Set up variables for use in the app
// *** Please Note *** //
// You will need to create and add your own API keys in order to make this application functional.
// You can obtain the Weather API at https://www.weatherapi.com/signup.aspx
const weatherApiKey = '';
// You can obtain the Google Maps key at https://developers.google.com/maps/documentation/embed/get-api-key
const mapsApiKey = '';
// *** //
let selectedCity = '';
const theWeather = document.getElementById('theWeather');
const theMap = document.getElementById('theMap');
const weatherData = document.querySelectorAll('.weatherData');
const modal = document.querySelectorAll(".pop-up");
const closeModalBtn = document.getElementById("closeBtn");
//const results = document.getElementById('results');
let search_term = '';

// Display an error message modal if the input region is unregconised
errMsg = () => {
  modal.forEach(item => {
    item.classList.toggle('hidden');
  });
};

// Closes the error message modal
closeModalBtn.addEventListener('click', function(e) {
  e.preventDefault();
  errMsg();
});

// Call the regional search API to get populate the datalist options 
async function getRegion() {
  results.innerHTML = "";
  try {
    let response = await fetch(`https://api.weatherapi.com/v1/search.json?key=${weatherApiKey}&q=${search_term }`);
    if (!response.ok) {
      throw new Error('There was an problem retrieving the data.')
    }
    let city = await response.json();
    city.forEach(area => {
      if(area !== '') { 
        const option = document.createElement("option");
        option.innerHTML = `${area.name}, ${area.country}`;
        option.value = `${area.name}, ${area.country}`;
        results.appendChild(option);
      } else {
        return false;
      }
    });
  } catch (error) {
    console.log('Nothing to display - search field is empty.')
  }
}

// Uses the search API data to perform a live search with the datalist options
cityName.addEventListener('input', (event) => {
  search_term = event.target.value.toLowerCase();
  getRegion();
});

// Get the selected datalist option and pass the value to the getWeather function
document.getElementById('citySelector').addEventListener('click', function(e) {
  e.preventDefault();
  selectedCity = document.querySelector('#cityName').value;
  if(!selectedCity) return;
  getWeather(selectedCity);
});

// Call the weather API with the region passed in as a variable
async function getWeather(selectedCity) {
  weatherData.forEach(item => {
    item.classList.remove('open');
  });
  try {
    let response = await fetch(`https://api.weatherapi.com/v1/current.json?key=${weatherApiKey}&q=${selectedCity}&aqi=no`);
    if (!response.ok) {
      throw new Error('City not found - have you mispelled it?')
    }
    let city = await response.json();
    weatherReport(city);
  } catch (error) {
    document.getElementById('cityName').value = '';
    console.log('There was an problem retrieving the data.')
    errMsg();
  }
}

// Call the weatherReport function to display the weather data to the user
// 1/2 call the Google Maps API, passing in the regional data
// 2/2 Once the map has loaded, update the screen with the completed content 
function weatherReport(city) {
  theMap.innerHTML = `
    <iframe
      id="mapEmbed"
      style="border:0"
      loading="eager"
      allowfullscreen
      referrerpolicy="no-referrer-when-downgrade"
      z-index="1"
      src="https://www.google.com/maps/embed/v1/place?key=${mapsApiKey}&q=${city.location.name},${city.location.country}">
    </iframe>
  `;
  document.getElementById('mapEmbed').addEventListener('load', function() {
    theWeather.innerHTML = `
      <p>Your selected region is:</p>
      <h3>${city.location.name}, ${city.location.country}</h3>
      <p>Local time: ${city.location.localtime.slice(11)}<br>
      <br><img id="weatherIcon" src="${city.current.condition.icon}">The current weather conditions are: ${city.current.condition.text}, and the temperature is ${city.current.temp_c}&deg;c / ${city.current.temp_f}&deg;f.<br>The humitidy level is currently ${city.current.humidity}%rh.<br>
      <br>The wind direction is ${city.current.wind_dir} with a current speed of ${city.current.wind_mph}mph / ${city.current.wind_kph}kph, and gusts of ${city.current.gust_mph}mph / ${city.current.gust_kph}kph.</p>
      <p><br>Last updated at: ${city.current.last_updated}</p>
    `;
    weatherData.forEach(item => {
      item.classList.add('open');
    });
  });
/*
  OPTIONAL
  To use Google Maps "view mode", channge 'place' to 'view' in the src strring and add the following to the end:
  &center=${city.location.lat},${city.location.lon}&maptype=satellite&zoom=18
*/
};

// ** Get the weather data using fetch with Promises (working but not used) ** //
// function getCity() {
//   selectedCity = document.getElementById('cityName').value;
//   fetch(`https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${selectedCity}&aqi=no`)
//   .then(response => response.json())
//   .then(city => {
//     theCity = city.location.name;
//     theCountry = city.location.country;
//     localTime = city.location.localtime.slice(11);
//     weatherCondition = city.current.condition.text;
//     theTemperatureC = city.current.temp_c;
//     theTemperatureF = city.current.temp_f;
//     windSpeedMPH = city.current.wind_mph;
//     windSpeedKPH = city.current.wind_kph;
//     weatherIcon =city.current.condition.icon;
//     humidityLevel = city.current.humidity;
//     lastUpdated = city.current.last_updated;
//   })
//   .catch(error => console.error('Error fetching data.'))
// }