import { useState,useEffect } from "react";
import { fetchLeagueFixtures } from "../../Api";
// import { Link } from "react-router-dom";

export default function Matches ({ leagueId }) {
    const [fixtures, setFixtures] = useState([]);
    const [rounds, setRounds] = useState([]);
    const [selectedRound, setSelectedRound] = useState(null);
    const [showDropdown, setShowDropdown] = useState(false);

    useEffect (() => {
        const loadFixtures = async () => {
            const data = await fetchLeagueFixtures(leagueId);
            if (data && data.matches) {
                setFixtures(data.matches);
                const matchdays = Array.from(
                    new Set(data.matches.map(match => match.matchday).filter(Boolean))
                    ).sort((a, b) => a - b);

                    setRounds(matchdays);
                    setSelectedRound(matchdays[matchdays.length - 1]);
                }
        };
        loadFixtures();
    }, [leagueId]);

    if (fixtures.length === 0) return <p>No fixtures available.</p>;

    const filteredMatches = fixtures.filter(match => match.matchday === selectedRound);

   return (
        <div>
            {/* Matchday buttons */}
            <div className="flex items-center justify-between mb-4 px-4 relative">
                <button
                    onClick={() => setSelectedRound((prev) => Math.max(prev - 1, Math.min(...rounds)))}
                    disabled={selectedRound === Math.min(...rounds)}
                    className="w-8 h-8 rounded-full bg-gray-300 text-black disabled:opacity-40"
                >
                    &lt;
                </button>
                <div className="relative">
                    <button
                        onClick={() => setShowDropdown((prev) => !prev)}
                        className="text-md font-semibold flex items-center gap-1"
                    >
                        Round {selectedRound} <span className="text-sm">▼</span>
                    </button>

                    {showDropdown && (
                        <div className="absolute z-10 mt-2 bg-white shadow rounded w-32 p-2 max-h-60 overflow-y-auto left-1/2 -translate-x-1/2">
                            {rounds.map((round) => (
                                <button
                                    key={round}
                                    onClick={() => {setSelectedRound(round); setShowDropdown(false);}}
                                    className={`block w-full text-left px-3 py-1 rounded text-sm ${
                                    selectedRound === round
                                        ? "bg-blue-600 text-white"
                                        : "hover:bg-gray-200 text-gray-800"
                                    }`}
                                >
                                    Round {round}
                                </button>
                            ))}
                        </div>
                    )}  
                </div>
                <button
                    onClick={() =>
                    setSelectedRound((prev) => Math.min(prev + 1, Math.max(...rounds)))
                    }
                    disabled={selectedRound === Math.max(...rounds)}
                    className="w-8 h-8 rounded-full bg-gray-400 text-white disabled:opacity-50"
                >
                    &gt;
                </button>    
            </div>

            {/* Match List */}
            {filteredMatches.length === 0 ? (
                <p>No matches for Round {selectedRound}.</p>
            ) : (
                    Object.entries(
                        filteredMatches.reduce((acc, match) => {
                            const dateKey = new Date(match.utcDate).toLocaleDateString("en-US", {
                                weekday: "long",
                                month: "short",
                                day: "numeric"
                            });
                            if (!acc[dateKey]) acc[dateKey] = [];
                            acc[dateKey].push(match);
                            return acc;
                        }, {})
                    ).map(([date, matches]) => (
                    <div key={date} className="mb-6">
                        <h2 className="text-md font-semibold text-white bg-gray-700 px-4 py-2 rounded">{date}</h2>
                        {matches.map((match) => {
                            const statusLabel = {
                                SCHEDULED: "Scheduled",
                                IN_PLAY: "Live",
                                PAUSED: "HT",
                                FINISHED: "FT",
                                POSTPONED: "Postponed",
                                SUSPENDED: "Suspended",
                                CANCELED: "Canceled"
                            }[match.status] || match.status;
                            return (
                                <div key={match.id} className="flex items-center justify-between py-3 border-b border-gray-300 px-2">
                                    <span className="text-xs bg-gray-200 text-gray-800 px-2 py-0.5 rounded">
                                        {statusLabel}
                                    </span>
                                    
                                    <div className="flex items-center gap-2 w-1/3 justify-end">
                                        <span className="text-sm text-right">{match.homeTeam.name}</span>
                                        <img src={match.homeTeam.crest} alt={match.homeTeam.name} className="w-5 h-5" />
                                    </div>

                                    <div className="w-16 text-center font-bold text-sm">
                                        {match.score.fullTime.home} - {match.score.fullTime.away}
                                    </div>

                                    <div className="flex items-center gap-2 w-1/3 justify-start">
                                        <img src={match.awayTeam.crest} alt={match.awayTeam.name} className="w-5 h-5" />
                                        <span className="text-sm">{match.awayTeam.name}</span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ))
            )}
        </div>
    );
}