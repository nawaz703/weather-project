const STORAGE_KEY = "recentCities";

const recentCitiesSelect = document.getElementById("recent-cities");

function getRecentCities() {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
}

function addRecentCity(city) {
    const cities = getRecentCities();

    // Check if city already exists using coordinates or city/country match
    const exists = cities.some(
        (existingCity) =>
            (existingCity.latitude === city.latitude &&
                existingCity.longitude === city.longitude) ||
            (existingCity.city === city.city &&
                existingCity.country === city.country)
    );

    if (!exists) {
        cities.unshift(city); // Add new city to beginning of array

        // Maintain maximum of 5 recent cities
        if (cities.length > 5) {
            cities.pop(); // Remove oldest city
        }

        localStorage.setItem(STORAGE_KEY, JSON.stringify(cities));
        renderOptions(); // Re-render the options when a new city is added
    } else {
        // Move the existing city to the top (most recent)
        const updatedCities = cities.filter(
            (existingCity) =>
                !(
                    (existingCity.latitude === city.latitude &&
                        existingCity.longitude === city.longitude) ||
                    (existingCity.city === city.city &&
                        existingCity.country === city.country)
                )
        );
        updatedCities.unshift(city); // Add to front
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedCities));
        renderOptions(); // Re-render the options when a city is moved to top
    }
}

function renderOptions() {
    const cities = getRecentCities();
    recentCitiesSelect.innerHTML =
        '<option value="" disabled selected>Recent Cities</option>';

    cities.forEach((city) => {
        const option = document.createElement("option");
        option.value = JSON.stringify(city);
        option.textContent = `${city.city}, ${city.country}`;
        recentCitiesSelect.appendChild(option);
    });

    // Show/hide the select based on whether there are recent cities
    if (cities.length === 0) {
        recentCitiesSelect.style.display = "none";
    } else {
        recentCitiesSelect.style.display = "block";
    }
}

// Set up event listener that dispatches custom event
function setupRecentCitiesHandler() {
    recentCitiesSelect.addEventListener("change", (event) => {
        if (event.target.value) {
            // Parse the selected city data from JSON string
            const selectedCity = JSON.parse(event.target.value);

            // Dispatch custom event for loose coupling between components
            const customEvent = new CustomEvent("citySelected", {
                detail: selectedCity,
            });
            document.dispatchEvent(customEvent);

            // Reset the select to the default option for better UX
            recentCitiesSelect.selectedIndex = 0;
        }
    });
}

// Initialize the recent cities select on page load
function initRecentCities() {
    setupRecentCitiesHandler();
    renderOptions();
}

export { addRecentCity, initRecentCities };