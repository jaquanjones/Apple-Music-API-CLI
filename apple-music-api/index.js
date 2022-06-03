const axios = require("axios");

// a config file to hold our base URL (or any applicable API keys or authentication)
const config = require("./config.json");

const instance = axios.create({
    baseURL: config.url,
    headers: config.headers,
});

const searchAppleMusic = async (type, search, resultLimit) => {
    console.log(`\nSearching ${type} for "${search}"..`);
    try {
        // endpoint which allows for searching by accepting a keyword/term
        // and returns a list of results associated to that keyword/term
        const response = await instance.get("/search", {
            params: {
                types: type,
                term: search,
                limit: resultLimit,
            },
        });

        return response.data;
    } catch (error) {
        return error;
    }
};

const songDetails = async (songId) => {
    try {
        // endpoint which allows for getting detailed data on a single item by song ID
        const response = await instance.get(`/songs/${songId}`);
        return response.data;
    } catch (error) {
        return error;
    }
};

// export the functions to be used in the apple-music-app CLI
module.exports = {
    searchAppleMusic,
    songDetails,
};
