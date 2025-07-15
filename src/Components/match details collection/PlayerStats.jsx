import { useState } from 'react';
import { Menu } from '@headlessui/react';

const statConfig = {
	top: {
		rating: "Rating",
		minutes: "Minutes Played",
		"goals.total": "Goals",
		"goals.assists": "Assists",
		"shots.total": "Total Shots",
	},
	attack: {
		"shots.on": "Shots on Target",
		offsides: "Offsides",
		"dribbles.attempts": "Dribbles Attempted",
		"dribbles.success": "Dribbles Successful",
		"dribbles.past": "Dribbled Past Opponents",
		"passes.key": "Key Passes",
		"passes.total": "Passes Attempted",
		"passes.accuracy": "Pass Accuracy (%)",
		"penalty.scored": "Penalties Scored",
		"penalty.missed": "Penalties Missed",
		"penalty.won": "Penalties Won",
	},
	defense: {
		"tackles.total": "Tackles",
		"tackles.blocks": "Blocks",
		"tackles.interceptions": "Interceptions",
		"duels.total": "Duels",
		"duels.won": "Duels Won",
		"fouls.committed": "Fouls Committed",
		"fouls.drawn": "Fouls Suffered",
		"cards.yellow": "Yellow Cards",
		"cards.red": "Red Cards",
		"penalty.commited": "Penalties Conceded",
	},
	goalkeeping: {
		"goals.conceded": "Goals Conceded",
		"goals.saves": "Saves",
		"penalty.saved": "Penalties Saved",
		"passes.total": "Passes Attempted",
		"passes.accuracy": "Pass Accuracy (%)",
	},
};

const tabs = ["top", "attack", "defense", "goalkeeping"];
const getLabel = (tab) => tab === "top" ? "Top stats" : tab;

const getStatValue = (obj, path) => {
	const value = path.split(".").reduce((acc, key) => acc?.[key], obj);
	return value === null || value === undefined ? 0 : value;
};

const getRatingColor = (rating) => {
	if (!rating) return "";
	const r = parseFloat(rating);
	if (r >= 7) return "bg-green-500";
	if (r >= 5) return "bg-orange-500";
	return "bg-red-500";
};

export default function PlayerStats({ players }) {
  	const [activeTab, setActiveTab] = useState("top");

	const allPlayers = players.flatMap(t =>
		t.players.map(p => ({
			team: t.team.name,
			teamLogo: t.team.logo,
			name: p.player.name,
			photo: p.player.photo,
			position: p.statistics[0].games.position,
			stats: p.statistics[0],
		}))
	);

	const filteredPlayers = allPlayers.filter(p => {
		const played = parseInt(p.stats.games.minutes) > 0;
		const isGK = p.position === "G";
		return activeTab === "goalkeeping" ? isGK && played : played;
	});

	const sortedPlayers = [...filteredPlayers].sort((a, b) =>
		parseFloat(b.stats.games.rating || 0) - parseFloat(a.stats.games.rating || 0)
	);

	return (
		<div className="bg-white border border-gray-100 rounded-xl p-4 sm:p-6">
			<h2 className="text-2xl sm:text-3xl font-bold mb-6 text-gray-900">Player Stats</h2>

			{/* Tabs */}
			<div  className="hidden sm:flex flex-wrap gap-2 sm:gap-3 mb-6">
				{tabs.map(tab => (
					<button
						key={tab} onClick={() => setActiveTab(tab)} className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors duration-200 ${
						activeTab === tab ? "bg-lime-300 text-gray-700" : "bg-zinc-500 text-white hover:bg-gray-300" }`}>
						{getLabel(tab)}
					</button>
				))}
			</div>
			
			<Menu as="div" className="sm:hidden relative mb-6">
				<Menu.Button className="w-full px-3 py-2 rounded-md bg-white border border-gray-200 text-sm font-medium text-gray-800 shadow-sm hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-300/40 flex items-center justify-between transition-all">
					{getLabel(activeTab)}
					<svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2 text-gray-500" fill="none"  viewBox="0 0 24 24"  stroke="currentColor" >
						<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
					</svg>
				</Menu.Button>

				<Menu.Items  className="absolute left-0 mt-2 w-full rounded-lg border border-gray-200 bg-white shadow-xl ring-1 ring-black/5 z-50 overflow-hidden animate-fadeIn">
					{tabs.map((tab) => (
						<Menu.Item as="div" key={tab}>
							<button
								onClick={() => setActiveTab(tab)} className={`w-full px-4 py-2 text-sm text-left transition-colors duration-150 ${
								activeTab === tab ? "bg-gray-100 text-black font-semibold" : "text-gray-700 hover:bg-gray-50" }`}>
								{getLabel(tab)}
							</button>
						</Menu.Item>
					))}
				</Menu.Items>
			</Menu>

			{/* Table */}
			<div className="overflow-x-auto">
				<table className="w-full table-fixed text-sm border-collapse">
					<thead className="sticky top-0 z-10">
						<tr className=" text-gray-700 font-semibold text-xs tracking-wide border-y border-l border-gray-200">
							<th className="text-left px-2 py-3 sticky left-0 z-20 w-[110px] sm:w-[200px] border-r border-gray-200 bg-white">Player</th>
							
							{Object.keys(statConfig[activeTab]).map(key => (
								<th key={key} className="text-center px-4 py-3 w-[90px] sm:w-[80px] md:w-[110px] border-r border-gray-200">
									{statConfig[activeTab][key]}
								</th>
							))}
						</tr>
					</thead>
					<tbody>
						{sortedPlayers.map((p, idx) => (
							<tr key={idx} className={`${idx === sortedPlayers.length - 1 ? "border-b border-gray-200" : ""}`}>
								
								{/* Player Info */}
								<td className="px-2 py-2 sticky left-0 bg-white z-10 border-b border-r border-l border-gray-200 overflow-x-auto w-[90px] sm:w-[180px]">
									<div className="flex items-center gap-1 h-full min-h-full">
										<img src={p.photo} alt={p.name} className="w-5 h-5 rounded-full border" />
										<img src={p.teamLogo} alt={p.team} className="w-4 h-4 rounded-sm" />
										<span className="text-[11px] sm:text-sm text-gray-800 font-medium whitespace-normal break-words">{p.name}</span>
									</div>
								</td>

								{/* Stat Columns */}
								{Object.keys(statConfig[activeTab]).map((key, i) => {
									const isRatingOrMinutes = key === "rating" || key === "minutes";
									const source = isRatingOrMinutes ? p.stats.games : p.stats;
									const val = getStatValue(source, key);
									
									return (
										<td key={i} className="px-3 py-3 text-center align-middle text-gray-800 whitespace-nowrap w-[72px] sm:w-[80px] md:w-[96px] border-r border-gray-200">
											{key === "rating" ? ( val && val !== "-" ? (
												<span className={`px-2 py-0.5 rounded text-white text-xs font-semibold ${getRatingColor(val)}`}> {parseFloat(val).toFixed(1)} </span>
											) : null ) : (  val )}
										</td>
									);
								})}
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
}