import { useState,useEffect } from "react";
import Table from "../Components/Table";
import Matches from "../Components/Matches";
import { useLocation,useNavigate } from "react-router-dom";
import { logoMap } from "../logoMap";

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

    if (!selectedLeague) return <p>No league selected.</p>;

    const leagueLogo = logoMap[selectedLeague.id];

    return (
        <div>
            <div>
                {leagueLogo && (
                    <img src={leagueLogo} alt={selectedLeague.name} width="40" />
                )}
                <h1>{selectedLeague.name}</h1>
            </div>

            <div>
                <button onClick={() => setActiveTab("table")}>Table</button>
                <button onClick={() => setActiveTab("matches")}>Matches</button>
            </div>

            <div>
                {activeTab === "table" && (
                    <Table leagueId={selectedLeague.id} />
                )}
                {activeTab === "matches" && (
                    <Matches leagueId={selectedLeague.id} />
                )}
            </div>
        </div>
    );
}