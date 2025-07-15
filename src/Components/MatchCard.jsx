import { Link } from "react-router-dom";

export default function MatchCard ({match}) {
    const {teams, fixture} = match;

    const matchTime = new Date(fixture.date).toLocaleString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
        day: "numeric",
        month: "short",
        year: "numeric"
    });
    return (
        <Link to={`/fixtures/${fixture.id}`}>
            <div className="py-3 border-b border-gray-100 hover:bg-gray-50 transition cursor-pointer relative">
                <div className="flex items-center justify-between">

                    <div className="flex items-center gap-2 w-1/3 justify-end">
                        <span className="text-xs sm:text-sm text-right font-medium overflow-scroll sm:overflow-visible">{teams.home.name}</span>
                        <img className="w-6 h-6 object-contain" src={teams.home.logo} alt={teams.home.name} width="30" height="30" />
                    </div>

                    <div className="w-1/3 text-center text-sm text-gray-800 space-y-1">
                        {/* Show score if match is not NS */}
                        {fixture.status.short !== "NS" && (
                        <div className="font-bold text-gray-700">
                            {match.goals.home} - {match.goals.away}
                        </div>
                        )}

                        {/* Elapsed time if live */}
                        {["1H", "2H", "ET", "BT", "P", "LIVE"].includes(fixture.status.short) && (
                            <div className="text-xs text-green-600 font-semibold">
                            {fixture.status.elapsed ? `${fixture.status.elapsed}'` : "Live"}
                            </div>
                        )}

                        {/* Kickoff time for NS or general fallback */}
                        {fixture.status.short === "NS" && (
                            <><div className="text-xs text-gray-600 sm:block hidden">{matchTime}</div>
                            <div className="text-xs text-gray-600 sm:hidden">{new Date(fixture.date).toLocaleTimeString("en-IN", {
                            hour: "2-digit",
                            minute: "2-digit"
                            })}</div></>
                        )}

                        {/* Other paused/postponed states */}
                        {["FT", "AET", "PEN", "HT", "SUSP", "PST", "CANC", "ABD", "INT", "AWD", "WO", "TBD"].includes(fixture.status.short) && (
                        <div className={`inline-block text-[11px] px-2 py-[2px] rounded-full ${
                            fixture.status.short === "HT" ? "bg-green-100 text-green-700" : "bg-gray-200 text-gray-700"
                        }`}>
                            {fixture.status.short}
                        </div>                        
                        )}
                    </div>

                    <div className="flex items-center gap-2 w-1/3 justify-start">
                        <img className="w-6 h-6 object-contain" src={teams.away.logo} alt={teams.away.name} width="30" height="30" />
                        <span className="text-xs sm:text-sm font-medium overflow-scroll sm:overflow-visible">{teams.away.name}</span>
                    </div>

                </div>

                {[fixture.venue.name, fixture.venue.city].includes("TBC") ? null : (
                    <div className="text-xs mt-1 text-gray-500 text-center hidden sm:block">
                        {fixture.venue.name}, {fixture.venue.city}
                    </div>
                )}
            </div>
        </Link> 
    );
}
