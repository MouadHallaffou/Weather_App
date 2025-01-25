// Sélection des éléments du DOM
const cityInput = document.querySelector("#city-input"); // Champ de saisie pour la ville
const searchButton = document.querySelector("#search-btn"); // Bouton de recherche
const currentWeatherDiv = document.querySelector("#current-weather"); // Div pour les données météo actuelles
const daysForecastDiv = document.querySelector("#days-forecast"); // Div pour les prévisions sur 5 jours
const loadingSpinner = document.querySelector("#loading-spinner"); // Spinner de chargement

// Clé API pour accéder à WeatherAPI
const API_KEY = "c7ea0c8294504b128b3111244252501";

/**
 * Fonction pour créer une carte météo au format HTML.
 * @param {string} cityName - Le nom de la ville.
 * @param {object} weatherItem - Les données météo (actuelles ou prévisions).
 * @param {number} index - L'index pour distinguer les données actuelles (0) des prévisions (> 0).
 * @returns {string} - Le HTML de la carte météo.
 */
const createWeatherCard = (cityName, weatherItem, index) => {
  if (index === 0) {
    // Carte pour les données météo actuelles
    return `
            <div class="flex justify-between items-center">
              <div>
                <h3 class="text-2xl font-bold">${cityName}</h3>
                <p class="mt-2"><i class="fas fa-thermometer-half"></i> Temperature: ${weatherItem.temp_c}°C</p>
                <p class="mt-2"><i class="fas fa-wind"></i> Wind: ${weatherItem.wind_kph} km/h</p>
                <p class="mt-2"><i class="fas fa-tint"></i> Humidity: ${weatherItem.humidity}%</p>
              </div>
              <div class="text-center">
                <img src="${weatherItem.condition.icon}" alt="${weatherItem.condition.text}" class="w-24 h-24">
                <p class="mt-2">${weatherItem.condition.text}</p>
              </div>
            </div>
          `;
  } else {
    // Carte pour les prévisions météo
    return `
            <div class="bg-white p-4 rounded-lg shadow-md">
              <h5 class="font-semibold">${weatherItem.date}</h5>
              <img src="${weatherItem.day.condition.icon}" alt="${weatherItem.day.condition.text}" class="w-12 h-12 mx-auto my-2">
              <p class="mt-2"><i class="fas fa-thermometer-half"></i> Temp: ${weatherItem.day.avgtemp_c}°C</p>
              <p class="mt-2"><i class="fas fa-wind"></i> Wind: ${weatherItem.day.maxwind_kph} km/h</p>
              <p class="mt-2"><i class="fas fa-tint"></i> Humidity: ${weatherItem.day.avghumidity}%</p>
            </div>
          `;
  }
};

/**
 * Fonction pour récupérer les données météo d'une ville.
 * @param {string} cityName - Le nom de la ville.
 */
const getWeatherDetails = (cityName) => {
  // URL de l'API pour récupérer les données météo (actuelles et prévisions sur 5 jours)
  const WEATHER_API_URL = `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${cityName}&days=5`;

  // Envoi de la requête à l'API
  fetch(WEATHER_API_URL)
    .then((response) => response.json()) // Conversion de la réponse en JSON
    .then((data) => {
      const { location, current, forecast } = data; // Extraction des données

      // Réinitialisation des champs et des divs
      cityInput.value = "";
      currentWeatherDiv.innerHTML = "";
      daysForecastDiv.innerHTML = "";

      // Affichage des données météo actuelles
      const currentWeatherHTML = createWeatherCard(location.name, current, 0);
      currentWeatherDiv.insertAdjacentHTML("beforeend", currentWeatherHTML);

      // Affichage des prévisions sur 5 jours
      forecast.forecastday.forEach((day, index) => {
        if (index > 0) {
          const forecastHTML = createWeatherCard(location.name, day, index);
          daysForecastDiv.insertAdjacentHTML("beforeend", forecastHTML);
        }
      });
    })
    .catch(() => {
      // Gestion des erreurs
      alert("An error occurred while fetching the weather forecast!");
    })
    .finally(() => {
      // Masquage du spinner de chargement
      loadingSpinner.classList.add("hidden");
    });
};

/**
 * Fonction déclenchée lors du clic sur le bouton de recherche.
 */
const getCityCoordinates = () => {
  const cityName = cityInput.value.trim(); // Récupération du nom de la ville
  if (cityName === "") {
    // Vérification que le champ n'est pas vide
    alert("Please enter a city name.");
    return;
  }
  loadingSpinner.classList.remove("hidden"); // Affichage du spinner de chargement
  getWeatherDetails(cityName); // Récupération des données météo
};

// Ajout d'un écouteur d'événement sur le bouton de recherche
searchButton.addEventListener("click", getCityCoordinates);
