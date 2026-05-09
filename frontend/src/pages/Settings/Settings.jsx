import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../../components/Navbar/Navbar'
import { HEROES, ROLE_COLOURS, RANKS } from '../../utils/constants'
import './Settings.css'

const SECTIONS = ['Profile', 'Preferences', 'Account']

function Settings() {
  const navigate = useNavigate()
  const [activeSection, setActiveSection] = useState('Profile')
  const [heroSearch, setHeroSearch] = useState('')
  const [showHeroPicker, setShowHeroPicker] = useState(false)

  /* TODO: replace with real user data from backend */
  const storedHero = localStorage.getItem('favouriteHero')
  const [favouriteHero, setFavouriteHero] = useState(
    storedHero ? JSON.parse(storedHero) : null
  )
  const [selectedRank, setSelectedRank] = useState(null)
  const [avatar, setAvatar] = useState(null)

  const filteredHeroes = HEROES.filter(h =>
    h.name.toLowerCase().includes(heroSearch.toLowerCase())
  )

  const handleHeroSelect = (hero) => {
    setFavouriteHero(hero)
    /* TODO: send to backend */
    localStorage.setItem('favouriteHero', JSON.stringify(hero))
    setShowHeroPicker(false)
    setHeroSearch('')
  }

  const handleAvatarChange = (e) => {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => setAvatar(reader.result)
    reader.readAsDataURL(file)
  }

  const handleLogout = () => {
    /* TODO: clear JWT and user data from backend */
    localStorage.removeItem('heroPicked')
    localStorage.removeItem('favouriteHero')
    navigate('/login')
  }

  return (
    <div className="settings-page">
      <Navbar />

      <div className="settings-layout">

        {/* Sidebar */}
        <aside className="settings-sidebar">
          {SECTIONS.map(section => (
            <button
              key={section}
              className={`sidebar-btn ${activeSection === section ? 'active' : ''}`}
              onClick={() => setActiveSection(section)}
            >
              {section}
            </button>
          ))}
        </aside>

        {/* Content */}
        <main className="settings-content">

          {/* Profile */}
          {activeSection === 'Profile' && (
            <div className="settings-section">
              <h2 className="settings-title">Profile</h2>

              <div className="settings-card">
                <h3 className="card-title">Profile Picture</h3>
                <div className="avatar-row">
                  <div className="avatar-preview">
                    {avatar
                      ? <img src={avatar} alt="avatar" />
                      : <span>K</span>
                    }
                  </div>
                  <div className="avatar-actions">
                    <label className="btn-upload" htmlFor="avatar-input">
                      Upload Photo
                    </label>
                    <input
                      id="avatar-input"
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarChange}
                      style={{ display: 'none' }}
                    />
                    <p className="avatar-hint">JPG or PNG, max 2MB</p>
                  </div>
                </div>
              </div>

              <div className="settings-card">
                <h3 className="card-title">Username</h3>
                <p className="card-value">Kaiser</p>
                <p className="card-hint">Contact support to change your username</p>
              </div>
            </div>
          )}

          {/* Preferences */}
          {activeSection === 'Preferences' && (
            <div className="settings-section">
              <h2 className="settings-title">Preferences</h2>

              <div className="settings-card">
                <h3 className="card-title">Favourite Hero</h3>
                {favouriteHero && (
                  <div className="current-hero">
                    <div
                      className="current-hero-portrait"
                      style={{ borderColor: ROLE_COLOURS[favouriteHero.role] }}
                    >
                      <span style={{ color: ROLE_COLOURS[favouriteHero.role] }}>
                        {favouriteHero.initial}
                      </span>
                    </div>
                    <div>
                      <p className="current-hero-name">{favouriteHero.name}</p>
                      <p
                        className="current-hero-role"
                        style={{ color: ROLE_COLOURS[favouriteHero.role] }}
                      >
                        {favouriteHero.role}
                      </p>
                    </div>
                  </div>
                )}
                <button
                  className="btn-secondary"
                  onClick={() => setShowHeroPicker(!showHeroPicker)}
                >
                  {showHeroPicker ? 'Cancel' : 'Change Hero'}
                </button>

                {showHeroPicker && (
                  <div className="inline-picker">
                    <input
                      className="search-input"
                      type="text"
                      placeholder="Search heroes..."
                      value={heroSearch}
                      onChange={e => setHeroSearch(e.target.value)}
                      autoFocus
                    />
                    <div className="hero-grid">
                      {filteredHeroes.map(hero => (
                        <div
                          key={hero.id}
                          className={`hero-grid-card ${favouriteHero?.id === hero.id ? 'selected' : ''}`}
                          onClick={() => handleHeroSelect(hero)}
                        >
                          <div
                            className="hero-grid-portrait"
                            style={{ borderColor: ROLE_COLOURS[hero.role] }}
                          >
                            <span style={{ color: ROLE_COLOURS[hero.role] }}>
                              {hero.initial}
                            </span>
                          </div>
                          <p className="hero-grid-name">{hero.name}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="settings-card">
                <h3 className="card-title">Default Rank</h3>
                <p className="card-hint">This will be pre-selected when you start a draft</p>
                <div className="rank-selector">
                  {RANKS.map(rank => (
                    <button
                      key={rank.id}
                      className={`rank-btn ${selectedRank?.id === rank.id ? 'active' : ''}`}
                      onClick={() => setSelectedRank(rank)}
                    >
                      {rank.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Account */}
          {activeSection === 'Account' && (
            <div className="settings-section">
              <h2 className="settings-title">Account</h2>

              <div className="settings-card">
                <h3 className="card-title">Email</h3>
                <p className="card-value">kaiser@example.com</p>
                <p className="card-hint">Contact support to change your email</p>
              </div>

              <div className="settings-card">
                <h3 className="card-title">Session</h3>
                <button className="btn-danger" onClick={handleLogout}>
                  Log Out
                </button>
              </div>
            </div>
          )}

        </main>
      </div>
    </div>
  )
}

export default Settings