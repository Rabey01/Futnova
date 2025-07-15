import { useState,useEffect } from "react";
import Table from "../Components/Table";
import Matches from "../Components/Matches";
import { useLocation,useNavigate } from "react-router-dom";
import { logoMap } from "../logoMap";
import EmptyState from "../Components/EmptyState";

export default function LeagueDetails() {
    const location = useLocation();
    const selectedLeague = location.state?.selectedLeague;
    const [activeTab, setActiveTab] = useState("table");
    const navigate = useNavigate();

    useEffect(() => {
        const redirects = {
            3:   "https://www.fotmob.com/leagues/73/overview/europa-league",
            143: "https://www.fotmob.com/leagues/138/overview/copa-del-rey",
            45:  "https://www.fotmob.com/leagues/132/overview/fa-cup",
            1:   "https://www.fotmob.com/leagues/77/overview/world-cup"
        };

        if (selectedLeague?.id && redirects[selectedLeague.id]) {
            window.open(redirects[selectedLeague.id], "_blank");
            navigate("/");
        }
    }, [selectedLeague, navigate]);

    if (!selectedLeague) return <EmptyState message="No league selected." />;

    const leagueLogo = logoMap[selectedLeague.id];

    return (
        <div className="bg-white shadow-md rounded-xl max-w-5xl mx-auto px-4 py-4 mt-6 mb-6">
            <div className="flex items-center gap-4 mb-4">
                {leagueLogo && (
                    <img src={leagueLogo} alt={selectedLeague.name} className="w-10 h-10 object-contain" />
                )}
                <h1 className="text-xl font-bold">{selectedLeague.name}</h1>
            </div>

            <div className="border-b border-gray-200">
                <div className="flex gap-4">
                    <button onClick={() => setActiveTab("table")} className={`py-2 px-4 font-semibold border-b-2 ${activeTab === "table"? "border-lime-300 text-black font-semibold": "border-transparent text-gray-500 hover:text-black"}`}>
                        Table
                    </button>
                    <button onClick={() => setActiveTab("matches")} className={`py-2 px-4 font-semibold border-b-2 ${ activeTab === "matches"  ? "border-lime-300 text-black font-semibold"  : "border-transparent text-gray-500 hover:text-black"  }`}>
                        Matches
                    </button>
                </div>
            </div>

            <div>
                {activeTab === "table" && <Table leagueId={selectedLeague.id} />}
                {activeTab === "matches" && <Matches leagueId={selectedLeague.id} />}
            </div>
        </div>
    );
}