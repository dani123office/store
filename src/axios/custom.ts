import axios from "axios";

/**
 * Custom Axios client instance preconfigured for the eCommerce store's backend API.
 * Reads configurations dynamically from Vite environment variables.
 */
const customFetch = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "https://store-production-3fb2.up.railway.app/api",
    headers: {
        Accept: "application/json"
    }
})

export default customFetch;