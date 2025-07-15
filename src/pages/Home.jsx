import { useState, useEffect} from "react";
import { fetchTodayMatches } from "../../Api";
import MatchCard from "../Components/MatchCard";
import SkeletonLoader from "../Components/SkeletonLoader";
import EmptyState from "../Components/EmptyState";
import ErrorFallback from "../Components/ErrorFallback";

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
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [selectedDay, setSelectedDay] = useState("today");
    const days = ["yesterday", "today", "tomorrow"];

    const getDateFor = (key) => {
        const today = new Date();
        if (key === "yesterday") today.setDate(today.getDate() - 1);
        if (key === "tomorrow") today.setDate(today.getDate() + 1);
        return today.toISOString().split("T")[0]; // YYYY-MM-DD
    };

    const loadMatches = async () => {
        setLoading(true);
        setError(false);
        try {
            const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
            const date = getDateFor(selectedDay);
            const matches = await fetchTodayMatches(timezone,date);

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
        } catch (err) {
            console.error(err);
            setError(true);
        } finally {
            setLoading(false);
        }
    };
    useEffect (() => {
        loadMatches();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[selectedDay]);

    return (
        <div className="min-h-screen bg-gray-100 px-4 py-6">
            <div className="flex justify-center gap-2 mb-8">
                {days.map((day) => (
                    <button key={day} onClick={() => setSelectedDay(day)}
                        className={`px-2 py-1 sm:px-4 sm:py-2 text-sm sm:text-base font-semibold capitalize transition-transform duration-200 ease-in-out
                        ${ selectedDay === day ? "scale-100 sm:scale-105 bg-lime-300 text-gray-800 shadow-md" : "scale-75 bg-zinc-500 text-white hover:scale-90" }`}>
                        {day}
                    </button>
                ))}
            </div>

            {loading ? (
                <SkeletonLoader type="card" count={5} />
            ) : error ? (
                <ErrorFallback message="Failed to load today's matches." onRetry={loadMatches} />    
            ) : Object.keys(matchesByLeague).length === 0 ? (
                <EmptyState message="No matches today." />
            ) : (
                <div className="space-y-10 max-w-4xl mx-auto">
                    {Object.entries(matchesByLeague).map(([leagueKey, matches]) => (
                        <div className="bg-white rounded-xl border border-gray-100 transition p-4" key={leagueKey}>
                            <div className="flex items-center gap-3 px-4 py-2 mb-4 rounded-md bg-lime-200 border border-gray-200">
                                <img src={matches[0].league.logo} alt={matches[0].league.name} className="w-6 h-6 object-contain" />
                                <h2 className="text-center sm:text-left text-sm sm:text-base font-semibold text-black">
                                    {matches[0].league.country} — {matches[0].league.name}<span className="hidden sm:inline"> {matches[0].league.round}</span>
                                </h2>
                            </div>
                            <div className="divide-y divide-gray-100">
                                {matches.map(match => (
                                    <MatchCard key={match.fixture.id} match={match} />
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
