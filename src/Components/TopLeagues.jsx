import { logoMap } from "../logoMap";

export default function TopLeagues({ onSelect }) {
    const leagues = [
        { id: 140, name: "La Liga", switchFill: false },
        { id: 39, name: "Premier League", switchFill: false },
        { id: 135, name: "Serie A", switchFill: false },
        { id: 2, name: "UEFA Champions League", switchFill: true },
        { id: 61, name: "Ligue 1", switchFill: true },
        { id: 78, name: "Bundesliga", switchFill: false },
        { id: 3, name: "UEFA Europa League", switchFill: true },
        { id: 1, name: "FIFA World Cup", switchFill: false },
        { id: 143, name: "Copa del Rey", switchFill: true },
        { id: 45, name: "FA Cup", switchFill: false },
    ];

    return (
        <>
            <div className="p-6 max-w-7xl mx-auto bg-white shadow-md rounded-2xl mt-6">
                <h1 className="text-lg font-semibold mb-4">Top leagues</h1>
                <ul className="space-y-3">
                    {leagues.map((league) => {
                        const Logo = logoMap[league.id];
                        return (
                            <li
                                key={league.id}
                                className="flex items-center gap-3 p-1 rounded-lg cursor-pointer transition hover:bg-gray-100 active:scale-[0.98]"
                                onClick={() => onSelect(league)}
                            >
                                {Logo && (
                                    <img src={Logo} alt={league.name} className="w-[20px] h-[20px] object-contain" />
                                )}
                                <div className="flex flex-col">
                                    <span className="text-sm font-medium">{league.name}</span>
                                    {[1, 143, 45, 3].includes(league.id) && (
                                        <div className="text-xs text-gray-500 -mt-1">via FotMob</div>
                                    )}
                                </div>
                            </li>
                        );
                    })}
                </ul>
            </div>
            <div className="mt-10 text-center px-4">
                <p className="text-sm text-gray-500">
                    Only selected leagues are supported due to data availability.
                </p>
            </div>
        </>
    );

}