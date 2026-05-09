import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { HEROES, ROLE_COLOURS } from '../../utils/constants'
import './HeroPicker.css'

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