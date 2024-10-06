import './styles/jass.css';

// All necessary DOM elements selected
const searchForm = document.getElementById('search-form') as HTMLFormElement;
const searchInput = document.getElementById('search-input') as HTMLInputElement;
const todayContainer = document.querySelector('#today') as HTMLDivElement;
const forecastContainer = document.querySelector('#forecast') as HTMLDivElement;
const searchHistoryContainer = document.getElementById('history') as HTMLDivElement;
const heading = document.getElementById('search-title') as HTMLHeadingElement;
const weatherIcon = document.getElementById('weather-img') as HTMLImageElement;
const tempEl = document.getElementById('temp') as HTMLParagraphElement;
const windEl = document.getElementById('wind') as HTMLParagraphElement;
const humidityEl = document.getElementById('humidity') as HTMLParagraphElement;

/*

API Calls

*/

const fetchWeather = async (cityName: string) => {
  try {
    const response = await fetch('/api/weather/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ cityName }),
    });

    const weatherData = await response.json();
    console.log('weatherData:', weatherData);

    // Extracting current weather and forecast
    const currentWeather = {
      city: weatherData.city.name,
      date: new Date(weatherData.list[0].dt * 1000).toLocaleDateString(),
      icon: weatherData.list[0].weather[0].icon,
      iconDescription: weatherData.list[0].weather[0].description,
      tempF: (weatherData.list[0].main.temp - 273.15) * 9 / 5 + 32, // Kelvin to Fahrenheit
      windSpeed: weatherData.list[0].wind.speed,
      humidity: weatherData.list[0].main.humidity,
    };

    const forecast = weatherData.list.slice(1, 6).map((day: any) => ({
      date: new Date(day.dt * 1000).toLocaleDateString(),
      icon: day.weather[0].icon,
      iconDescription: day.weather[0].description,
      tempF: (day.main.temp - 273.15) * 9 / 5 + 32,
      windSpeed: day.wind.speed,
      humidity: day.main.humidity,
    }));

    renderCurrentWeather(currentWeather);
    renderForecast(forecast);
  } catch (error) {
    console.error('Error fetching weather:', error);
  }
};

