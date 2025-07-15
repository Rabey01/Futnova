import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL;

export const fetchTodayMatches = async (timezone,date) => {
    try {
        const response = await axios.get(`${BASE_URL}/fixtures/today?timezone=${encodeURIComponent(timezone)}&date=${date}`);
        return response.data.response;
    } catch (error) {
        console.error("Failed to fetch fixtures:",error);
        return[];
    }
};

export const fetchFixtureDetails = async (fixtureId) => {
    try {
        const response = await axios.get(`${BASE_URL}/fixtures/${fixtureId}`);
        return response.data.response[0];
    } catch (error) {
        console.error("Failed to fetch match details:",error);
        return null;
    }
};

export const fetchLeagueStandings = async (leagueId) => {
    try {
        const response = await axios.get(`${BASE_URL}/leagues/${leagueId}/standings`);
        return response.data;
    } catch (error) {
        console.error("Failed to fetch standings:", error);
        return null;
    }
};

export const fetchLeagueFixtures = async (leagueId) => {
    try {
        const response = await axios.get(`${BASE_URL}/leagues/${leagueId}/fixtures`);
        return response.data;
    } catch (error) {
        console.error("Failed to fetch league fixtures:",error);
        return null;
    }
};
