export default function StatsPage({ statistics, lineups }) {
	const homeStats = statistics[0].statistics;
	const awayStats = statistics[1].statistics;
	const homeColor = "#" + lineups[0].team.colors.player.primary;
	const awayColor = "#" + lineups[1].team.colors.player.primary;
	const homeTextColor = getContrastColor(homeColor);
	const awayTextColor = getContrastColor(awayColor);

	const getStat = (type) => {
		const home = homeStats.find((s) => s.type === type)?.value ?? "-";
		const away = awayStats.find((s) => s.type === type)?.value ?? "-";
		return { home, away };
	};

	const allTypes = [...new Set(homeStats.map((s) => s.type))].filter(
		(type) => type !== "Ball Possession"
	);

	const possession = getStat("Ball Possession");

	function getContrastColor(hex) {
		// Ensure it starts with #
		hex = hex.replace("#", "");
		const r = parseInt(hex.substr(0, 2), 16);
		const g = parseInt(hex.substr(2, 2), 16);
		const b = parseInt(hex.substr(4, 2), 16);
		const brightness = (r * 299 + g * 587 + b * 114) / 1000;
		return brightness > 160 ? "black" : "white";
	}
	
	return (
		<div className="w-full overflow-x-auto px-2">
			<div className="p-4 sm:p-6 bg-white rounded-xl text-black text-sm sm:text-base border border-gray-100 sm:mx-auto">
				<h2 className="text-2xl font-semibold mb-6 text-center">Top Stats</h2>
				<h3 className="text-center font-medium mb-2">
					Ball Possession
				</h3>
				{/* Ball Possession Bar */}
				<div className="flex items-center justify-center mb-8">
					<div className="w-4/5 h-10 rounded-full overflow-hidden border-4 border-gray-300 flex gap-1">
						{/* Home bar */}
						<div className="h-full flex items-center justify-start pl-2 text-sm font-bold" 
							style={{backgroundColor: homeColor,color: homeTextColor,width: possession.home,}}>
							{possession.home}
						</div>

						{/* Away bar */}
						<div className="h-full flex items-center justify-end pr-2 text-sm font-bold" 
							style={{backgroundColor: awayColor,color: awayTextColor,width: possession.away,}}>
							{possession.away}
						</div>
					</div>
				</div>

				{/* Other Stats */}
				<div className="divide-y divide-gray-100">
					{allTypes.map((type) => {
						const { home, away } = getStat(type);
						return (
							<div key={type} className="flex justify-between items-center py-3">
								<span className="w-16 text-left font-bold">{home}</span>
								<span className="flex-1 text-center font-semibold"> {type} </span>
								<span className="w-16 text-right font-bold">{away}</span>
							</div>
						);
					})}
				</div>
			</div>
		</div>
		
	);
}
