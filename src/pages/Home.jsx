import { useState, useEffect} from "react";
import { fetchTodayMatches } from "../../Api";
import MatchCard from "../Components/MatchCard";

export default function Home () {
    const [matches,setMatches] = useState([]);

    useEffect (() => {
        const loadMatches = async () => {
            const data = await fetchTodayMatches();
            setMatches(data);
        };
        loadMatches();
    },[]);

    return (
        <div>
            <h1> Today's Matches </h1>

            {matches.length === 0 ? (
                <p>No matches Today</p>
            ) : (
                matches.map((match) => (
                    <MatchCard key={match.fixture.id} match={match} />
                ))
            )}
        </div>
    );
}