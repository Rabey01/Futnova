import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import MatchDetails from './pages/MatchDetails'
import LeagueDetails from './pages/LeagueDetails'
import TopLeaguesPage from './pages/TopLeaguesPage'

function App() {

  return (
      <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/fixtures/:id" element={<MatchDetails />} />
        <Route path="/leagues" element={<TopLeaguesPage />} />
        <Route path="/leagues/:id" element={<LeagueDetails />} />
      </Routes>
    </Router>
  )
}

export default App