const fetchSearchHistory = async () => {
  try {
    const response = await fetch('/api/weather/history', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return await response.json();
  } catch (error) {
    console.error('Error fetching search history:', error);
  }
};

const deleteCityFromHistory = async (id: string) => {
  try {
    await fetch(`/api/weather/history/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    getAndRenderHistory();
  } catch (error) {
    console.error('Error deleting city:', error);
  }
};

/*

Render Functions

*/

const renderCurrentWeather = (currentWeather: any) => {
  const { city, date, icon, iconDescription, tempF, windSpeed, humidity } = currentWeather;

  heading.textContent = `${city} (${date})`;
  weatherIcon.setAttribute('src', `https://openweathermap.org/img/w/${icon}.png`);
  weatherIcon.setAttribute('alt', iconDescription);
  tempEl.textContent = `Temp: ${tempF.toFixed(2)}°F`;
  windEl.textContent = `Wind: ${windSpeed} MPH`;
  humidityEl.textContent = `Humidity: ${humidity}%`;

  if (todayContainer) {
    todayContainer.innerHTML = '';
    todayContainer.append(heading, tempEl, windEl, humidityEl);
  }
};

const renderForecast = (forecast: any[]) => {
  const headingCol = document.createElement('div');
  const heading = document.createElement('h4');

  headingCol.setAttribute('class', 'col-12');
  heading.textContent = '5-Day Forecast:';
  headingCol.append(heading);

  if (forecastContainer) {
    forecastContainer.innerHTML = '';
    forecastContainer.append(headingCol);
  }

  forecast.forEach((forecastItem) => {
    renderForecastCard(forecastItem);
  });
};

const renderForecastCard = (forecast: any) => {
  const { date, icon, iconDescription, tempF, windSpeed, humidity } = forecast;

  const { col, cardTitle, weatherIcon, tempEl, windEl, humidityEl } = createForecastCard();

  cardTitle.textContent = date;
  weatherIcon.setAttribute('src', `https://openweathermap.org/img/w/${icon}.png`);
  weatherIcon.setAttribute('alt', iconDescription);
  tempEl.textContent = `Temp: ${tempF.toFixed(2)} °F`;
  windEl.textContent = `Wind: ${windSpeed} MPH`;
  humidityEl.textContent = `Humidity: ${humidity}%`;

  forecastContainer?.append(col);
};

/*

Helper Functions

*/

const createForecastCard = () => {
  const col = document.createElement('div');
  const card = document.createElement('div');
  const cardBody = document.createElement('div');
  const cardTitle = document.createElement('h5');
  const weatherIcon = document.createElement('img');
  const tempEl = document.createElement('p');
  const windEl = document.createElement('p');
  const humidityEl = document.createElement('p');

  col.append(card);
  card.append(cardBody);
  cardBody.append(cardTitle, weatherIcon, tempEl, windEl, humidityEl);

  col.classList.add('col-auto');
  card.classList.add('forecast-card', 'card', 'text-white', 'bg-primary', 'h-100');
  cardBody.classList.add('card-body', 'p-2');
  cardTitle.classList.add('card-title');
  tempEl.classList.add('card-text');
  windEl.classList.add('card-text');
  humidityEl.classList.add('card-text');

  return { col, cardTitle, weatherIcon, tempEl, windEl, humidityEl };
};

/*

Event Handlers

*/

const handleSearchFormSubmit = (event: Event) => {
  event.preventDefault();
  const city = searchInput.value.trim();

  if (!city) {
    alert('City cannot be blank');
    return;
  }

  fetchWeather(city).then(() => {
    getAndRenderHistory();
  });
  searchInput.value = '';
};

/*

Initial Render

*/

const getAndRenderHistory = () => {
  fetchSearchHistory().then((history) => {
    renderSearchHistory(history);
  });
};

const renderSearchHistory = (searchHistory: any) => {
  if (!searchHistory || !searchHistory.length) {
    searchHistoryContainer.innerHTML = '<p class="text-center">No Previous Search History</p>';
    return;
  }

  searchHistoryContainer.innerHTML = '';
  searchHistory.forEach((city: any) => {
    const historyItem = buildHistoryListItem(city);
    searchHistoryContainer.append(historyItem);
  });
};

const buildHistoryListItem = (city: any) => {
  const historyDiv = document.createElement('div');
  const newBtn = createHistoryButton(city.name);
  const deleteBtn = createDeleteButton(city.id);
  
  historyDiv.classList.add('display-flex', 'gap-2', 'col-12', 'm-1');
  historyDiv.append(newBtn, deleteBtn);

  return historyDiv;
};

const createHistoryButton = (city: string) => {
  const btn = document.createElement('button');
  btn.textContent = city;
  btn.setAttribute('type', 'button');
  btn.setAttribute('aria-controls', 'today forecast');
  btn.classList.add('history-btn', 'btn', 'btn-secondary', 'col-10');

  btn.addEventListener('click', () => {
    fetchWeather(city);
  });

  return btn;
};

const createDeleteButton = (id: string) => {
  const btn = document.createElement('button');
  btn.classList.add('fas', 'fa-trash-alt', 'delete-city', 'btn', 'btn-danger', 'col-2');
  
  // Stop the event from propagating to the form submit handler
  btn.addEventListener('click', (event) => {
    event.stopPropagation(); // Prevents triggering the form's submit event
    deleteCityFromHistory(id);
  });

  return btn;
};

searchForm.addEventListener('submit', handleSearchFormSubmit);
searchHistoryContainer.addEventListener('click', handleSearchFormSubmit);

getAndRenderHistory();
