import { Router } from 'express';
const router = Router();
import WeatherService from '../../service/weatherService.js';
import HistoryService from '../../service/historyService.js';

// POST request with city name to retrieve weather data
router.post('/', async (req, res) => {
  const { cityName } = req.body;

  // Check if cityName is missing or blank
  if (!cityName || cityName.trim() === '') {
    return res.status(400).json({ error: 'City name cannot be blank' });
  }

  try {
    // Fetch the weather data for the requested city
    const weatherData = await WeatherService.getWeatherForCity(cityName);
    
    // Log the fetched weather data
    console.log(`Weather data for ${cityName}:`, weatherData); 
    
    // Add the city to the search history
    await HistoryService.addCity(cityName);

    // Return the fetched weather data as JSON
    return res.json(weatherData);

  } catch (error) {
    // Log the error details to the server console
    console.error(`Error fetching weather data for ${cityName}:`, error);
    
    // Return a 500 status with a relevant error message
    return res.status(500).json({ error: 'Failed to retrieve weather data' });
  }
});

// GET search history
router.get('/history', async (_req, res) => {
  try {
    const cities = await HistoryService.getCities();
    return res.json(cities);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to retrieve search history' });
  }
});

// DELETE city from search history
router.delete('/history/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await HistoryService.removeCity(id);
    return res.status(200).json({ message: 'City removed successfully' });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to delete city' });
  }
});

export default router;
