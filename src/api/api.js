export const apiClient = (url, method, body = undefined, other = {}) => {
    return fetch(`http://localhost:2300/${url}`, {
        method,
        body,
        headers: {
            "Content-Type": "application/json",
        },
        ...other
    });
}
