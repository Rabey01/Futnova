export default function MatchCard ({match}) {
    const {teams, fixture, league} = match;

    const matchTime = new Date(fixture.Date).toLocaleString();

    return (
        <div>
            <div>
                {league.name} {league.country}
            </div>
            <div>
                {teams.home.name} vs {teams.away.name}
            </div>
            <div>
                status: {fixture.status.short}
            </div>
            <div>
                time: {matchTime}
            </div>
        </div>
    );
}
