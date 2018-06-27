
const axios = require("axios");

export async function getJsonData<T>(url: string, converter?: { (input: any): T }): Promise<T> {
    try {
        const response = await axios.default.get(url);
        return converter ? converter(response.data) : response.data as T;
    } catch (error) {
        throw new Error("[Provider] Failed to fetch data from: " + url + "\nError: " + error);
    }

}
