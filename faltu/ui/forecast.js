import { getWeatherIcon } from "./icon.js";
import { getUnits } from "../api/weather.js";

const section = document.getElementById("forecast-weather");

function renderHourlyForecast(list) {
    const ul = document.createElement("ul");
    ul.className = "flex space-x-4 overflow-x-auto pb-4";
    list.forEach((item) => {
        const li = document.createElement("li");
        const date = new Date(item.dt * 1000);
        const time = date.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
        });
        const temp = Math.round(item.main.temp);
        const icon = getWeatherIcon(item.weather[0]);
        const description = item.weather[0].description;

        li.innerHTML = `
            <div class="flex flex-col items-center justify-between text-center rounded-lg p-4 bg-primary/50 min-w-[120px]">
                <p class="text-sm whitespace-nowrap font-medium">${time}</p>
                <span class="text-3xl my-2">${icon}</span>
                <p class="text-lg font-bold">${temp}°</p>
                <p class="text-xs text-gray-700 capitalize">${description}</p>
            </div>
        `;
        ul.appendChild(li);
    });
    return ul.outerHTML;
}

function renderDailyForecast(list) {
    const dailyData = {}; // Object to store aggregated daily weather data

    // Process hourly data and group by date
    list.forEach((item) => {
        const date = new Date(item.dt * 1000); // Convert Unix timestamp to Date
        const day = date.toLocaleDateString([], {
            weekday: "short",
            month: "short",
            day: "numeric",
        });
        // Use first occurrence of each day to represent daily forecast
        if (!dailyData[day]) {
            dailyData[day] = {
                temp: Math.round(item.main.temp),
                icon: getWeatherIcon(item.weather[0]),
                description: item.weather[0].description,
                tempMin: Math.round(item.main.temp_min),
                tempMax: Math.round(item.main.temp_max),
                humidity: item.main.humidity,
                pressure: item.main.pressure,
                windSpeed: Math.round(item.wind.speed),
                visibility: item.visibility,
            };
        }
    });

    const ul = document.createElement("ul");
    ul.className =
        "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 justify-center items-center gap-4";
    // Create forecast cards for each day
    for (const [day, data] of Object.entries(dailyData)) {
        const li = document.createElement("li");
        li.innerHTML = `
            <div class="bg-primary/50 p-4 rounded-lg">
                <p class="text-lg font-medium text-center mb-4">${day}</p>
                
                <!-- Main weather info -->
                <div class="grid grid-cols-2 gap-4 mb-4">
                    <div class="flex flex-col items-center">
                        <span class="text-5xl">${data.icon}</span>
                        <p class="text-sm text-gray-700 capitalize text-center">${
                            data.description
                        }</p>
                    </div>
                    <div class="flex flex-col justify-center items-center gap-2">
                        <p class="text-2xl font-bold">${data.temp}&deg;</p>
                        <div>
                            <span class="text-red-500"><i class="fi fi-rc-arrow-trend-up"></i></span>
                            <span>${data.tempMax}°</span>
                            <span class="text-blue-500 ml-2"><i class="fi fi-rc-arrow-trend-down"></i></span>
                            <span>${data.tempMin}°</span>
                        </div>
                    </div>
                </div>
                
                <!-- Additional weather data -->
                <div class="grid grid-cols-2 gap-2 text-center text-sm">
                    <div class="bg-white/20 p-2 rounded">
                        <span class="text-blue-500"><i class="fi fi-rc-humidity"></i></span>
                        <p class="font-medium">${data.humidity}%</p>
                        <p class="text-xs text-gray-600">Humidity</p>
                    </div>
                    <div class="bg-white/20 p-2 rounded">
                        <span class="text-green-500"><i class="fi fi-rc-wind"></i></span>
                        <p class="font-medium">${data.windSpeed} ${
            getUnits() === "metric" ? "m/s" : "mph"
        }</p>
                        <p class="text-xs text-gray-600">Wind</p>
                    </div>
                    <div class="bg-white/20 p-2 rounded">
                        <span class="text-blue-500"><i class="fi fi-rc-water-lower"></i></span>
                        <p class="font-medium">${data.pressure} hPa</p>
                        <p class="text-xs text-gray-600">Pressure</p>
                    </div>
                    <div class="bg-white/20 p-2 rounded">
                        <span class="text-yellow-500"><i class="fi fi-rc-eyes"></i></span>
                        <p class="font-medium">${(
                            data.visibility / 1000
                        ).toFixed(1)} km</p>
                        <p class="text-xs text-gray-600">Visibility</p>
                    </div>
                </div>
            </div>
        `;
        ul.appendChild(li);
    }
    return ul.outerHTML;
}

function renderForecastWeather(data) {
    section.innerHTML = `
        <h2 class="text-2xl mt-4 font-bold">
            <span class=" text-yellow-500 align-middle"><i class="fi fi-rc-clock-five"></i></span>
            Hourly Forecast
        </h2>
        <div class="">
            ${renderHourlyForecast(data.forecast.list)}
        </div>
        <h2 class="text-2xl mt-4 font-bold">
            <span class=" text-blue-500 align-middle"><i class="fi fi-rc-calendar"></i></span>
            Daily Forecast
        </h2>
        <div>
            ${renderDailyForecast(data.forecast.list)}
        </div>
    `;
}

export { renderForecastWeather };