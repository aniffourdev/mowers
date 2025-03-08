// Base URL for /wp/v2 endpoints
const BASE_URL = `${process.env.NEXT_PUBLIC_ENDPOINT}/wp-json/wp/v2/`;

// Base URL for /custom/v1 endpoints
const CUSTOM_BASE_URL = `${process.env.NEXT_PUBLIC_ENDPOINT}/wp-json/custom/v1/`;

// Fetch data from /wp/v2 endpoints
export const fetchData = async <T>(endpoint: string): Promise<T> => {
    const response = await fetch(`${BASE_URL}${endpoint}`);
    if (!response.ok) {
        throw new Error("Failed to fetch data");
    }
    return response.json();
};

// Fetch data from /custom/v1 endpoints
export const fetchCustomData = async <T>(endpoint: string): Promise<T> => {
    const response = await fetch(`${CUSTOM_BASE_URL}${endpoint}`);
    if (!response.ok) {
        throw new Error("Failed to fetch data");
    }
    return response.json();
};