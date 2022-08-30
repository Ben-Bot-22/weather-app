const key = '322bb31af12e09cddeec8d5ab3bbd515';
const defaultCity = 'washington, D.C.';

const loc = document.getElementById('location');
const temperature = document.getElementById('temperature');
const stat = document.getElementById('status');
const feelsLike = document.getElementById('feels-like');
const windSpeed = document.getElementById('wind-speed');
const humidity = document.getElementById('humidity');

const search = document.getElementById('search');
search.addEventListener('keypress', function (e) {
  if (e.key === 'Enter') {
    e.preventDefault();
    displayWeatherData(search.value);
    search.value = '';
  }
});

async function displayWeatherData(citySearch) {
  const weatherData = await getWeatherData(citySearch);
  loc.innerHTML = weatherData.location;
  temperature.innerHTML = weatherData.temp;
  stat.innerHTML = weatherData.status;
  feelsLike.innerHTML = 'feels like: ' + weatherData.feelsLike + ' &#8457;';
  windSpeed.innerHTML = 'wind speed: ' + weatherData.wind + ' mph';
  humidity.innerHTML = 'humidity: ' + weatherData.humidity + '%';
  //   console.log(weatherData);
}

async function getWeatherCoord(city) {
  const fetchLocation = await fetch(
    `http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${key}
  `,
    { mode: 'cors' }
  );
  const data = await fetchLocation.json();
  if (data.length === 0) {
    alert(`No city matching ${city} found.  Please try again.`);
  } else {
    return { lat: data[0].lat, lon: data[0].lon };
  }
}

async function getWeatherData(city) {
  const coordinates = await getWeatherCoord(city);
  const weatherData = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${key}&units=imperial`,
    { mode: 'cors' }
  );
  const data = await weatherData.json();
  const filteredData = {
    temp: round(data.main.temp),
    status: data.weather[0].main,
    feelsLike: round(data.main.feels_like),
    wind: round(data.wind.speed),
    humidity: data.main.humidity,
    location: data.name,
  };
  return filteredData;
}

function round(val) {
  return Math.round((val * 100) / 100);
}

displayWeatherData(defaultCity);

/*
TODO:

- Optional: add a ‘loading’ component that displays from the time the form is submitted until the 
information comes back from the API.

*/
