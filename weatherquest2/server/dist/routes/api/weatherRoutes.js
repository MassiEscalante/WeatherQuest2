import { Router } from 'express';
const router = Router();
import WeatherService from '../../service/weatherService.js';
import HistoryService from '../../service/historyService.js';
// TODO: POST Request with city name to retrieve weather data
router.post('/', async (req, res) => {
    const { cityName } = req.body;
    if (!cityName) {
        return res.status(400).json({ error: 'City name is required' });
    }
    try {
        const weatherData = await WeatherService.getWeatherForCity(cityName);
        await HistoryService.addCity(cityName);
        res.json(weatherData);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to retrieve weather data' });
    }
});
// TODO: GET search history
router.get('/history', async (req, res) => {
    try {
        const cities = await HistoryService.getCities();
        res.json(cities);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to retrieve search history' });
    }
});
// * BONUS TODO: DELETE city from search history
router.delete('/history/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await HistoryService.removeCity(id);
        res.status(200).json({ message: 'City removed successfully' });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to delete city' });
    }
});
export default router;
