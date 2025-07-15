import FootballField from './FootballField';
import CoachAndSubs from './CoachAndSubs';

export default function Lineup({ lineups, players,events,showCoach = true }) {
	if (!lineups || !players) return null;

	const getTeamData = (teamId, ) => {
		const lineup = lineups.find((l) => l.team.id === teamId);
		if (!lineup) return null;

		const startXI = [...lineup.startXI.map(p => p.player)];
		const teamPlayers = players.find((p) => p.team.id === teamId);
		const photoMap = teamPlayers ? Object.fromEntries(teamPlayers.players.map((p) => [p.player.id, p.player.photo])) : {};

		// Assign photos to players
		startXI.forEach((p) => {
			p.photo = photoMap[p.id] || "https://via.placeholder.com/40";
		});

		// Group by pos as backup
		const grouped = { G: [], D: [], M: [], F: [] };
		startXI.forEach((p) => {
			if (grouped[p.pos]) grouped[p.pos].push(p);
		});

		let rows = [];

		if (lineup.formation) {
			const parts = lineup.formation.split("-").map(Number);
			// Always 1 GK
			rows.push(grouped.G);
			// Assume defenders are always 1st number in formation
			rows.push(grouped.D.slice(0, parts[0]));

			// Handle rest dynamically (M + F)
			const rest = [...grouped.M, ...grouped.F];
			let index = 0;
			for (let i = 1; i < parts.length; i++) {
				const count = parts[i];
				rows.push(rest.slice(index, index + count));
				index += count;
			}
		} else {
			// fallback: G, D, M, F
			rows = [grouped.G, grouped.D, grouped.M, grouped.F];
		}

		// Flip grid vertically for away team without mirroring player roles
		if (teamId === awayId) {
			rows = [...rows].reverse().map(row => [...row]); // preserve order within each row
		}

		return {
			logo: lineup.team.logo,
			name: lineup.team.name,
			formation: lineup.formation || "Unknown",
			rows,
			coach: lineup.coach,
			substitutes: lineup.substitutes || [],
		};
	};

	const homeId = lineups[0].team.id;
	const awayId = lineups[1].team.id;
	const home = getTeamData(homeId);
	const away = getTeamData(awayId, true);

	if (!home || !away) return null;

	const renderRow = (players, isAway = false, key) => (
		<div key={key} className="grid w-full px-4 gap-2" style={{ gridTemplateColumns: `repeat(${players.length}, minmax(0, 1fr))` }}>
			{(isAway ? [...players].reverse() : players).map((p) => (
				<div key={p.id} className="flex flex-col items-center text-white text-[10px] sm:text-xs">
					<img src={p.photo} alt={p.name} className="rounded-full object-cover border" style={{width: 'clamp(24px, 6vw, 40px)',height: 'clamp(24px, 6vw, 40px)',}} />
					<span className="text-center w-full truncate">{p.number} {p.name?.split(" ").slice(-1)[0]}</span>
				</div>
			))}
		</div>
	);

	return (
		<>
			<div className="bg-white rounded-xl border border-gray-100 py-2">

				<div className="flex justify-center items-center gap-2 mb-2 text-xs sm:text-sm">
					<img src={home.logo} alt="Home Team Logo" className="w-5 h-5 sm:w-6 sm:h-6 object-contain" />
					<span className="font-semibold">{home.name}</span>
					<span>({home.formation})</span>
				</div>

				<FootballField>
					{/* Home Team Top */}
					<div className="flex flex-col justify-evenly h-full px-2">
						{home.rows.map((row, i) => renderRow(row, false, `home-${i}`))}
					</div>

					{/* Away Team Bottom Half */}
					<div className="flex flex-col justify-evenly h-full px-2">
						{away.rows.map((row, i) => renderRow(row, true, `away-${i}`))}
					</div>
				</FootballField>

				<div className="flex justify-center items-center gap-2 mt-2 text-xs sm:text-sm">
					<img src={away.logo} alt="Away Team Logo" className="w-5 h-5 sm:w-6 sm:h-6 object-contain" />
					<span className="font-semibold">{away.name}</span>
					<span>({away.formation})</span>
				</div>

				{showCoach && (<CoachAndSubs players={players} events={events} home={home} away={away} homeId={homeId} awayId={awayId} />)}
			</div>
		</>
	);
}