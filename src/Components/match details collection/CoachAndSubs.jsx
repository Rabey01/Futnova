import rightIcon from '../../assets/Icons/right-arrow.png';

export default function CoachAndSubs({ players, events, home, away, homeId, awayId }) {
	const ICONS = {
		goal: "https://img.icons8.com/plasticine/26/football2.png",
		assist: "https://img.icons8.com/ios-glyphs/26/cleats.png",
		yellow: "https://img.icons8.com/color/26/soccer-yellow-card.png",
		red: "https://img.icons8.com/color/26/foul.png",
		rightArrow: rightIcon,
	};

	const positionMap = {
		G: "Keeper",
		D: "Defender",
		M: "Midfielder",
		F: "Attacker",
	};

	const photoMap = {}, posMap = {}, numberMap = {};
	players.forEach(t => {
		if (!t.players) return;
		t.players.forEach(p => {
		photoMap[p.player.id] = p.player.photo;
		posMap[p.player.id] = positionMap[p.statistics?.[0]?.games?.position] || '';
		numberMap[p.player.id] = p.statistics?.[0]?.games?.number || '';
		});
	});

	const getSubIns = (teamId) =>
		events.filter(e => e.type === 'subst' && e.team.id === teamId).map(e => ({
			id: e.assist?.id,  // CHANGED
			name: e.assist?.name,  // CHANGED
			time: e.time.elapsed,
		})).filter(e => e.id);

	const getPlayerEvents = (playerId) =>
		events.filter(e =>
			(e.type === 'Goal' && e.assist?.id === playerId) ||  // ✅ NEW for assist in goal
			(e.player?.id === playerId && ['Goal', 'Card'].includes(e.type))
		);

	const renderIconsForPlayer = (playerId, size = 5) =>
		getPlayerEvents(playerId).map((e, j) => {
			if (e.type === 'Goal' && e.assist?.id === playerId)return <img key={j} src={ICONS.assist} className={`w-${size} h-${size}`} />;
			if (e.type === 'Goal' && e.player?.id === playerId)return <img key={j} src={ICONS.goal} className={`w-${size} h-${size}`} />;
			if (e.type === 'Card' && e.detail === 'Red Card')return <img key={j} src={ICONS.red} className={`w-${size} h-${size}`} />;
			if (e.type === 'Card' && e.detail === 'Yellow Card')return <img key={j} src={ICONS.yellow} className={`w-${size} h-${size}`} />;
			return null;
		});

	const renderSubList = (subs) =>
		subs.map((sub, i) => {
			const icons = renderIconsForPlayer(sub.id, 5);

			return (
				<div key={i} className="flex items-center justify-between w-full text-sm">
					<div className="flex items-center flex-1 gap-2">
						<img src={photoMap[sub.id]} alt={sub.name} className="w-8 h-8 rounded-full object-cover" />
						<div className="flex items-center gap-4">
							<span className="text-sm text-gray-500 w-6 text-right">{numberMap[sub.id]}</span>
							<div className="flex flex-col leading-tight">
								<span className="text-base font-medium">{sub.name?.split(" ").slice(-1)[0]}</span>
								<span className="text-sm text-gray-500">{posMap[sub.id]}</span>
							</div>
						</div>
					</div>
					<div className="flex items-center gap-2 justify-end min-w-[80px]">
						{icons}
						<span className="text-sm">{sub.time}'</span>
						<img src={ICONS.rightArrow} alt="sub-in" className="w-5 h-5" />
					</div>
				</div>
			);
		});

	const renderSubGrid = (sub, i) => {
		const icons = renderIconsForPlayer(sub.id, 4);
		
		return (
			<div key={i} className="relative flex flex-col items-center text-center text-[11px] font-medium gap-0">
			
				{/* Main profile image acting as card */}
				<div className="relative">
					{/* Sub minute + arrow (top-left corner) */}
					<div className="absolute -top-1 -left-5 flex items-center gap-[1px] z-10">
						<span className="text-[10px] text-green-700 font-bold">{sub.time}'</span>
						<img src={ICONS.rightArrow} alt="in" className="w-3 h-3 rounded-full border shadow-md" />
					</div>

					<img
						src={photoMap[sub.id]}
						alt={sub.name?.split(" ").slice(-1)[0]}
						className="rounded-full object-cover border shadow-md"
						style={{ width: "clamp(40px, 12vw, 56px)", height: "clamp(40px, 12vw, 56px)" }}
					/>

					{/* Event icons (bottom-right corner) */}
					{icons.length > 0 && (
						<div className="absolute -bottom-1 -right-1 flex flex-wrap gap-[2px]">
							{icons}
						</div>
					)}
				</div>

				{/* Jersey + name */}
				<div className="flex items-center justify-center mt-1 gap-1 text-black">
					<span className="text-xs text-gray-400 font-medium">{numberMap[sub.id]}</span>
					<div className="flex flex-col items-start leading-tight">
						<span className="truncate max-w-[72px]">{sub.name?.split(" ").slice(-1)[0]}</span>
						<span className="text-[10px] text-gray-500">{posMap[sub.id]}</span>
					</div>
				</div>
			</div>
		);
	};

	return (
		<div className="mt-6 px-4 text-sm">
		
			{/* Coaches Large screens */}
			<div className="hidden sm:flex flex-row justify-between items-center mb-6 text-sm">
				<div className="flex items-center gap-2 w-1/3 justify-start">
					{home.coach?.name && (
					<>
						<img src={home.coach.photo} alt={home.coach.name} className="w-8 h-8 rounded-full" />
						<span className="font-medium">{home.coach.name}</span>
					</>
					)}
				</div>

				<div className="w-1/3 text-center font-semibold text-base">Coach</div>

				<div className="flex items-center gap-2 w-1/3 justify-end">
					{away.coach?.name && (
					<>
						<span className="font-medium">{away.coach.name}</span>
						<img src={away.coach.photo} alt={away.coach.name} className="w-8 h-8 rounded-full" />
					</>
					)}
				</div>
			</div>

			{/* Small screens */}
			<div className="block sm:hidden mb-6 text-sm">
				<div className="text-center font-semibold mb-2">Coach</div>
				<div className="flex justify-between items-center">
					<div className="flex flex-col items-center gap-1 w-1/2">
						<img src={home.coach?.photo} alt={home.coach?.name} className="w-12 h-12 rounded-full" />
						<span className="font-medium text-black">{home.coach?.name?.split(" ").slice(-1)}</span>
					</div>
					<div className="flex flex-col items-center gap-1 w-1/2">
						<img src={away.coach?.photo} alt={away.coach?.name} className="w-12 h-12 rounded-full" />
						<span className="font-medium text-black">{away.coach?.name?.split(" ").slice(-1)}</span>
					</div>
				</div>
			</div>


			{/* Substitutes Large screens */}
			<div className="w-full">
				<div className="text-center font-semibold text-base mb-2">Substitutes</div>
				<div className="grid-cols-2 gap-8 hidden md:grid w-full">
					<div className="flex flex-col divide-y divide-gray-200 gap-3">
						{getSubIns(homeId).map((sub, idx) => (
							<div key={idx} className="pt-1">{renderSubList([sub])}</div>
						))}
					</div>
					<div className="flex flex-col divide-y divide-gray-200 gap-3">
						{getSubIns(awayId).map((sub, idx) => (
							<div key={idx} className="pt-1">{renderSubList([sub])}</div>
						))}
					</div>
				</div>

				{/* Small screens */}
				<div className="grid grid-cols-2 gap-3 md:hidden">
					<div className="flex flex-col items-center gap-3">
						{getSubIns(homeId).map((sub, i) => renderSubGrid(sub, i))}
					</div>
					<div className="flex flex-col items-center gap-3">
						{getSubIns(awayId).map((sub, i) => renderSubGrid(sub, i))}
					</div>
				</div>
			</div>
		</div>
	);
}
