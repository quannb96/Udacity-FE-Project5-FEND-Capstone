const USERNAME = "quannguyenbao";
const WEATHER_KEY = "7843f9e07910487a9e4c7109541d4c7b";
const PIXABAY_KEY = "43627354-0d42ccf682d71f76c36dbe877";

// Function to fetch data from Geoname API
const fetchGeonameData = async (city) => {
  const response = await fetch(
    `http://api.geonames.org/searchJSON?maxRows=10&operator=OR&q=${city}&name=${city}&username=${USERNAME}`
  );
  const data = await response.json();
  return data;
};

// Function to fetch weather data from Weatherbit API
const fetchWeatherData = async (lat, lon) => {
  const response = await fetch(
    `https://api.weatherbit.io/v2.0/current?lat=${lat}&lon=${lon}&key=${WEATHER_KEY}`
  );
  const data = await response.json();
  return data;
};

// Function to fetch image data from Pixabay API
const fetchPixabayData = async (city) => {
  const response = await fetch(
    `https://pixabay.com/api/?key=${PIXABAY_KEY}&q=${city}&image_type=photo`
  );
  const data = await response.json();
  return data;
};

// Function to validate form values and process accordingly
export const generateAction = async (e) => {
  e.preventDefault();
  const destination = document.getElementById("destination").value;
  const start = document.getElementById("start").value;
  const startDate = new Date(start);
  const today = new Date();

  if (
    start.length !== 0 &&
    destination.length !== 0 &&
    startDate - today >= 0
  ) {
    const remainingTime = Math.ceil(
      Math.ceil(startDate - today) / (1000 * 60 * 60 * 24)
    );

    document.getElementById("form-submit").innerHTML = "Loading data...";
    const city = document.getElementById("destination").value;
    const geonameData = await fetchGeonameData(city);
    const lat = geonameData.geonames[0].lat;
    const lon = geonameData.geonames[0].lng;
    const weatherData = await fetchWeatherData(lat, lon);
    const pixabayData = await fetchPixabayData(city);

    const projectData = {
      country: geonameData.geonames[0].countryName,
      city: geonameData.geonames[0].name,
      temperature: weatherData.data[0].temp,
      weatherDesc: weatherData.data[0].weather.description,
      img: pixabayData.hits[0].webformatURL,
      remainingTime: remainingTime,
      startDate: start,
    };

    postData("/add", projectData);
    document.getElementById("form-submit").innerHTML = "Submit";
    updateUI();
  } else {
    document.getElementById("status").innerHTML = "Please enter correct values";
    setTimeout(() => {
      document.getElementById("status").innerHTML = "";
    }, 2500);
  }
};

// Function to POST data
const postData = async (url = "", data = {}) => {
  const response = await fetch(url, {
    method: "POST",
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  try {
    return await response.json();
  } catch (error) {
    console.log(error);
  }
};

// Function to GET Project Data
export const updateUI = async () => {
  const request = await fetch("/all");
  try {
    // Transform into JSON
    const projectData = await request.json();
    const {
      img,
      city,
      country,
      startDate,
      temperature,
      weatherDesc,
      remainingTime,
    } = projectData;

    document.getElementById('model-planner').style.display = 'block';
    // Write updated data to DOM elements
    document.getElementById("modal-img").setAttribute("src", img);
    document.querySelectorAll(".modal-city").forEach((element) => {
      element.textContent += city;
    });
    document.querySelectorAll(".modal-country").forEach((element) => {
      element.textContent += country;
    });
    document.getElementById("modal-start-date").innerHTML = startDate;
    document.getElementById("modal-temp").innerHTML = temperature;
    document.getElementById("modal-weather").innerHTML = weatherDesc;
    document.getElementById("modal-timeRemaining").innerHTML = remainingTime;
  } catch (error) {
    console.log("error", error);
  }
};
