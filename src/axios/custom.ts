import axios from "axios";

/**
 * Custom Axios client instance preconfigured for the eCommerce store's backend API.
 * Reads configurations dynamically from Vite environment variables.
 */
const customFetch = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "http://localhost:8000/api",
    headers: {
        Accept: "application/json"
    }
})

export default customFetch;