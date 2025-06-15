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

export const fetchLeagueStandings = async (leagueId) => {
    try {
        console.log("Fetching standings for leagueId:", leagueId);
        const response = await axios.get(`http://localhost:3000/leagues/${leagueId}/standings`);
        return response.data;
    } catch (error) {
        console.error("Failed to fetch standings:", error);
        return null;
    }
};

export const fetchLeagueFixtures = async (leagueId) => {
    try {
        const response = await axios.get(`http://localhost:3000/leagues/${leagueId}/fixtures`);

        return response.data;
    } catch (error) {
        console.error("Failed to fetch league fixtures:",error);
        return null;
    }
};
