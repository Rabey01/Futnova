import { useState,useEffect } from "react";
import { fetchLeagueStandings } from "../../Api";

export default function Table ({ leagueId }) {
    const [standings, setStandings] = useState([]);

    useEffect(() => {
        const loadStandings = async () => {
            const data = await fetchLeagueStandings(leagueId);
            if (data && data.standings && data.standings.length > 0) {
                setStandings(data.standings[0].table); // TOTAL standings
            }
        };
        loadStandings();
    },[leagueId]);

    if (standings.length === 0) return <p>Loading standings...</p>;
    return (
        <div>
            <table>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Team</th>
                        <th>MP</th>
                        <th>W</th>
                        <th>D</th>
                        <th>L</th>
                        <th>GF</th>
                        <th>GA</th>
                        <th>GD</th>
                        <th>Pts</th>
                        <th>Form</th>
                    </tr>
                </thead>
                <tbody>
                    {standings.map((team,index) => (
                        <tr key={index}>
                            <td>{team.position}</td>
                            <td>
                                <img src={team.team.crest} alt={team.team.name} width="20" /> {team.team.name}
                            </td>
                            <td>{team.playedGames}</td>
                            <td>{team.won}</td>
                            <td>{team.draw}</td>
                            <td>{team.lost}</td>
                            <td>{team.goalsFor}</td>
                            <td>{team.goalsAgainst}</td>
                            <td>{team.goalDifference}</td>
                            <td>{team.points}</td>
                            <td>{team.form || "-"}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}