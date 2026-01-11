/**
 * Loading indicator utility for weather sections
 */
function isLoading(sectionId) {
    const section = document.getElementById(sectionId);
    return section && section.querySelector("[data-loading='true']");
}

function showLoading(sectionId, message = "Loading weather data...") {
    const section = document.getElementById(sectionId);
    if (!section) return;

    // Only show loading if not already showing
    if (isLoading(sectionId)) return;

    section.innerHTML = `
        <div class="flex flex-col items-center justify-center p-8 min-h-[200px]" data-loading="true">
            <div class="relative">
                <div class="w-16 h-16 border-4 border-primary/30 rounded-full"></div>
                <div class="w-16 h-16 border-4 border-t-primary border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin absolute top-0 left-0"></div>
            </div>
            <p class="mt-4 text-lg font-medium text-gray-600">${message}</p>
        </div>
    `;
}

export { showLoading };