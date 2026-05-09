import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../../components/Navbar/Navbar'
import { ROLE_COLOURS, RANKS } from '../../utils/constants'
import './Dashboard.css'

function Dashboard() {
  const navigate = useNavigate()
  const [selectedRank, setSelectedRank] = useState(null)
  const [rankError, setRankError] = useState(false)

  /* TODO: replace with backend user profile data */
  const storedHero = localStorage.getItem('favouriteHero')
  const favouriteHero = storedHero ? JSON.parse(storedHero) : null

  useEffect(() => {
    /* TODO: replace with backend check for favourite_hero === null */
    const heroPicked = localStorage.getItem('heroPicked')
    if (!heroPicked) {
      navigate('/pick-hero')
    }
  }, [])

  const handleAnalyse = () => {
    if (!selectedRank) {
      setRankError(true)
      return
    }
    /* TODO: deduct coin via backend */
    navigate(`/draft?rank=${selectedRank.id}&bans=${selectedRank.bans}`)
  }

  const handleRankSelect = (rank) => {
    setSelectedRank(rank)
    setRankError(false)
  }

  return (
    <div className="dashboard-page">
      <Navbar />

      <main className="dashboard-main">

        {/* Welcome */}
        <div className="dashboard-welcome">
          <h2>Welcome back, <span>Kaiser</span></h2>
          <p>"In the world of Kung Fu, speed defines the winner"</p>
        </div>

        {/* Rank selector */}
        <div className="rank-selector">
          {RANKS.map(rank => (
            <button
              key={rank.id}
              className={`rank-btn ${selectedRank?.id === rank.id ? 'active' : ''}`}
              onClick={() => handleRankSelect(rank)}
            >
              {rank.label}
            </button>
          ))}
        </div>

        {/* Error message */}
        {rankError && (
          <p className="rank-error">Please select your rank before analysing.</p>
        )}

        {/* CTA */}
        <button className="btn-primary btn-analyse" onClick={handleAnalyse}>
          ⚔ Analyse a Draft
        </button>

        {/* Grid */}
        <div className="dashboard-grid">

          {/* Left column — placeholder */}
          <div className="dashboard-left">

          </div>

        </div>
      </main>
    </div>
  )
}

export default Dashboard