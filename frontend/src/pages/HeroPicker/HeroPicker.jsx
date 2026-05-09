import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './HeroPicker.css'

/* Hero data — replace with API call when backend is ready */
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

/* Role colours — keyed by role name */
const ROLE_COLOURS = {
  Fighter:  '#ff6b35',
  Marksman: '#00d4ff',
  Tank:     '#3b6bff',
  Mage:     '#b44fff',
  Assassin: '#ff4d6a',
  Support:  '#00e5a0',
}

function HeroPicker() {
  const [selected, setSelected] = useState(null)
  const [filter, setFilter] = useState('All')
  const navigate = useNavigate()

  const roles = ['All', 'Fighter', 'Marksman', 'Tank', 'Mage', 'Assassin', 'Support']

  const filtered = filter === 'All'
    ? HEROES
    : HEROES.filter(h => h.role === filter)

  const handleConfirm = () => {
    /* TODO: send selected hero to backend, remove localStorage when done */
    localStorage.setItem('heroPicked', 'true')
    localStorage.setItem('favouriteHero', JSON.stringify(selected))
    navigate('/dashboard')
  }

  return (
    <div className="picker-page">
      <div className="picker-header">
        <h1>Choose Your <span>Favourite Hero</span></h1>
        <p>This will appear on your dashboard. You can change it anytime in settings.</p>
      </div>

      {/* Role filter */}
      <div className="picker-filters">
        {roles.map(role => (
          <button
            key={role}
            className={`filter-btn ${filter === role ? 'active' : ''}`}
            onClick={() => setFilter(role)}
          >
            {role}
          </button>
        ))}
      </div>

      {/* Hero grid */}
      <div className="picker-grid">
        {filtered.map(hero => (
          <div
            key={hero.id}
            className={`hero-card ${selected?.id === hero.id ? 'selected' : ''}`}
            onClick={() => setSelected(hero)}
          >
            <div
              className="hero-portrait"
              style={{ borderColor: ROLE_COLOURS[hero.role] }}
            >
              <span
                className="hero-initial"
                style={{ color: ROLE_COLOURS[hero.role] }}
              >
                {hero.initial}
              </span>
            </div>

            <p className="hero-name">{hero.name}</p>
            <p
              className="hero-role"
              style={{ color: ROLE_COLOURS[hero.role] }}
            >
              {hero.role}
            </p>
          </div>
        ))}
      </div>

      {/* Confirm button */}
      {selected && (
        <div className="picker-confirm">
          <p>Selected: <span>{selected.name}</span></p>
          <button className="btn-primary" onClick={handleConfirm}>
            Confirm Choice
          </button>
        </div>
      )}
    </div>
  )
}

export default HeroPicker