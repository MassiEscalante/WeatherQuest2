import { Router } from 'express';
const router = Router();
import WeatherService from '../../service/weatherService.js';
import HistoryService from '../../service/historyService.js';
// POST request with city name to retrieve weather data
router.post('/', async (req, res) => {
    const { cityName } = req.body;
    if (!cityName) {
        return res.status(400).json({ error: 'City name is required' });
    }
    try {
        const weatherData = await WeatherService.getWeatherForCity(cityName);
        await HistoryService.addCity(cityName);
        return res.json(weatherData);
    }
    catch (error) {
        return res.status(500).json({ error: 'Failed to retrieve weather data' });
    }
});
// GET search history
router.get('/history', async (_req, res) => {
    try {
        const cities = await HistoryService.getCities();
        return res.json(cities);
    }
    catch (error) {
        return res.status(500).json({ error: 'Failed to retrieve search history' });
    }
});
// DELETE city from search history
router.delete('/history/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await HistoryService.removeCity(id);
        return res.status(200).json({ message: 'City removed successfully' });
    }
    catch (error) {
        return res.status(500).json({ error: 'Failed to delete city' });
    }
});
export default router;
