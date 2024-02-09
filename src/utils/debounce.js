const timeouts = {};

export function debounce(fnc, delayMs, id = "default") {
    clearTimeout(timeouts[id]);
    timeouts[id] = setTimeout(() => {
        fnc();
    }, delayMs || 1000);
}
