import { getWeatherIcon } from "./icon.js";
import { getUnits } from "../api/weather.js";

const section = document.getElementById("current-weather");

function generateWeatherAlerts(current, units) {
    const alerts = [];
    const temp = current.main.temp;
    const humidity = current.main.humidity;
    const windSpeed = current.wind.speed;
    const visibility = current.visibility / 1000; // Convert meters to kilometers
    const weatherMain = current.weather[0].main.toLowerCase();

    // Temperature alerts - different thresholds for metric vs imperial
    if (units === "metric") {
        if (temp >= 40) {
            // Extreme heat in Celsius
            alerts.push({
                type: "danger",
                icon: "fi fi-rc-temperature-high",
                message: `Extreme Heat Warning: ${Math.round(
                    temp
                )}°C - Stay hydrated and avoid prolonged sun exposure`,
            });
        } else if (temp >= 35) {
            // High temperature warning in Celsius
            alerts.push({
                type: "warning",
                icon: "fi fi-rc-temperature-high",
                message: `High Temperature Alert: ${Math.round(
                    temp
                )}°C - Take precautions when outdoors`,
            });
        } else if (temp <= -10) {
            // Extreme cold in Celsius
            alerts.push({
                type: "danger",
                icon: "fi fi-rc-temperature-low",
                message: `Extreme Cold Warning: ${Math.round(
                    temp
                )}°C - Risk of frostbite, dress warmly`,
            });
        } else if (temp <= 0) {
            // Freezing point in Celsius
            alerts.push({
                type: "warning",
                icon: "fi fi-rc-temperature-low",
                message: `Freezing Temperature: ${Math.round(
                    temp
                )}°C - Watch for icy conditions`,
            });
        }

        // Wind speed alerts for metric units (m/s)
        if (windSpeed >= 20) {
            // Severe wind in m/s
            alerts.push({
                type: "danger",
                icon: "fi fi-rc-wind",
                message: `Severe Wind Warning: ${Math.round(
                    windSpeed
                )} m/s - Dangerous conditions, stay indoors`,
            });
        } else if (windSpeed >= 10) {
            // High wind advisory in m/s
            alerts.push({
                type: "warning",
                icon: "fi fi-rc-wind",
                message: `High Wind Advisory: ${Math.round(
                    windSpeed
                )} m/s - Be cautious outdoors`,
            });
        }
    } else {
        // Imperial units - convert thresholds to Fahrenheit and mph
        if (temp >= 104) {
            // 40°C converted to Fahrenheit
            alerts.push({
                type: "danger",
                icon: "fi fi-rc-temperature-high",
                message: `Extreme Heat Warning: ${Math.round(
                    temp
                )}°F - Stay hydrated and avoid prolonged sun exposure`,
            });
        } else if (temp >= 95) {
            // 35°C converted to Fahrenheit
            alerts.push({
                type: "warning",
                icon: "fi fi-rc-temperature-high",
                message: `High Temperature Alert: ${Math.round(
                    temp
                )}°F - Take precautions when outdoors`,
            });
        } else if (temp <= 14) {
            // -10°C converted to Fahrenheit
            alerts.push({
                type: "danger",
                icon: "fi fi-rc-temperature-low",
                message: `Extreme Cold Warning: ${Math.round(
                    temp
                )}°F - Risk of frostbite, dress warmly`,
            });
        } else if (temp <= 32) {
            // Freezing point in Fahrenheit
            alerts.push({
                type: "warning",
                icon: "fi fi-rc-temperature-low",
                message: `Freezing Temperature: ${Math.round(
                    temp
                )}°F - Watch for icy conditions`,
            });
        }

        // Wind speed alerts for imperial units (mph)
        if (windSpeed >= 45) {
            // ~20 m/s converted to mph
            alerts.push({
                type: "danger",
                icon: "fi fi-rc-wind",
                message: `Severe Wind Warning: ${Math.round(
                    windSpeed
                )} mph - Dangerous conditions, stay indoors`,
            });
        } else if (windSpeed >= 22) {
            // ~10 m/s converted to mph
            alerts.push({
                type: "warning",
                icon: "fi fi-rc-wind",
                message: `High Wind Advisory: ${Math.round(
                    windSpeed
                )} mph - Be cautious outdoors`,
            });
        }
    }

    // Humidity alerts - same thresholds for both unit systems
    if (humidity >= 85) {
        // High humidity threshold
        alerts.push({
            type: "info",
            icon: "fi fi-rc-humidity",
            message: `High Humidity: ${humidity}% - May feel uncomfortable, stay cool`,
        });
    } else if (humidity <= 20) {
        // Low humidity threshold
        alerts.push({
            type: "info",
            icon: "fi fi-rc-humidity",
            message: `Low Humidity: ${humidity}% - Stay hydrated, use moisturizer`,
        });
    }

    // Visibility alerts - poor visibility conditions
    if (visibility <= 1) {
        // Less than 1km visibility
        alerts.push({
            type: "warning",
            icon: "fi fi-rc-eyes",
            message: `Poor Visibility: ${visibility.toFixed(
                1
            )} km - Drive carefully, use headlights`,
        });
    }

    // Weather condition alerts - specific weather phenomena
    if (weatherMain.includes("thunder")) {
        alerts.push({
            type: "warning",
            icon: "fi fi-rc-bolt",
            message:
                "Thunderstorm Alert - Seek shelter, avoid outdoor activities",
        });
    } else if (weatherMain.includes("snow")) {
        alerts.push({
            type: "info",
            icon: "fi fi-rc-snowflake",
            message:
                "Snow Conditions - Drive carefully, wear appropriate footwear",
        });
    } else if (weatherMain.includes("rain")) {
        alerts.push({
            type: "info",
            icon: "fi fi-rc-raindrops",
            message: "Rainy Weather - Carry an umbrella, drive with caution",
        });
    }

    return alerts;
}

