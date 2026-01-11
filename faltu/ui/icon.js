function getWeatherIcon(weather) {
    const code = weather.id;
    if (code >= 200 && code < 300) {
        return "⛈️"; // Thunderstorm
    } else if (code >= 300 && code < 500) {
        if (weather.icon.endsWith("d")) {
            return "🌦️"; // Drizzle day
        }
        return "🌧️"; // Drizzle night
    } else if (code >= 500 && code < 600) {
        return "🌧️"; // Rain
    } else if (code >= 600 && code < 700) {
        return "❄️"; // Snow
    } else if (code >= 700 && code < 800) {
        return "🌫️"; // Atmosphere
    } else if (code === 800) {
        if (weather.icon.endsWith("d")) {
            return "☀️"; // Clear day
        }
        return "🌙"; // Clear night
    } else if (code === 801) {
        if (weather.icon.endsWith("d")) {
            return "🌤️"; // Few clouds day
        }
        return "🌥️"; // Few clouds night
    } else if (code === 802) {
        if (weather.icon.endsWith("d")) {
            return "⛅"; // Scattered clouds day
        }
        return "☁️"; // Scattered clouds night
    } else if (code === 803 || code === 804) {
        return "☁️"; // Broken/Overcast clouds
    }
}

export { getWeatherIcon };