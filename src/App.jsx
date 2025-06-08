import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import MatchDetails from './pages/MatchDetails'

function App() {

  return (
      <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/fixtures/:id" element={<MatchDetails />} />
      </Routes>
    </Router>
  )
}

export default App

