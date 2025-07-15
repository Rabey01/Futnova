import { useEffect, useState } from "react";
import { useParams,useNavigate } from "react-router-dom";
import { fetchFixtureDetails } from "../../Api";
import MatchEvents from "../Components/match details collection/MatchEvents";
import Lineup from "../Components/match details collection/Lineup";
import StatsPage from "../Components/match details collection/StatsPage";
import PlayerStats from "../Components/match details collection/PlayerStats";
import SkeletonLoader from "../Components/SkeletonLoader";
import ErrorFallback from "../Components/ErrorFallback";
import EmptyState from "../Components/EmptyState";

export default function MatchDetails() {
	const { id } = useParams();
	const [fixtureDetails, setFixtureDetails] = useState(null);
	const [view, setView] = useState("facts");
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(false);
	const navigate = useNavigate();

	const loadDetails = async () => {
		setLoading(true);
		setError(false);
		try {
			const data = await fetchFixtureDetails(id);
			setFixtureDetails(data);
		} catch (err) {
			console.error(err);
			setError(true);
		} finally {
			setLoading(false);
		}
		
	};

	useEffect(() => {
		loadDetails();
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [id]);

	if (loading) return <SkeletonLoader type="card" count={1} />;
	if (error) return <ErrorFallback message="Failed to load match details." onRetry={loadDetails} />;
	if (!fixtureDetails) return <EmptyState message="Match details not available." />;

	const { fixture, teams, goals, events, statistics, lineups, players,league } = fixtureDetails;

	return (
		<div className="min-h-screen bg-gray-50 px-4 py-6 sm:px-8">
			<div className="max-w-3xl mx-auto bg-white rounded-xl border border-gray-100 space-y-4">
				
				{/* Top Bar */}
				<div className="flex items-center justify-between text-sm text-gray-600 border-b p-6 pb-3 relative">
					{/* Back Button */}
					<span className="w-[24px] flex justify-start">
						<img src="/src/assets/backBtn.svg" alt="Back" className="w-5 h-5 cursor-pointer" onClick={() => navigate("/")} />
					</span>

					{/* League Info */}
					<div className="absolute left-1/2 transform -translate-x-1/2 flex items-center gap-2 text-gray-700 text-sm font-medium">
						{league?.logo && (
							<img src={league.logo} alt="league" className="w-6 h-6 object-contain" />
						)}
						<span className="text-xs sm:text-base text-center font-medium">{league?.name} {league?.round}</span>
					</div>
				</div>

				{/* Meta Info */}
				<div className="hidden sm:flex flex-wrap justify-center text-sm text-gray-600 font-semibold gap-5 text-center border-b pb-3">
					<span className="flex items-center gap-2">
						<img src="/src/assets/Icons/calendar.png" className="w-4 h-4" alt="calendar" />
						{new Date(fixture?.date).toLocaleString("en-US", {
							weekday: 'short', month: 'short', day: 'numeric',
							hour: 'numeric', minute: 'numeric'
						})}
					</span>

					<span className="flex items-center gap-2">
						<img src="/src/assets/Icons/stadium.png" className="w-4 h-4" alt="stadium" />
						{fixture.venue.name}
					</span>

					<span className="flex items-center gap-2">
						<img src="/src/assets/Icons/whistle.png" className="w-4 h-4" alt="referee" />
						{fixture.referee}
					</span>
				</div>

				{/* Teams & Score */}
				<div className="flex items-center justify-between text-center gap-2 sm:gap-4 text-[13px] sm:text-base">
					<div className="w-1/3 flex flex-col items-center sm:block">
						<div className="order-2 sm:order-none mt-1 sm:mt-0">
							<p className="font-medium text-xs sm:text-base text-center min-h-[2rem]">{teams?.home?.name}</p>
						</div>
						<div className="order-1 sm:order-none">
							<img src={teams?.home?.logo} alt="home" className="h-8 sm:h-10 mx-auto my-1" />
						</div>
					</div>

					<div className="w-1/3">
						<p className="text-xl sm:text-2xl font-bold">{goals?.home} - {goals?.away}</p>
						<p className="text-[11px] sm:text-xs text-gray-500">{fixture?.status?.long}</p>
					</div>

					<div className="w-1/3 flex flex-col items-center sm:block">
						<div className="order-2 sm:order-none mt-1 sm:mt-0">
							<p className="font-medium text-xs sm:text-base mt-1 sm:mt-0 min-h-[2rem]">{teams?.away?.name}</p>							
						</div>
						<div className="order-1 sm:order-none">
							<img src={teams?.away?.logo} alt="away" className="h-8 sm:h-10 mx-auto my-1" />							
						</div>
					</div>
				</div>

				{/* Goal Events */}
				{(() => {
					const formatGoals = (goalArray) => {
						const grouped = {};
						goalArray.forEach(e => {
							const name = e.player?.name;
							const minute = `${e.time?.elapsed}'`;
							if (!grouped[name]) grouped[name] = [];
							grouped[name].push(minute);
						});
						return grouped;
					}
					const homeGoals = formatGoals(events.filter(e => e.type === "Goal" && e.team?.id === teams.home.id));
					const awayGoals = formatGoals(events.filter(e => e.type === "Goal" && e.team?.id === teams.away.id));
					const maxLength = Math.max(Object.keys(homeGoals).length, Object.keys(awayGoals).length);

					const getEntry = (obj, index) => {
						const keys = Object.keys(obj);
						const name = keys[index];
						if (!name) return "";
						const minutes = obj[name].join(", ");
						return <span className="text-gray-500"><span className="font-semibold">{name.split(" ").slice(-1)[0]}</span> <span className="font-bold">{minutes}</span></span>;
					};
					
					return (
						<div className="flex flex-col gap-1 text-[11px] sm:text-sm">
							{Array.from({ length: maxLength }).map((_, i) => (
									<div key={i} className="grid grid-cols-3 items-center">
										<div className="text-right pr-1 sm:pr-2">{getEntry(homeGoals, i)}</div>
										<div className="text-center">
											{i === 0 && (
												<img
													src="https://img.icons8.com/plasticine/26/football2.png"alt="goal-icon"className="w-4 h-4 sm:w-5 sm:h-5 inline-block"
												/>
											)}
										</div>
										<div className="text-left pl-1 sm:pl-2">{getEntry(awayGoals, i)}</div>
									</div>
							))}
						</div>
					);
				})()}


				{/* Tab Controls */}
				<div className="flex justify-center gap-6 border-gray-200 p-6">
					{[
						{ type: "facts", label: "Facts", data: events },
						{ type: "lineups", label: "Lineup", data: lineups },
						{ type: "stats", label: "Stats", data: statistics },
						{ type: "players", label: "Player Stats", data: players },
					].map(({ type, label, data }) => (
						data?.length > 0 && (
							<button
								key={type}
								onClick={() => setView(type)}
								className={`relative pb-2 text-sm sm:text-base font-medium transition-colors duration-200 
									${view === type ? "text-black font-semibold" : "text-gray-500 hover:text-black"}
								`}
							>
								{label}
								{view === type && (
									<span className="absolute bottom-0 left-0 w-full h-[3px] bg-lime-300 rounded"></span>
								)}
							</button>
						)
					))}
				</div>
			</div>

			{/* Tab Content Outside */}
			<div className="max-w-3xl mx-auto mt-6">
				{view === "facts" && events?.length > 0 && (
					<>
						<MatchEvents events={events} homeTeamId={teams?.home?.id} matchStatus={fixture?.status?.short}/>
						{lineups?.length >= 2 && players?.length > 0 && (
							<div className="mt-6">
								<Lineup lineups={lineups} players={players} events={events} showCoach={false}/>
							</div>
						)}
					</>	
				)}
				{view === "lineups" && lineups?.length >= 2 && players?.length > 0 && (
					<Lineup lineups={lineups} players={players} events={events}/>
				)}
				{view === "stats" && statistics?.length > 0 && <StatsPage statistics={statistics} lineups={lineups} />}
				{view === "players" && players?.length > 0 && <PlayerStats players={players} />}
			</div>
		</div>
	);
}