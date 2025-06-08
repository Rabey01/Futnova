import { Link } from "react-router-dom";

export default function MatchCard ({match}) {
    const {teams, fixture} = match;

    const matchTime = new Date(fixture.date).toLocaleString("en-IN", {
        timeZone: "Asia/Kolkata",
        hour: "2-digit",
        minute: "2-digit",
        day: "numeric",
        month: "short",
        year: "numeric"
    });
    return (
        <Link to={`/fixtures/${fixture.id}`}>
            <div className="border rounded-xl p-4 shadow-md bg-white hover:bg-gray-50 transition-all cursor-pointer">
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                        <img className="w-6 h-6 object-contain" src={teams.home.logo} alt={teams.home.name} width="30" height="30" />
                        <span>{teams.home.name}</span>
                    </div>
                    <span>vs</span>
                    <div className="flex items-center gap-2">
                        <img className="w-6 h-6 object-contain" src={teams.away.logo} alt={teams.away.name} width="30" height="30" />
                        <span className="text-gray-500 font-medium">{teams.away.name}</span>
                    </div>
                </div>
                <div className="text-sm text-gray-600">
                    status: {fixture.status.short}
                </div>
                <div className="text-sm text-gray-600">
                    Kickoff: {matchTime}
                </div>
                 <div className="text-sm text-gray-600">
                    Venue: {fixture.venue.name}, {fixture.venue.city}
                </div>
                <br />
            </div>
        </Link>
        
    );
}
