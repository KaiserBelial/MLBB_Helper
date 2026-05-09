import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../../components/Navbar/Navbar'
import './Settings.css'

/* Hero list — replace with API call when backend is ready */
const HEROES = [
  { id: 1,  name: 'Chou',        role: 'Fighter',   initial: 'C' },
  { id: 2,  name: 'Layla',       role: 'Marksman',  initial: 'L' },
  { id: 3,  name: 'Tigreal',     role: 'Tank',      initial: 'T' },
  { id: 4,  name: 'Eudora',      role: 'Mage',      initial: 'E' },
  { id: 5,  name: 'Karina',      role: 'Assassin',  initial: 'K' },
  { id: 6,  name: 'Estes',       role: 'Support',   initial: 'E' },
  { id: 7,  name: 'Gusion',      role: 'Assassin',  initial: 'G' },
  { id: 8,  name: 'Lancelot',    role: 'Assassin',  initial: 'L' },
  { id: 9,  name: 'Kagura',      role: 'Mage',      initial: 'K' },
  { id: 10, name: 'Franco',      role: 'Tank',      initial: 'F' },
  { id: 11, name: 'Hayabusa',    role: 'Assassin',  initial: 'H' },
  { id: 12, name: 'Fanny',       role: 'Assassin',  initial: 'F' },
  { id: 13, name: 'Aldous',      role: 'Fighter',   initial: 'A' },
  { id: 14, name: 'Claude',      role: 'Marksman',  initial: 'C' },
  { id: 15, name: 'Lunox',       role: 'Mage',      initial: 'L' },
  { id: 16, name: 'Khufra',      role: 'Tank',      initial: 'K' },
  { id: 17, name: 'Diggie',      role: 'Support',   initial: 'D' },
  { id: 18, name: 'Granger',     role: 'Marksman',  initial: 'G' },
]

/* Role colours */
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

              {/* Avatar */}
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

              {/* Username */}
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

              {/* Favourite Hero */}
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

                {/* Inline hero picker */}
                {showHeroPicker && (
                  <div className="inline-picker">
                    <input
                      className="picker-search"
                      type="text"
                      placeholder="Search heroes..."
                      value={heroSearch}
                      onChange={e => setHeroSearch(e.target.value)}
                      autoFocus
                    />
                    <div className="inline-hero-grid">
                      {filteredHeroes.map(hero => (
                        <div
                          key={hero.id}
                          className={`inline-hero-card ${favouriteHero?.id === hero.id ? 'selected' : ''}`}
                          onClick={() => handleHeroSelect(hero)}
                        >
                          <div
                            className="inline-hero-portrait"
                            style={{ borderColor: ROLE_COLOURS[hero.role] }}
                          >
                            <span style={{ color: ROLE_COLOURS[hero.role] }}>
                              {hero.initial}
                            </span>
                          </div>
                          <p className="inline-hero-name">{hero.name}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Default Rank */}
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

              {/* Email */}
              <div className="settings-card">
                <h3 className="card-title">Email</h3>
                <p className="card-value">kaiser@example.com</p>
                <p className="card-hint">Contact support to change your email</p>
              </div>

              {/* Logout */}
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