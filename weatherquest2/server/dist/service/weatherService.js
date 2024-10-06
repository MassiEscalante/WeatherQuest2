import dotenv from 'dotenv';
dotenv.config();
class WeatherService {
    constructor() {
        this.baseURL = 'https://api.openweathermap.org/data/2.5/forecast';
        this.apiKey = process.env.OPENWEATHER_API_KEY; // Ensure apiKey is a string
    }
    // Fetch and return weather data for a given city
    async getWeatherForCity(city) {
        try {
            const requestUrl = `${this.baseURL}?q=${city}&appid=${this.apiKey}`;
            console.log(`Fetching weather data for city: ${city}`); // Log city name
            console.log(`Request URL: ${requestUrl}`); // Log API request URL
            const response = await fetch(requestUrl);
            const data = await response.json();
            console.log('API Response:', data); // Log full API response
            if (!response.ok) {
                throw new Error(data.message || 'Failed to fetch weather data');
            }
            return data;
        }
        catch (error) {
            console.error(`Error in WeatherService: ${error.message}`); // Log error details
            throw new Error('Failed to retrieve weather data');
        }
    }
}
export default new WeatherService();
