import { useSearchParams, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import Navbar from '../../components/Navbar/Navbar'
import './Draft.css'

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

const PICK_COUNT = 5

function Draft() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  const rank = searchParams.get('rank') || 'epic'
  const bans = parseInt(searchParams.get('bans')) || 3

  const [phase, setPhase] = useState('bans')
  const [activeSlot, setActiveSlot] = useState(null)
  const [search, setSearch] = useState('')
  const [myBans, setMyBans] = useState(Array(bans).fill(null))
  const [enemyBans, setEnemyBans] = useState(Array(bans).fill(null))
  const [myPicks, setMyPicks] = useState(Array(PICK_COUNT).fill(null))
  const [enemyPicks, setEnemyPicks] = useState(Array(PICK_COUNT).fill(null))

  /* separate used ids per team */
  const myUsedIds = [
    ...myBans.filter(Boolean).map(h => h.id),
    ...myPicks.filter(Boolean).map(h => h.id),
  ]

  const enemyUsedIds = [
    ...enemyBans.filter(Boolean).map(h => h.id),
    ...enemyPicks.filter(Boolean).map(h => h.id),
  ]

  const filtered = HEROES.filter(h => {
    const usedIds = activeSlot?.team === 'my' ? myUsedIds : enemyUsedIds
    return (
      h.name.toLowerCase().includes(search.toLowerCase()) &&
      !usedIds.includes(h.id)
    )
  })

  const handleSlotClick = (team, index, type) => {
    setActiveSlot({ team, index, type })
    setSearch('')
  }

  const handleHeroSelect = (hero) => {
    if (!activeSlot) return

    const { team, index, type } = activeSlot

    if (type === 'ban') {
      if (team === 'my') {
        const updated = [...myBans]
        updated[index] = hero
        setMyBans(updated)
      } else {
        const updated = [...enemyBans]
        updated[index] = hero
        setEnemyBans(updated)
      }
    } else {
      if (team === 'my') {
        const updated = [...myPicks]
        updated[index] = hero
        setMyPicks(updated)
      } else {
        const updated = [...enemyPicks]
        updated[index] = hero
        setEnemyPicks(updated)
      }
    }

    setActiveSlot(null)
    setSearch('')
  }

  const handleSlotClear = (team, index, type, e) => {
    e.stopPropagation()
    if (type === 'ban') {
      if (team === 'my') {
        const updated = [...myBans]
        updated[index] = null
        setMyBans(updated)
      } else {
        const updated = [...enemyBans]
        updated[index] = null
        setEnemyBans(updated)
      }
    } else {
      if (team === 'my') {
        const updated = [...myPicks]
        updated[index] = null
        setMyPicks(updated)
      } else {
        const updated = [...enemyPicks]
        updated[index] = null
        setEnemyPicks(updated)
      }
    }
  }

  const rankLabel = {
    epic:   'Epic or lower',
    legend: 'Legend',
    mythic: 'Mythic+',
  }[rank]

  const renderSlot = (hero, i, team, type) => {
    const isActive =
      activeSlot?.team === team &&
      activeSlot?.index === i &&
      activeSlot?.type === type

    return (
      <div
        key={i}
        className={`draft-slot ${hero ? 'filled' : ''} ${isActive ? 'active' : ''} ${type}`}
        onClick={() => handleSlotClick(team, i, type)}
      >
        {hero ? (
          <>
            <span
              className="slot-initial"
              style={{ color: ROLE_COLOURS[hero.role] }}
            >
              {hero.initial}
            </span>
            <span className="slot-name">{hero.name}</span>
            <button
              className="slot-clear"
              onClick={(e) => handleSlotClear(team, i, type, e)}
            >
              ✕
            </button>
          </>
        ) : (
          <span className="slot-empty">
            {type === 'ban' ? `Ban ${i + 1}` : `Pick ${i + 1}`}
          </span>
        )}
      </div>
    )
  }

  return (
    <div className="draft-page">
      <Navbar />

      <main className="draft-main">

        {/* Header */}
        <div className="draft-header">
          <h2>Draft Analysis <span>{rankLabel}</span></h2>
          <p>{bans} bans per team</p>
        </div>

        {/* Phase indicator */}
        <div className="draft-phases">
          <div className={`phase-step ${phase === 'bans' ? 'active' : 'done'}`}>
            <span className="phase-number">1</span>
            <span className="phase-label">Bans</span>
          </div>
          <div className="phase-divider" />
          <div className={`phase-step ${phase === 'picks' ? 'active' : ''}`}>
            <span className="phase-number">2</span>
            <span className="phase-label">Picks</span>
          </div>
        </div>

        {/* Bans phase */}
        {phase === 'bans' && (
          <>
            <div className="draft-bans">
              <div className="ban-section">
                <h3 className="section-title my">Your Team Bans</h3>
                <div className="slots-row">
                  {myBans.map((hero, i) => renderSlot(hero, i, 'my', 'ban'))}
                </div>
              </div>

              <div className="ban-section">
                <h3 className="section-title enemy">Enemy Team Bans</h3>
                <div className="slots-row">
                  {enemyBans.map((hero, i) => renderSlot(hero, i, 'enemy', 'ban'))}
                </div>
              </div>
            </div>

            <button
              className="btn-primary"
              onClick={() => { setPhase('picks'); setActiveSlot(null) }}
            >
              Lock in Bans →
            </button>
          </>
        )}

        {/* Picks phase */}
        {phase === 'picks' && (
          <>
            <div className="draft-picks">
              <div className="picks-section my-picks">
                <h3 className="section-title my">Your Team</h3>
                <div className="picks-col">
                  {myPicks.map((hero, i) => renderSlot(hero, i, 'my', 'pick'))}
                </div>
              </div>

              <div className="picks-section enemy-picks">
                <h3 className="section-title enemy">Enemy Team</h3>
                <div className="picks-col">
                  {enemyPicks.map((hero, i) => renderSlot(hero, i, 'enemy', 'pick'))}
                </div>
              </div>
            </div>

            <div className="draft-picks-actions">
              <button
                className="btn-secondary"
                onClick={() => { setPhase('bans'); setActiveSlot(null) }}
              >
                ← Edit Bans
              </button>
              <button
                className="btn-primary"
                onClick={() => navigate('/dashboard')}
              >
                Analyse Draft
              </button>
            </div>
          </>
        )}

        {/* Hero picker — shows when a slot is active */}
        {activeSlot && (
          <div className="draft-picker">
            <input
              className="draft-search"
              type="text"
              placeholder="Search heroes..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              autoFocus
            />
            <div className="draft-hero-grid">
              {filtered.map(hero => (
                <div
                  key={hero.id}
                  className="draft-hero-card"
                  onClick={() => handleHeroSelect(hero)}
                >
                  <div
                    className="draft-hero-portrait"
                    style={{ borderColor: ROLE_COLOURS[hero.role] }}
                  >
                    <span style={{ color: ROLE_COLOURS[hero.role] }}>
                      {hero.initial}
                    </span>
                  </div>
                  <p className="draft-hero-name">{hero.name}</p>
                </div>
              ))}
            </div>
          </div>
        )}

      </main>
    </div>
  )
}

export default Draft