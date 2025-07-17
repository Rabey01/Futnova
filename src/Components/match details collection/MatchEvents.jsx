import { Fragment } from "react";
import subIcon from '../../assets/Icons/substitute.png'

export default function MatchEvents({ events, homeTeamId,matchStatus }) {
  
  	if (!events?.length) return null;
  
	// Icon selectors
	const getIconUrl = (type, detail) => {
		if (type === "Card" && detail === "Red Card") return "https://img.icons8.com/color/26/foul.png";
		if (type === "Card" && detail === "Yellow Card") return "https://img.icons8.com/color/26/soccer-yellow-card.png";
		if (type === "Goal") return "https://img.icons8.com/plasticine/26/football2.png";
		if (type === "subst") return subIcon;
		return null;
	};
  	const secondHalfIndex = events.findIndex(e => e.time?.elapsed >= 46) || 0;
	const markerMap = {
		[secondHalfIndex - 1]: "HT",
		[events.length - 1]: matchStatus === "FT" ? "FT" : matchStatus === "AET" ? "ET" : matchStatus === "PEN" ? "PEN" : null
	};
	
	return (
		<section className="max-w-4xl mx-auto bg-white rounded-xl border border-gray-100 p-6 mb-6">
			<h3 className="text-lg font-semibold text-gray-800 border-b pb-4 mb-6 text-center">
				Events
			</h3>

			<ul className="space-y-5">
				{events.map((event, idx) => {
					const isHome = event.team?.id === homeTeamId;
					const iconUrl = getIconUrl(event.type, event.detail);
					const time = `${event.time?.elapsed}'${event.time?.extra ? ` +${event.time.extra}` : ""}`;

					return (
						<Fragment key={idx}>
							<li className="text-sm text-gray-800">
								<div className="hidden sm:grid grid-cols-[1fr_30px_60px_30px_1fr] items-center gap-2">
									{/* Home Player Name */}
									<div className={`text-right ${isHome ? "" : "invisible"}`}>
										{event.type === "subst" ? (
											<>
												<p className="font-medium text-green-600">{event.assist?.name}</p> {/* Subbed IN */}
												<p className="font-medium text-red-500">{event.player?.name}</p>   {/* Subbed OUT */}
											</>
										) : (
											<>
												<p className="font-medium">{event.player?.name}</p>
												{event.assist?.name && event.type === "Goal" && (
													<p className="text-xs text-gray-500">Assist: {event.assist.name}</p>
												)}
											</>
										)}
									</div>

									{/* Home Icon */}
									<div className={`flex justify-center ${isHome ? "" : "invisible"}`}>
										<span className="bg-white rounded-full p-[2px] border">
											{iconUrl && <img src={iconUrl} alt="icon" className="w-5 h-5" />}
										</span>
									</div>

									{/* Time */}
									<div className="flex items-center justify-center">
										<span className="bg-gray-200 text-gray-700 text-[11px] font-semibold px-2 py-1 rounded-full">
											{time}
										</span>
									</div>

									{/* Away Icon */}
									<div className={`flex justify-center ${!isHome ? "" : "invisible"}`}>
										<span className="bg-white rounded-full p-[2px] border">
											{iconUrl && <img src={iconUrl} alt="icon" className="w-5 h-5" />}
										</span>
									</div>

									{/* Away Player Name */}
									<div className={`text-left ${!isHome ? "" : "invisible"}`}>
										{event.type === "subst" ? (
											<>
												<p className="font-medium text-green-600">{event.assist?.name}</p> {/* Subbed IN */}
												<p className="font-medium text-red-500">{event.player?.name}</p>   {/* Subbed OUT */}
											</>
										) : (
											<>
												<p className="font-medium">{event.player?.name}</p>
												{event.assist?.name && event.type === "Goal" && (
													<p className="text-xs text-gray-500">Assist: {event.assist.name}</p>
												)}
											</>
										)}
									</div>
								</div>
								{/* Mobile View */}
								<div className={`sm:hidden w-full text-[13px] ${isHome ? "text-left" : "text-right"} flex flex-col`}>
									<div className={`flex items-center gap-3 ${isHome ? "justify-start" : "justify-end"}`}>
										{isHome && (
											<>
												<span className="min-w-[42px] text-center bg-gray-200 text-gray-700 text-[11px] font-semibold px-2 py-0.5 rounded-full">
													{time}
												</span>
												<span className="bg-white rounded-full p-[2px] border">
													{iconUrl && <img src={iconUrl} alt="icon" className="w-5 h-5" />}
												</span>
											</>
										)}

										<div>
											{event.type === "subst" ? (
												<>
													<p className="font-medium text-green-600 text-xs">
														{event.assist?.name}
													</p>
													<p className="font-medium text-red-500 text-xs">
														{event.player?.name}
													</p>
												</>
											) : (
												<>
													<p className="font-medium">{event.player?.name}</p>
													{event.assist?.name && event.type === "Goal" && (
														<p className="text-xs text-gray-500">Assist: {event.assist.name}</p>
													)}
												</>
											)}
										</div>

										{!isHome && (
											<>
												<span className="bg-white rounded-full p-[2px] border">
													{iconUrl && <img src={iconUrl} alt="icon" className="w-5 h-5" />}
												</span>
												<span className="bg-gray-200 text-gray-700 text-[11px] font-semibold px-2 py-0.5 rounded-full min-w-[36px] text-center">
													{time}
												</span>
											</>
										)}
									</div>
								</div>
							</li>
							{markerMap[idx] && (
								<div className="flex items-center my-4">
									<div className="flex-grow border-t border-gray-300"></div>
									<span className="px-3 text-sm font-semibold text-gray-500">{markerMap[idx]}</span>
									<div className="flex-grow border-t border-gray-300"></div>
								</div>
							)}
						</Fragment>
					);
				})}
			</ul>
		</section>
	);
}
