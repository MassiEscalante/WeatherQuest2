import express from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';
dotenv.config();

// Import the routes
import routes from './routes/index.js';

const app = express();
const PORT = process.env.PORT || 3001;

// Create __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve static files from client/dist folder
app.use(express.static(path.join(__dirname, '../../client/dist'))); // Adjusted path for ES modules

// Middleware for parsing JSON and urlencoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Use routes
app.use(routes);

// Start the server
app.listen(PORT, () => console.log(`Listening on PORT: ${PORT}`));
