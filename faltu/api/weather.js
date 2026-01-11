import { toast } from "../ui/toast.js";

const WEATHER_API_KEY = "d3d175e8b848468220e5e437ef7601c3";
//const WEATHER_API_KEY = "72614cb1266545b8938121711260601";

let units = "metric"; // metric or imperial

function currentWeatherApiEndpoint(lat, lon) {
    return `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=${units}&appid=${WEATHER_API_KEY}`;
}
//http://api.weatherapi.com/v1/current.json?key=72614cb1266545b8938121711260601&q=London&aqi=yes
function forecastWeatherApiEndpoint(lat, lon) {
    return `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=${units}&appid=${WEATHER_API_KEY}`;
}

function reverseGeoCodingApiEndpoint(lat, lon, limit = 5) {
    return `https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=${limit}&appid=${WEATHER_API_KEY}`;
}

// Current Weather
const CURRENT_WEATHER_CACHE = []; // 10min

async function getCurrentWeather(lat, lon) {
    const DURATION = 1000 * 60 * 10; // 10min cache duration
    // Search for cached data with matching coordinates and units
    const index = CURRENT_WEATHER_CACHE.findIndex(
        (item) =>
            item.units === units &&
            // Round coordinates to 4 decimal places for comparison (avoids floating point precision issues)
            Math.round(item.query.lat * 10000) ===
            Math.round(Number(lat) * 10000) &&
            Math.round(item.query.lon * 10000) ===
            Math.round(Number(lon) * 10000)
    );
    // Return cached data if found and still valid (within 10 minutes)
    if (
        index !== -1 &&
        CURRENT_WEATHER_CACHE[index].time + DURATION > Date.now()
    ) {
        return CURRENT_WEATHER_CACHE[index];
    }
    try {
        const response = await fetch(currentWeatherApiEndpoint(lat, lon));
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        // Add metadata to cached data: units, timestamp for cache validation
        const newData = {
            ...data,
            units,
            query: { lat, lon },
            time: Date.now(),
        };

        // Update existing cache entry or add new one
        if (index !== -1) {
            CURRENT_WEATHER_CACHE[index] = newData;
        } else {
            CURRENT_WEATHER_CACHE.push(newData);
        }

        return newData;
    } catch (error) {
        toast.error("Error fetching current weather data.");
        return null;
    }
}

// Forecast Weather
const FORECAST_WEATHER_CACHE = []; // 3hr

async function getForecastWeather(lat, lon) {
    const DURATION = 1000 * 60 * 60 * 3; // 3hr cache duration
    // Find cached forecast data for the same location and units
    const index = FORECAST_WEATHER_CACHE.findIndex(
        (item) =>
            item.units === units &&
            // Round coordinates to 4 decimal places for precise comparison
            Math.round(item.query.lat * 10000) ===
            Math.round(Number(lat) * 10000) &&
            Math.round(item.query.lon * 10000) ===
            Math.round(Number(lon) * 10000)
    );
    // Return cached forecast if found and still valid (within 3 hours)
    if (
        index !== -1 &&
        FORECAST_WEATHER_CACHE[index].time + DURATION > Date.now()
    ) {
        return FORECAST_WEATHER_CACHE[index];
    }
    try {
        const response = await fetch(forecastWeatherApiEndpoint(lat, lon));
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        // Add metadata for cache management: units and timestamp
        const newData = {
            ...data,
            units,
            query: { lat, lon },
            time: Date.now(),
        };
        // Update existing cache entry or create new one
        if (index !== -1) {
            FORECAST_WEATHER_CACHE[index] = newData;
        } else {
            FORECAST_WEATHER_CACHE.push(newData);
        }

        return newData;
    } catch (error) {
        toast.error("Error fetching forecast weather data.");
        return null;
    }
}

function toggleUnits() {
    units = units === "metric" ? "imperial" : "metric";
    return units;
}

function getUnits() {
    return units;
}

export {
    getCurrentWeather,
    getForecastWeather,
    reverseGeoCodingApiEndpoint,
    toggleUnits,
    getUnits,
};