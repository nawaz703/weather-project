const images = {
    clouds: "./images/clouds.png",
    clearDay: "./images/clear-day.png",
    clearNight: "./images/clear-night.png",
    rain: "./images/rain.jpg",
    snow: "./images/snow.png",
    thunderstorm: "./images/thunderstorm.png",
    drizzle: "./images/rain.jpg",
}

function setBackground(condition, isDay) {
    const body = document.body;
    if (condition.toLowerCase() === "clear") {
        body.style.backgroundImage = isDay
            ? `url(${images.clearDay})`
            : `url(${images.clearNight})`;
    } else {
        body.style.backgroundImage = `url(${images[condition.toLowerCase()]})`;
    }
    body.classList.add("bg-fixed");
}

export { setBackground };