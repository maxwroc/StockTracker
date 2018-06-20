
const axios = require("axios");

export async function getJsonData<T>(url: string): Promise<T> {
    try {
        const response = await axios.default.get(url);
        return response.data as T;
    } catch (error) {
        throw new Error("[Provider] Failed to fetch data from: " + url + "\nError: " + error);
    }

}
