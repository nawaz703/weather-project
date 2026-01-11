// Toast notification system
let toastContainer = null;

// Create toast container if it doesn't exist
function createToastContainer() {
    if (!toastContainer) {
        toastContainer = document.createElement("div");
        toastContainer.id = "toast-container";
        toastContainer.className = "fixed top-4 right-4 z-50 space-y-2";
        document.body.appendChild(toastContainer);
    }
    return toastContainer;
}

function showToast(message, type = "info", duration = 5000) {

    const container = createToastContainer();

    const toast = document.createElement("div");
    toast.className = `
        flex items-start gap-3 p-4 rounded-lg shadow-lg transform transition-all duration-300 ease-in-out
        translate-x-full opacity-0 max-w-sm min-w-[300px]
    `;

    const toastStyles = {
        error: {
            bg: "bg-red-100 border border-red-200",
            text: "text-red-800",
            icon: "fi fi-rc-cross-circle text-red-600",
        },
        warning: {
            bg: "bg-yellow-100 border border-yellow-200",
            text: "text-yellow-800",
            icon: "fi fi-rc-triangle-warning text-yellow-600",
        },
        success: {
            bg: "bg-green-100 border border-green-200",
            text: "text-green-800",
            icon: "fi fi-rc-check-circle text-green-600",
        },
        info: {
            bg: "bg-blue-100 border border-blue-200",
            text: "text-blue-800",
            icon: "fi fi-rc-info text-blue-600",
        },
    };

    const style = toastStyles[type] || toastStyles.info;
    toast.className += ` ${style.bg} ${style.text}`;

    toast.innerHTML = `
        <span class="text-xl flex-shrink-0">
            <i class="${style.icon}"></i>
        </span>
        <div class="flex-1">
            <p class="text-sm font-medium">${message}</p>
        </div>
    `;

    container.appendChild(toast);

    // Animate in
    setTimeout(() => {
        toast.classList.remove("translate-x-full", "opacity-0");
        toast.classList.add("translate-x-0", "opacity-100");
    }, 100);

    // Auto remove after duration
    if (duration > 0) {
        setTimeout(() => {
            removeToast(toast);
        }, duration);
    }

    return toast;
}

// Remove toast with animation
function removeToast(toast) {
    if (toast && toast.parentElement) {
        toast.classList.add("translate-x-full", "opacity-0");
        setTimeout(() => {
            if (toast.parentElement) {
                toast.remove();
            }
        }, 300);
    }
}

const toast = {
    error: (message, duration = 5000) => showToast(message, "error", duration),
    warning: (message, duration = 5000) =>
        showToast(message, "warning", duration),
    success: (message, duration = 3000) =>
        showToast(message, "success", duration),
    info: (message, duration = 4000) => showToast(message, "info", duration),
};


export { toast, showToast };