import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../../components/Navbar/Navbar'
import './Dashboard.css'

/* Role colours — matches HeroPicker */
const ROLE_COLOURS = {
  Fighter:  '#ff6b35',
  Marksman: '#00d4ff',
  Tank:     '#3b6bff',
  Mage:     '#b44fff',
  Assassin: '#ff4d6a',
  Support:  '#00e5a0',
}

const RANKS = [
  { id: 'epic',   label: 'Epic or lower', bans: 3 },
  { id: 'legend', label: 'Legend',        bans: 4 },
  { id: 'mythic', label: 'Mythic+',       bans: 5 },
]

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
          <p>Ready to dominate the draft?</p>
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

          {/* Left column */}
          <div className="dashboard-left">

            {/* Hero Card */}
            {favouriteHero && (
              <div className="hero-card-panel">
                <h3 className="panel-title">Favourite Hero</h3>
                <div className="hero-card-content">
                  <div
                    className="hero-card-portrait"
                    style={{ borderColor: ROLE_COLOURS[favouriteHero.role] }}
                  >
                    <span
                      className="hero-card-initial"
                      style={{ color: ROLE_COLOURS[favouriteHero.role] }}
                    >
                      {favouriteHero.initial}
                    </span>
                  </div>
                  <div className="hero-card-info">
                    <p className="hero-card-name">{favouriteHero.name}</p>
                    <p
                      className="hero-card-role"
                      style={{ color: ROLE_COLOURS[favouriteHero.role] }}
                    >
                      {favouriteHero.role}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Stats Panel */}
            <div className="dashboard-stats">
              <h3 className="panel-title">Your Stats</h3>

              <div className="stat-item">
                <span className="stat-label">Games Analysed</span>
                <span className="stat-value">24</span>
              </div>

              <div className="stat-item">
                <span className="stat-label">Win Rate</span>
                <span className="stat-value stat-highlight">68%</span>
              </div>

              <div className="stat-item">
                <span className="stat-label">Coin Balance</span>
                <span className="stat-value stat-highlight">12 ⬡</span>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="dashboard-recent">
            <h3 className="panel-title">Recent Analyses</h3>

            {[1, 2, 3].map((item) => (
              <div className="activity-card" key={item}>
                <div className="activity-info">
                  <span className="activity-title">Draft #{item}</span>
                  <span className="activity-date">2 days ago</span>
                </div>
                <span className="activity-result win">Win</span>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}

export default Dashboard