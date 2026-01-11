import { searchForCity } from "../api/location.js";

const dialog = document.getElementById("search-dialog");
const form = dialog.querySelector("form");
const input = form.querySelector("input[name='city']");
const loading = form.querySelector("#loading");
const resultsContainer = form.querySelector("#search-results");

function renderResult(data) {
    if (data.length === 0) {
        resultsContainer.innerHTML = "<p>No results found</p>";
        return;
    }
    resultsContainer.innerHTML = "";
    const list = document.createElement("ul");
    data.forEach((item) => {
        const listItem = document.createElement("li");
        listItem.innerHTML = `
            <button class="w-full flex items-center gap-3 p-3 hover:bg-gray-100 rounded-lg transition-colors text-left border border-transparent hover:border-gray-200" data-info="${encodeURIComponent(
            JSON.stringify(item)
        )}">
                <img class="w-8 h-6 object-cover rounded shadow-sm" src="https://flagsapi.com/${item.country_code
            }/flat/32.png" alt="${item.country} flag">
                <div class="flex-1 min-w-0">
                    <p class="font-medium truncate">${item.city}</p>
                    <p class="text-sm truncate">${item.state ?? ""}, ${item.country ?? ""
            }</p>
                </div>
            </button>
        `;
        list.appendChild(listItem);
    });
    resultsContainer.appendChild(list);
}

let timer; // Debounce timer to prevent excessive API calls
function handleInput() {
    clearTimeout(timer); // Clear previous timer
    resultsContainer.innerHTML = "";

    const value = input.value.trim();
    if (value.length < 2) {
        // Minimum characters for meaningful search
        resultsContainer.innerHTML =
            "<p>Please enter at least 2 characters</p>";
        loading.classList.add("hidden");
        return;
    }

    loading.classList.remove("hidden");
    // Debounce search by 300ms to avoid excessive API calls while typing
    timer = setTimeout(async () => {
        const results = await searchForCity(value);
        renderResult(results);
        loading.classList.add("hidden");
    }, 300);
}

function getLocationFromCity() {
    return new Promise((resolve) => {
        form.addEventListener("input", handleInput);
        form.addEventListener(
            "submit",
            (evt) => {
                const button = evt.submitter; // Get the specific button that triggered submit
                // Decode the location data from the button's dataset
                const info = JSON.parse(
                    decodeURIComponent(button.dataset.info)
                );
                resolve(info);
            },
            { once: true } // Remove listener after first use
        );

        form.querySelector("#close-search").addEventListener(
            "click",
            () => dialog.close(),
            { once: true }
        );

        // Prevent form submission on Enter key to avoid premature selection
        function preventEnter(evt) {
            if (evt.key === "Enter") {
                evt.preventDefault();
                return;
            }
        }

        input.addEventListener("keydown", preventEnter);

        // Clean up event listeners and reset state when dialog closes
        dialog.addEventListener(
            "close",
            () => {
                form.removeEventListener("input", handleInput);
                input.removeEventListener("keydown", preventEnter);
                form.reset();
                resultsContainer.innerHTML = "";
                loading.classList.add("hidden");
                clearTimeout(timer); // Clear any pending debounced search
                resolve(null); // Resolve with null if dialog was closed without selection
            },
            { once: true }
        );

        dialog.showModal(); // Open the modal dialog
        input.focus(); // Focus input for immediate typing
    });
}

export { getLocationFromCity };