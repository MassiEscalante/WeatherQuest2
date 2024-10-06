import dotenv from 'dotenv';
dotenv.config();
// TODO: Define a class for the Weather object
class Weather {
    constructor(city, date, icon, iconDescription, tempF, windSpeed, humidity) {
        this.city = city;
        this.date = date;
        this.icon = icon;
        this.iconDescription = iconDescription;
        this.tempF = tempF;
        this.windSpeed = windSpeed;
        this.humidity = humidity;
    }
}
// TODO: Complete the WeatherService class
class WeatherService {
    constructor() {
        this.baseURL = 'https://api.openweathermap.org/data/2.5/forecast';
        this.apiKey = process.env.OPENWEATHER_API_KEY;
        this.cityName = '';
    }
    // TODO: Create fetchLocationData method
    async fetchLocationData(query) {
        const url = this.buildGeocodeQuery(query);
        const response = await fetch(url);
        return response.json();
    }
    // TODO: Create destructureLocationData method
    destructureLocationData(locationData) {
        const { lat, lon } = locationData.city.coord;
        return { lat, lon };
    }
    // TODO: Create buildGeocodeQuery method
    buildGeocodeQuery(query) {
        return `${this.baseURL}?q=${query}&appid=${this.apiKey}`;
    }
    // TODO: Create buildWeatherQuery method
    buildWeatherQuery(coordinates) {
        const { lat, lon } = coordinates;
        return `${this.baseURL}?lat=${lat}&lon=${lon}&appid=${this.apiKey}`;
    }
    // TODO: Create fetchAndDestructureLocationData method
    async fetchAndDestructureLocationData(query) {
        const locationData = await this.fetchLocationData(query);
        return this.destructureLocationData(locationData);
    }
    // TODO: Create fetchWeatherData method
    async fetchWeatherData(coordinates) {
        const url = this.buildWeatherQuery(coordinates);
        const response = await fetch(url);
        return response.json();
    }
    // TODO: Build parseCurrentWeather method
    parseCurrentWeather(response) {
        const city = response.city.name;
        const date = new Date().toLocaleDateString();
        const icon = response.list[0].weather[0].icon;
        const iconDescription = response.list[0].weather[0].description;
        const tempF = (response.list[0].main.temp - 273.15) * 9 / 5 + 32;
        const windSpeed = response.list[0].wind.speed;
        const humidity = response.list[0].main.humidity;
        return new Weather(city, date, icon, iconDescription, tempF, windSpeed, humidity);
    }
    // TODO: Complete buildForecastArray method
    buildForecastArray(currentWeather, weatherData) {
        return weatherData.map(day => {
            const date = new Date(day.dt * 1000).toLocaleDateString();
            const icon = day.weather[0].icon;
            const iconDescription = day.weather[0].description;
            const tempF = (day.main.temp - 273.15) * 9 / 5 + 32;
            const windSpeed = day.wind.speed;
            const humidity = day.main.humidity;
            return new Weather(currentWeather.city, date, icon, iconDescription, tempF, windSpeed, humidity);
        });
    }
    // TODO: Complete getWeatherForCity method
    async getWeatherForCity(city) {
        const coordinates = await this.fetchAndDestructureLocationData(city);
        const weatherData = await this.fetchWeatherData(coordinates);
        const currentWeather = this.parseCurrentWeather(weatherData);
        return this.buildForecastArray(currentWeather, weatherData.list);
    }
}
export default new WeatherService();
