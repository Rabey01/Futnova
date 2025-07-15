import { useState,useEffect } from "react";
import { fetchLeagueStandings } from "../../Api";
import SkeletonLoader from "./SkeletonLoader";
import ErrorFallback from "./ErrorFallback";
import EmptyState from "./EmptyState";

export default function Table ({ leagueId }) {
    const [standings, setStandings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    const loadStandings = async () => {
        setLoading(true);
        setError(false);
        try {
            const data = await fetchLeagueStandings(leagueId);
            if (data && data.standings && data.standings.length > 0) {
                setStandings(data.standings[0].table); // TOTAL standings
            } else { setStandings([]);}
        } catch (err) {
            console.error(err);
            setError(true);
        } finally {
            setLoading(false);
        }
        
    };
    useEffect(() => {
        loadStandings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[leagueId]);

    if (loading) return <SkeletonLoader type="table" count={10} />;
    if (error) return <ErrorFallback message="Failed to load standings." onRetry={loadStandings} />;
    if (standings.length === 0) return <EmptyState message="No standings available." />;
    
    return (
        <div className="max-w-5xl mx-auto px-4 py-6 flex flex-col gap-6">
            <div className="overflow-x-auto rounded-lg shadow">
                <table className="w-full table-fixed text-sm text-left border-collapse">
                    <thead className="bg-lime-200 font-semibold">
                        <tr>
                            <th className="px-3 py-2 w-[20px] sm:w-[60px]">#</th>
                            <th className="px-3 py-2 w-[120px] sm:w-[200px]">Team</th>
                            <th className="px-3 py-2 w-[40px] sm:w-[60px]">PL</th>
                            <th className="px-3 py-2 w-[50px] sm:table-cell sm:w-[60px] hidden">W</th>
                            <th className="px-3 py-2 w-[50px] sm:table-cell sm:w-[60px] hidden">D</th>
                            <th className="px-3 py-2 w-[50px] sm:table-cell sm:w-[60px] hidden">L</th>
                            <th className="px-3 py-2 w-[60px] sm:table-cell sm:w-[60px] hidden">+/-</th>
                            <th className="px-3 py-2 w-[40px] sm:w-[60px]">GD</th>
                            <th className="px-3 py-2 w-[40px] sm:w-[60px]">PTS</th>
                            {/* <th className="px-3 py-2">Form</th> */}
                        </tr>
                    </thead>
                    <tbody>
                        {standings.map((team,index) => (
                            <tr key={index} className="border-b hover:bg-gray-50">
                                <td className="px-3 py-2">{team.position}</td>
                                <td className="px-3 py-2">
                                    <div className="flex items-center gap-1">
                                        <img src={team.team.crest} alt={team.team.name} className="w-5 h-5" /> 
                                        <span className="text-[14px] sm:text-ms">{team.team.name.split(" ").slice(-3).join(" ")}</span>
                                    </div>
                                    
                                </td>
                                <td className="px-3 py-2">{team.playedGames}</td>
                                <td className="px-3 py-2 hidden sm:table-cell">{team.won}</td>
                                <td className="px-3 py-2 hidden sm:table-cell">{team.draw}</td>
                                <td className="px-3 py-2 hidden sm:table-cell">{team.lost}</td>
                                <td className="px-3 py-2 hidden sm:table-cell">{team.goalsFor}-{team.goalsAgainst}</td>
                                <td className="px-3 py-2">{team.goalDifference >= 0 ? `+${team.goalDifference}` : team.goalDifference}</td>
                                <td className="px-3 py-2 font-bold">{team.points}</td>
                                {/* <td className="px-3 py-2">
                                    {team.form?.split('').map((res, i) => (
                                    <span
                                        key={i}
                                        className={`inline-block w-5 h-5 text-xs font-bold text-white rounded text-center mr-1 ${
                                        res === 'W' ? 'bg-green-500' : res === 'D' ? 'bg-gray-500' : 'bg-red-500'
                                        }`}
                                    >
                                        {res}
                                    </span>
                                    )) || '-'}
                                </td> */}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}