import { useState,useEffect } from "react";
import { fetchLeagueFixtures } from "../../Api";
import SkeletonLoader from "./SkeletonLoader";
import EmptyState from "./EmptyState";
import ErrorFallback from "./ErrorFallback";
// import { Link } from "react-router-dom";

export default function Matches ({ leagueId }) {
    const [fixtures, setFixtures] = useState([]);
    const [currentRound, setCurrentRound] = useState(null);
    const [showDropdown, setShowDropdown] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    const loadFixtures = async () => {
        setLoading(true);
        setError(false);
        try {
            const data = await fetchLeagueFixtures(leagueId);
            if (data && data.matches) {
                setFixtures(data.matches);
                
                const matchdays = [...new Set(data.matches.map(m => m.matchday).filter(Boolean))].sort((a, b) => a - b);
                const now = new Date();
                const upcomingMatch = data.matches.find(match => new Date(match.utcDate) >= now);
                const latestRelevantRound = upcomingMatch?.matchday || matchdays[0];
                
                if (currentRound === null && latestRelevantRound) {
                    setCurrentRound(latestRelevantRound);
                }
                
            } else {
                setFixtures([]);
            }
        } catch (err) {
            console.error(err);
            setError(true);
        } finally {
            setLoading(false);
        }
    };
    useEffect (() => {
        // console.log("LEAGUE ID:", leagueId);
        if (!leagueId) return;
        loadFixtures();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [leagueId]);

    if (loading) return <SkeletonLoader type="card" count={3} />;
    if (error) return <ErrorFallback message="Failed to load fixtures." onRetry={loadFixtures} />;
    if (fixtures.length === 0) return <EmptyState message="Fixtures aren’t available at the moment. Try refreshing in a little while to see updated match data." />;
    // if (currentRound === null) return null; // 🛡️ waits quietly
    
    const matchdays = [...new Set(fixtures.map(m => m.matchday).filter(Boolean))].sort((a, b) => a - b);
    const filteredMatches = fixtures.filter((match) => match.matchday === currentRound);

    if (!filteredMatches || filteredMatches.length === 0) {
        return <EmptyState message={`No matches for Round ${currentRound}.`} />;
    }

    return (
        <div className="max-w-5xl mx-auto px-4 py-6 flex flex-col gap-6">
            {/* Matchday buttons */}
            <div className="flex flex-wrap items-center justify-between py-4 px-4 border border-gray-100 bg-gray-100 rounded-xl">
                <button
                    onClick={() => setCurrentRound((prev) => Math.max(prev - 1, Math.min(...matchdays)))}
                    disabled={currentRound === Math.min(...matchdays)}
                    className="disabled:opacity-50"
                >
                    <img
                        src="https://img.icons8.com/plumpy/24/circled-chevron-left--v2.png"
                        alt="Previous"
                        className="w-6 h-6 opacity-80 hover:opacity-100 transition"
                    />
                </button>
                <div className="relative">
                    <button
                        onClick={() => setShowDropdown((prev) => !prev)}
                        className="text-md font-semibold flex items-center gap-1"
                    >
                        Round {currentRound} <span className="text-sm">▼</span>
                    </button>

                    {showDropdown && (
                        <div className="absolute z-10 mt-2 bg-white shadow rounded w-32 p-2 max-h-60 overflow-y-auto left-1/2 -translate-x-1/2">
                            {matchdays.map((round) => (
                                <button
                                    key={round}
                                    onClick={() => {setCurrentRound(round); setShowDropdown(false);}}
                                    className={`block w-full text-left px-3 py-1  text-sm ${
                                    currentRound === round
                                        ? "bg-gray-200 text-black"
                                        : " hover:bg-gray-200"
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
                    setCurrentRound((prev) => Math.min(prev + 1, Math.max(...matchdays)))
                    }
                    disabled={currentRound === Math.max(...matchdays)}
                    className="disabled:opacity-50"
                >
                   <img
                        src="https://img.icons8.com/plumpy/24/circled-chevron-right--v2.png"
                        alt="Next"
                        className="w-6 h-6 opacity-80 hover:opacity-100 transition"
                    />
                </button>    
            </div>

            {/* Match List */}
            {filteredMatches.length === 0 ? (
                  <EmptyState message={`No matches for Round ${currentRound}.`} />
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
                    <div key={date} className="mb-6 px-4 py-4 bg-white rounded-xl border border-gray-100">
                        <h2 className="text-sm font-semibold text-black bg-lime-200 px-4 py-2 rounded mb-2">{date}</h2>
                        {matches.map((match) => {
                            const showTimeInstead =
                            match.status === "SCHEDULED" || match.status === "TIMED";

                            const matchTime = new Date(match.utcDate).toLocaleTimeString("en-US", {
                                hour: "2-digit",
                                minute: "2-digit",
                                hour12: true
                            });

                            const statusLabel = showTimeInstead && match.utcDate ? matchTime : {
                                IN_PLAY: "Live",
                                PAUSED: "Break",
                                FINISHED: "FT",
                                POSTPONED: "Postponed",
                                SUSPENDED: "Suspended",
                                CANCELED: "Canceled"
                            }[match.status] || match.status || "TBD";

                            return (
                                <div key={match.id} className="relative flex items-center justify-between px-4 py-3 bg-white rounded mb-2 border-b border-gray-100">
                                    <div className="flex items-center gap-2 w-1/3 justify-end">
                                        <span className="text-[11px] sm:text-sm text-right">{match.homeTeam.name.split(" ").slice(-3).join(" ")}</span>
                                        <img src={match.homeTeam.crest} alt={match.homeTeam.name} className="w-5 h-5" />
                                    </div>

                                    <div className="w-16 text-center text-sm font-semibold flex flex-col items-center justify-center gap-[4px]">
                                        {(match.score.fullTime.home != null && match.score.fullTime.away != null) ? (
                                            <span className="text-gray-700">
                                                {match.score.fullTime.home} - {match.score.fullTime.away}
                                            </span>
                                        ) : (
                                            // Only show time if it's still upcoming (i.e. statusLabel === matchTime)
                                            (statusLabel === matchTime) && (
                                                <span className="text-xs text-gray-600">
                                                    {matchTime}
                                                </span>
                                            )
                                        )}

                                        {statusLabel !== matchTime && (
                                            <span className={`text-[11px] px-2 py-[2px] rounded ${
                                                statusLabel === "Live" || statusLabel === "Break"
                                                    ? "bg-green-100 text-green-700"
                                                    : "bg-gray-200 text-gray-700"
                                            }`}>
                                                {statusLabel}
                                            </span>
                                        )}
                                    </div>

                                    <div className="flex items-center gap-2 w-1/3 justify-start">
                                        <img src={match.awayTeam.crest} alt={match.awayTeam.name} className="w-5 h-5" />
                                        <span className="text-[11px] sm:text-sm">{match.awayTeam.name.split(" ").slice(-3).join(" ")}</span>
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