import axios from "axios";

export const fetchTodayMatches = async () => {
    try {
        const response = await axios.get("http://localhost:3000/fixtures/today");
        return response.data.response;
    } catch (error) {
        console.error("Failed to fetch fixtures:",error);
        return[];
    }
};

export const fetchFixtureDetails = async (fixtureId) => {
    try {
        const response = await axios.get(`http://localhost:3000/fixtures/${fixtureId}`);
        return response.data.response[0];
    } catch (error) {
        console.error("Failed to fetch match details:",error);
        return null;
    }
};