function renderWeatherAlerts(alerts) {
    if (alerts.length === 0) return "";

    const alertsHtml = alerts
        .map((alert) => {
            const alertColors = {
                danger: "bg-red-100 border-red-500 text-red-800",
                warning: "bg-yellow-100 border-yellow-500 text-yellow-800",
                info: "bg-blue-100 border-blue-500 text-blue-800",
            };

            const iconColors = {
                danger: "text-red-600",
                warning: "text-yellow-600",
                info: "text-blue-600",
            };

            return `
            <div class="flex items-start gap-3 p-3 rounded-lg border-l-4 ${
                alertColors[alert.type]
            } mb-2">
                <span class="${iconColors[alert.type]} text-xl"><i class="${
                alert.icon
            }"></i></span>
                <p class="text-sm font-medium">${alert.message}</p>
            </div>
        `;
        })
        .join("");

    return `
        <div class="mb-6">
            <h3 class="text-lg font-bold mb-3 flex items-center gap-2">
                <span class="text-orange-500"><i class="fi fi-rc-triangle-warning"></i></span>
                Weather Alerts
            </h3>
            ${alertsHtml}
        </div>
    `;
}

function renderCurrentWeather(data) {
    const { location, current } = data;

    // Generate weather alerts
    const alerts = generateWeatherAlerts(current, getUnits());
    const alertsHtml = renderWeatherAlerts(alerts);

    section.innerHTML = `
    <div class="flex justify-between items-center">
        <div>
            <h2 class="text-2xl md:text-4xl font-bold">${location.city}</h2>
            <p>${new Date(current.time).toDateString()}</p>
        </div>
        <span class="text-7xl md:text-9xl">${getWeatherIcon(
            current.weather[0]
        )}</span>
    </div>
    <div class=" flex items-center justify-center gap-4 md:gap-8">
        <p class="text-7xl md:text-9xl font-bold">${Math.round(
            current.main.temp
        )}°</p>
        <div class="text-xl md:text-2xl">
            <p>${current.weather[0].description}</p>
            <p>Feels like ${Math.round(current.main.feels_like)}°</p>
            <p><span class="text-blue-500"><i class="fi fi-rc-arrow-trend-down"></i></span> ${Math.round(
                current.main.temp_min
            )}° <span class="ml-2 text-red-500"><i class="fi fi-rc-arrow-trend-up"></i></span> ${Math.round(
        current.main.temp_max
    )}°</p>
        </div>
    </div>
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 lg:gap-16 text-center">
        <div class="bg-primary/50 p-4 rounded-lg">
            <span class="text-blue-500 text-3xl"><i class="fi fi-rc-humidity"></i></span>
            <p class="text-xl">${current.main.humidity}%</p>
            <p class="text-gray-700">Humidity</p>
        </div>
        <div class="bg-primary/50 p-4 rounded-lg">
            <span class="text-green-500 text-3xl"><i class="fi fi-rc-wind"></i></span>
            <p class="text-xl">${Math.round(current.wind.speed)} ${
        getUnits() === "metric" ? "m/s" : "mph"
    }</p>
            <p class="text-gray-700">Wind Speed</p>
        </div>
        <div class="bg-primary/50 p-4 rounded-lg">
            <span class="text-blue-500 text-3xl"><i class="fi fi-rc-water-lower"></i></span>
            <p class="text-xl">${current.main.pressure} hPa</p>
            <p class="text-gray-700">Pressure</p>
        </div>
        <div class="bg-primary/50 p-4 rounded-lg">
            <span class="text-yellow-500 text-3xl"><i class="fi fi-rc-eyes"></i></span>
            <p class="text-xl">${Math.round(current.visibility / 1000)} km</p>
            <p class="text-gray-700">Visibility</p>
        </div>
    </div>
    <div class="flex items-center justify-around p-4 md:w-1/2 md:mx-auto text-center rounded-lg bg-primary/50">
        <div class=" ">
            <span class="text-4xl text-orange-500"><i class="fi fi-rc-sunrise-alt"></i></span>
            <p class="">${new Date(
                current.sys.sunrise * 1000
            ).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
            })}</p>
            <p class="text-gray-700">Sunrise</p>
        </div>
        <div class="">
            <span class="text-4xl text-amber-500"><i class="fi fi-rc-sunset"></i></span>
            <p class="">${new Date(
                current.sys.sunset * 1000
            ).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
            })}</p>
            <p class="text-gray-700">Sunset</p>
        </div>
    </div>
    ${alertsHtml}
    `;
}

export { renderCurrentWeather };