import { useNavigate } from "react-router-dom";
import TopLeagues from "../Components/TopLeagues";

export default function TopLeaguesPage() {
  	const navigate = useNavigate();

	const handleLeagueSelect = (league) => {
		navigate(`/leagues/${league.id}`, { state: { selectedLeague: league } });
	};

	return (
		<div className="min-h-screen bg-gray-100 p-4">
			<TopLeagues onSelect={handleLeagueSelect} />
		</div>
	);
}
