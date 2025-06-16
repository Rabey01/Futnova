import { useState, useEffect} from "react";
import { fetchTodayMatches } from "../../Api";
import MatchCard from "../Components/MatchCard";

const selectedTopLeagueIds = [
  1, 2, 3, 4, 5, 7, 9, 15, 848, 531, 29, 30, 31, 32, 33, 34, 13,      // 🌍 International / Continental
  140, 39, 135, 78, 61, 45, 143, 735, 137,       // 🇪🇺 Big Five + Cups
  10, 667, //Friendlies world + clubs
  88, 94, 144, 203, 179, 197, 207,             // 🇪🇺 Other European Leagues
  253, 262, 128, 11,                       // 🌎 Americas
  98, 292, 323, 307, 188                       // 🌏 Asia + Others
];

const leagueIds = [
  1, 2, 3, 4, 5, 7, 9, 10, 11, 12, 13, 15, 16, 17, 18, 29, 30, 31, 32, 33, 34, 39, 41, 42, 45, 61, 62, 65,
  71, 72, 75, 76, 78, 79, 81, 88, 89, 94, 98, 99, 102, 103, 106, 113,
  119, 128, 129, 130, 131, 132, 134, 135, 136, 137, 140, 141, 143, 144,
  169, 179, 180, 188, 197, 203, 207, 210, 218, 235, 239, 243, 253, 255,
  262, 265, 266, 268, 274, 281, 283, 286, 288, 290, 292, 296, 305,
  307, 323, 332, 333, 345, 369, 489, 531, 545, 667, 711, 735, 848
];

export default function Home () {
    const [matchesByLeague, setMatchesByLeague] = useState({});


    useEffect (() => {
        const loadMatches = async () => {
            const storedData = sessionStorage.getItem("todayMatches");

            let matches = [];

           if (storedData) {
                matches = JSON.parse(storedData);
            } else {
                const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
                matches = await fetchTodayMatches(timezone);
                sessionStorage.setItem("todayMatches", JSON.stringify(matches));
            }

           // Filter matches by supported league IDs 
           const filtered = matches.filter(match =>
                leagueIds.includes(match.league.id)
            );

            // Sort: Top leagues first
            filtered.sort((a,b) => {
                const aIndex = selectedTopLeagueIds.indexOf(a.league.id);
                const bIndex = selectedTopLeagueIds.indexOf(b.league.id);

                if (aIndex !== -1 && bIndex !== -1) return aIndex - bIndex;
                if (aIndex !== -1) return -1;
                if (bIndex !== -1) return 1;
                return a.league.country.localeCompare(b.league.country);
            });

            // Group by league name
            const grouped = {};
            for (const match of filtered) {
                const key = `${match.league.country} - ${match.league.name}`;
                if (!grouped[key]) grouped[key] = [];
                grouped[key].push(match);
            }

            setMatchesByLeague(grouped);
        };
        loadMatches();
    },[]);

    return (
        <div className="min-h-screen bg-gray-100 p-4">
            <h1 className="text-2xl font-semibold text-center text-gray-800 mb-6"> Today's Matches </h1>

            {Object.keys(matchesByLeague).length === 0 ? (
                <p className="text-center text-gray-500 mt-8">No matches Today</p>
            ) : (
                Object.entries(matchesByLeague).map(([leagueKey, matches]) => (
                    <div className="mb-10" key={leagueKey}>
                        <h2 className="text-lg font-bold text-gray-700 mb-3 pl-2 border-l-4 border-blue-500">{leagueKey}</h2>
                        {matches.map(match => (
                            <MatchCard key={match.fixture.id} match={match} />
                        ))}
                    </div>
                ))
            )}
        </div>
    );
}
