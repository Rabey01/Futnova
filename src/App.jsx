import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import MatchDetails from './pages/MatchDetails'
import LeagueDetails from './pages/LeagueDetails'
import TopLeaguesPage from './pages/TopLeaguesPage'
import Layout from './Components/Layout'

const fontLink = document.createElement("link");
fontLink.rel = "stylesheet";
fontLink.href = "https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap";
document.head.appendChild(fontLink);

function App() {
	return (
		<Router>
			<Routes>
				<Route element={<Layout />}>
					<Route path="/" element={<Home />} />
					<Route path="/fixtures/:id" element={<MatchDetails />} />
					<Route path="/leagues" element={<TopLeaguesPage />} />
					<Route path="/leagues/:id" element={<LeagueDetails />} />
				</Route>
			</Routes>
		</Router>
	)
}
export default App
