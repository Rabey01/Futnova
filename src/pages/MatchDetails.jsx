import { useEffect,useState } from "react";
import { useParams } from "react-router-dom";
import { fetchFixtureDetails } from "../../Api";

export default function MatchDetails() {
    const { id } = useParams();
    const [fixtureDetails, setFixtureDetails] = useState(null);
    const [view, setView] = useState("summary");

    useEffect(() => {
        const loadDetails = async () => {
            const data = await fetchFixtureDetails(id);
            setFixtureDetails(data);
        };
        loadDetails();
    }, [id]);

    if (!fixtureDetails) {
        return <p>Loading match details...</p>;
    }

    const {fixture, teams, goals, statistics, events, lineups} = fixtureDetails;

    return (
        <div className="min-h-screen bg-gray-100 p-4">
            <h1 className="text-2xl font-semibold text-center text-gray-800 mb-4">Match Details</h1>
            <p  className="text-lg font-medium text-center text-gray-700">
                {teams.home.name} vs {teams.away.name}
            </p>
            <p  className="text-sm text-center text-gray-500 mb-2">
                Status: {fixture.status.long} — {fixture.status.elapsed}'
            </p>
            <p className="text-xl font-bold text-center text-black mb-6">
                Score: {goals.home} - {goals.away}
            </p>

            <div className="flex justify-center gap-3 mb-6">
                {statistics && <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition" onClick={() => setView("stats")}>View Stats</button>}
                {events && events.length > 0 && <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition" onClick={() => setView("events")}>View Events</button>}
                {lineups && lineups.length > 0 && <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition" onClick={() => setView("lineups")}>View Lineups</button>}
            </div>
            
            {view === "stats" && (
            <div className="bg-white rounded-lg shadow-md p-4 mb-6">
                <h3 className="text-lg font-semibold mb-2 text-gray-800">Statistics</h3>
                {statistics.map((teamStats, i) => (
                <div key={i}>
                    <h4 className="font-semibold text-blue-600">{teamStats.team.name}</h4>
                    <ul className="list-disc list-inside text-sm text-gray-700">
                    {teamStats.statistics.map((stat, idx) => (
                        <li key={idx}>
                        {stat.type}: {stat.value ?? 0}
                        </li>
                    ))}
                    </ul>
                </div>
                ))}
            </div>
            )}

            {view === "events" && (
            <div className="bg-white rounded-lg shadow-md p-4 mb-6">
                <h3 className="text-lg font-semibold mb-2 text-gray-800">Match Events</h3>
                <ul className="list-disc list-inside text-sm text-gray-700">
                {events.map((event, idx) => (
                    <li key={idx}>
                    {event.time.elapsed}' - {event.team.name}: {event.player.name} ({event.type} - {event.detail})
                    </li>
                ))}
                </ul>
            </div>
            )}

            {view === "lineups" && (
            <div className="bg-white rounded-lg shadow-md p-4 mb-6">
                <h3 className="text-lg font-semibold mb-2 text-gray-800">Lineups</h3>
                {lineups.map((team, idx) => (
                <div key={idx}>
                    <h4 className="font-semibold text-blue-600">{team.team.name}</h4>
                    <p className="text-sm text-gray-600">Coach: {team.coach.name}</p>
                    <p className="text-sm text-gray-600 mb-1">Formation: {team.formation}</p>
                    <ul className="list-disc list-inside text-sm text-gray-700">
                    {team.startXI.map((player, i) => (
                        <li key={i}>
                        #{player.player.number} - {player.player.name}
                        </li>
                    ))}
                    </ul>
                </div>
                ))}
            </div>
            )}

        </div>
    )
}

