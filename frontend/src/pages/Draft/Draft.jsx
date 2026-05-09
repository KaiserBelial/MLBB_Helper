import { useSearchParams, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import {
  DndContext,
  DragOverlay,
  useDraggable,
  useDroppable,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import Navbar from '../../components/Navbar/Navbar'
import { HEROES, ROLE_COLOURS, PICK_COUNT } from '../../utils/constants'
import './Draft.css'

const LANES = ['Jungle', 'Roam', 'EXP Lane', 'Mid Lane', 'Gold Lane']
const ROLES = ['All', 'Fighter', 'Marksman', 'Tank', 'Mage', 'Assassin', 'Support']

/* ── Hero Popup (synergy or counter) ────────────── */
function HeroPopup({ title, hero, type, allBannedIds, pickedIds, onClose }) {
  const [roleFilter, setRoleFilter] = useState('All')

  /* TODO: replace with backend synergy/counter data */
  const suggestions = HEROES.filter(h =>
    h.id !== hero?.id &&
    !allBannedIds.includes(h.id) &&
    !pickedIds.includes(h.id) &&
    (roleFilter === 'All' || h.role === roleFilter)
  ).slice(0, 12)

  return (
    <div className="popup-backdrop" onClick={onClose}>
      <div className="popup-modal" onClick={e => e.stopPropagation()}>

        <div className="popup-header">
          <h3 className="popup-title">{title}</h3>
          <button className="popup-close" onClick={onClose}>✕</button>
        </div>

        <div className="popup-body">

          {/* Left — scrollable hero list */}
          <div className="popup-left">
            <div className="popup-filters">
              {ROLES.map(role => (
                <button
                  key={role}
                  className={`popup-filter-btn ${roleFilter === role ? 'active' : ''}`}
                  onClick={() => setRoleFilter(role)}
                >
                  {role}
                </button>
              ))}
            </div>
            <div className="popup-hero-list">
              {suggestions.length === 0 ? (
                <p className="popup-empty">No heroes available</p>
              ) : (
                suggestions.map((h, i) => (
                  <div key={h.id} className="popup-hero-item">
                    <span className="popup-hero-rank">#{i + 1}</span>
                    <div
                      className="popup-hero-portrait"
                      style={{ borderColor: ROLE_COLOURS[h.role] }}
                    >
                      <span style={{ color: ROLE_COLOURS[h.role] }}>{h.initial}</span>
                    </div>
                    <div className="popup-hero-info">
                      <span className="popup-hero-name">{h.name}</span>
                      <span
                        className="popup-hero-role"
                        style={{ color: ROLE_COLOURS[h.role] }}
                      >
                        {h.role}
                      </span>
                    </div>
                    {/* TODO: backend will provide actual score */}
                    <span className="popup-hero-score">
                      {Math.max(60, 95 - i * 4)}%
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Right — target hero card */}
          <div className="popup-right">
            <p className="popup-right-label">
              {type === 'synergy' ? 'Synergises with' : 'Counter for'}
            </p>
            {hero ? (
              <div className="popup-target-card">
                <div
                  className="popup-target-portrait"
                  style={{ borderColor: ROLE_COLOURS[hero.role] }}
                >
                  <span style={{ color: ROLE_COLOURS[hero.role] }}>
                    {hero.initial}
                  </span>
                </div>
                <p className="popup-target-name">{hero.name}</p>
                <p
                  className="popup-target-role"
                  style={{ color: ROLE_COLOURS[hero.role] }}
                >
                  {hero.role}
                </p>
                <p className="popup-todo">
                  /* TODO: backend data */
                </p>
              </div>
            ) : (
              <p className="popup-empty">No hero picked</p>
            )}
          </div>

        </div>
      </div>
    </div>
  )
}

/* ── Draggable hero chip ─────────────────────────── */
function DraggableHero({ hero, id }) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({ id })

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className={`pick-hero-chip ${isDragging ? 'dragging' : ''}`}
    >
      <span className="drag-handle">⠿</span>
      <span className="chip-name" style={{ color: ROLE_COLOURS[hero.role] }}>
        {hero.name}
      </span>
    </div>
  )
}

/* ── Droppable lane row ──────────────────────────── */
function LaneRow({ lane, hero, team, onSlotClick, onClear, dragActiveId, onAction, allBannedIds, pickedIds, lastPicked }) {
  const id = `${team}-${lane}`
  const { setNodeRef, isOver } = useDroppable({ id })

  const dragTeam = dragActiveId?.split('-')[0]
  const sameTeam = dragTeam === team
  const justPicked = lastPicked === `${team}-${lane}`

  return (
    <div
      ref={setNodeRef}
      className={`lane-row ${isOver && sameTeam ? 'drop-over' : ''}`}
    >
      <span className="lane-label">{lane}</span>

      {hero ? (
        <div
          className={`lane-slot filled ${justPicked ? 'just-picked' : ''}`}
          style={{ '--hero-colour': ROLE_COLOURS[hero.role] }}
        >
          <div className="lane-slot-bg">
            <span
              className="lane-slot-bg-initial"
              style={{ color: ROLE_COLOURS[hero.role] }}
            >
              {hero.initial}
            </span>
          </div>
          <DraggableHero hero={hero} id={`${team}-${lane}-hero`} />
          <button
            className="slot-clear"
            onClick={e => { e.stopPropagation(); onClear(team, lane) }}
          >
            ✕
          </button>
        </div>
      ) : (
        <div
          className={`lane-slot empty ${isOver && sameTeam ? 'over' : ''}`}
          onClick={() => onSlotClick(team, lane)}
        >
          <span className="slot-empty-label">Click to pick</span>
        </div>
      )}

      {hero && (
        <button
          className={`lane-action-btn ${team === 'my' ? 'synergy' : 'counter'}`}
          onClick={() => onAction(team, lane, hero)}
        >
          {team === 'my' ? 'Synergy' : 'Counter'}
        </button>
      )}
    </div>
  )
}

/* ── Ban Strip ───────────────────────────────────── */
function BanStrip({ myBans, enemyBans }) {
  const seen = new Set()
  const allBans = [...myBans, ...enemyBans].filter(Boolean).filter(hero => {
    if (seen.has(hero.id)) return false
    seen.add(hero.id)
    return true
  })

  if (allBans.length === 0) return null

  return (
    <div className="ban-strip-wrapper">
      <p className="ban-strip-label">Bans</p>
      <div className="ban-strip">
        {allBans.map((hero, i) => (
          <div key={i} className="ban-chip-col">
            <div
              className="ban-chip"
              style={{ borderColor: ROLE_COLOURS[hero.role] }}
            >
              <span style={{ color: ROLE_COLOURS[hero.role] }}>{hero.initial}</span>
            </div>
            <span className="ban-chip-name">{hero.name}</span>
          </div>
        ))}
      </div>
    </div>
  )
}


/* ── Main Draft component ────────────────────────── */
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
  const [dragActiveId, setDragActiveId] = useState(null)
  const [popup, setPopup] = useState(null)
  const [lastPicked, setLastPicked] = useState(null)

  const emptyLanePicks = () => Object.fromEntries(LANES.map(l => [l, null]))
  const [myPicks, setMyPicks] = useState(emptyLanePicks())
  const [enemyPicks, setEnemyPicks] = useState(emptyLanePicks())

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(TouchSensor, {
      activationConstraint: { delay: 100, tolerance: 5 }
    })
  )

  const myPickList = Object.values(myPicks).filter(Boolean)
  const enemyPickList = Object.values(enemyPicks).filter(Boolean)
  const myBanIds = myBans.filter(Boolean).map(h => h.id)
  const enemyBanIds = enemyBans.filter(Boolean).map(h => h.id)
  const allBannedIds = [...myBanIds, ...enemyBanIds]
  const myPickedIds = myPickList.map(h => h.id)
  const enemyPickedIds = enemyPickList.map(h => h.id)
  const myUsedIds = [...myBanIds, ...myPickedIds]
  const enemyUsedIds = [...enemyBanIds, ...enemyPickedIds]

  const conflicts = []
  myPickList.forEach(hero => {
    if (allBannedIds.includes(hero.id))
      conflicts.push(`${hero.name} is picked by your team but also banned`)
  })
  enemyPickList.forEach(hero => {
    if (allBannedIds.includes(hero.id))
      conflicts.push(`${hero.name} is picked by enemy team but also banned`)
  })
  myPickList.forEach(hero => {
    if (enemyPickedIds.includes(hero.id))
      conflicts.push(`${hero.name} is picked by both teams`)
  })

  const filtered = HEROES.filter(h => {
    if (activeSlot?.type === 'ban') {
      const usedIds = activeSlot?.team === 'my' ? myUsedIds : enemyUsedIds
      return (
        h.name.toLowerCase().includes(search.toLowerCase()) &&
        !usedIds.includes(h.id)
      )
    } else {
      const allPickedIds = [...myPickedIds, ...enemyPickedIds]
      return (
        h.name.toLowerCase().includes(search.toLowerCase()) &&
        !allBannedIds.includes(h.id) &&
        !allPickedIds.includes(h.id)
      )
    }
  })

  const getDragHero = () => {
    if (!dragActiveId) return null
    const withoutHero = dragActiveId.replace('-hero', '')
    const firstDash = withoutHero.indexOf('-')
    const team = withoutHero.substring(0, firstDash)
    const lane = withoutHero.substring(firstDash + 1)
    return team === 'my' ? myPicks[lane] : enemyPicks[lane]
  }

  const handleDragStart = ({ active }) => setDragActiveId(active.id)

  const handleDragEnd = ({ active, over }) => {
    setDragActiveId(null)
    if (!over) return

    const srcId = active.id.replace('-hero', '')
    const firstDashSrc = srcId.indexOf('-')
    const srcTeam = srcId.substring(0, firstDashSrc)
    const srcLane = srcId.substring(firstDashSrc + 1)

    const firstDashDest = over.id.indexOf('-')
    const destTeam = over.id.substring(0, firstDashDest)
    const destLane = over.id.substring(firstDashDest + 1)

    if (srcTeam !== destTeam) return
    if (srcLane === destLane) return

    const picks = srcTeam === 'my' ? { ...myPicks } : { ...enemyPicks }
    const setter = srcTeam === 'my' ? setMyPicks : setEnemyPicks

    const tmp = picks[destLane]
    picks[destLane] = picks[srcLane]
    picks[srcLane] = tmp
    setter(picks)
  }

  const handleSlotClick = (team, lane) => {
    setActiveSlot({ team, lane, type: 'pick' })
    setSearch('')
  }

  const handleBanSlotClick = (team, index) => {
    setActiveSlot({ team, index, type: 'ban' })
    setSearch('')
  }

  const handleHeroSelect = (hero) => {
    if (!activeSlot) return

    if (activeSlot.type === 'ban') {
      const { team, index } = activeSlot
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
      const { team, lane } = activeSlot
      if (team === 'my') {
        setMyPicks(prev => ({ ...prev, [lane]: hero }))
      } else {
        setEnemyPicks(prev => ({ ...prev, [lane]: hero }))
      }
      /* trigger animation */
      setLastPicked(`${team}-${lane}`)
      setTimeout(() => setLastPicked(null), 600)
    }

    setActiveSlot(null)
    setSearch('')
  }

  const handleClear = (team, lane) => {
    if (team === 'my') {
      setMyPicks(prev => ({ ...prev, [lane]: null }))
    } else {
      setEnemyPicks(prev => ({ ...prev, [lane]: null }))
    }
  }

  const handleBanClear = (team, index, e) => {
    e.stopPropagation()
    if (team === 'my') {
      const updated = [...myBans]
      updated[index] = null
      setMyBans(updated)
    } else {
      const updated = [...enemyBans]
      updated[index] = null
      setEnemyBans(updated)
    }
  }

  const handleAction = (team, lane, hero) => {
    setPopup({
      type: team === 'my' ? 'synergy' : 'counter',
      title: team === 'my'
        ? `Synergy for ${hero.name}`
        : `Counters for ${hero.name}`,
      hero,
    })
  }

  const handleReset = () => {
    if (phase === 'bans') {
      setMyBans(Array(bans).fill(null))
      setEnemyBans(Array(bans).fill(null))
    } else if (phase === 'picks') {
      setMyPicks(emptyLanePicks())
      setEnemyPicks(emptyLanePicks())
    } else if (phase === 'analysis') {
      setMyPicks(emptyLanePicks())
      setEnemyPicks(emptyLanePicks())
      setPhase('picks')
    }
    setActiveSlot(null)
    setSearch('')
  }

  const rankLabel = {
    epic:   'Epic or lower',
    legend: 'Legend',
    mythic: 'Mythic+',
  }[rank]

  const renderBanSlot = (hero, i, team) => {
    const isActive = activeSlot?.type === 'ban' &&
      activeSlot?.team === team &&
      activeSlot?.index === i

    return (
      <div
        key={i}
        className={`draft-slot ban ${hero ? 'filled' : ''} ${isActive ? 'active' : ''}`}
        onClick={() => handleBanSlotClick(team, i)}
      >
        {hero ? (
          <>
            <span className="slot-initial" style={{ color: ROLE_COLOURS[hero.role] }}>
              {hero.initial}
            </span>
            <span className="slot-name">{hero.name}</span>
            <button className="slot-clear" onClick={e => handleBanClear(team, i, e)}>✕</button>
          </>
        ) : (
          <span className="slot-empty">Ban {i + 1}</span>
        )}
      </div>
    )
  }

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="draft-page">
        <Navbar />

        <main className="draft-main">

          {/* Header */}
          <div className="draft-header">
            <h2>Draft Analysis <span>{rankLabel}</span></h2>
            <p>{bans} bans per team</p>
          </div>

          {/* Phase indicator and reset */}
          <div className="draft-header-row">
            <div className="draft-phases">
              <div className={`phase-step ${phase === 'bans' ? 'active' : 'done'}`}>
                <span className="phase-number">1</span>
                <span className="phase-label">Bans</span>
              </div>
              <div className="phase-divider" />
              <div className={`phase-step ${phase === 'picks' ? 'active' : phase === 'analysis' ? 'done' : ''}`}>
                <span className="phase-number">2</span>
                <span className="phase-label">Picks</span>
              </div>
              <div className="phase-divider" />
              <div className={`phase-step ${phase === 'analysis' ? 'active' : ''}`}>
                <span className="phase-number">3</span>
                <span className="phase-label">Analysis</span>
              </div>
            </div>
            <button className="btn-reset" onClick={handleReset}>
              ↺ Reset {phase === 'bans' ? 'Bans' : 'Picks'}
            </button>
          </div>

          {/* Bans phase */}
          {phase === 'bans' && (
            <>
              <div className="draft-bans">
                <div className="ban-section">
                  <h3 className="section-title my">Your Team Bans</h3>
                  <div className="slots-col">
                    {myBans.map((hero, i) => renderBanSlot(hero, i, 'my'))}
                  </div>
                </div>

                <div className="ban-section">
                  <h3 className="section-title enemy">Enemy Team Bans</h3>
                  <div className="slots-col">
                    {enemyBans.map((hero, i) => renderBanSlot(hero, i, 'enemy'))}
                  </div>
                </div>
              </div>

              {conflicts.length > 0 && (
                <div className="conflict-errors">
                  {conflicts.map((msg, i) => (
                    <p key={i} className="conflict-error">⚠ {msg}</p>
                  ))}
                </div>
              )}

              <button
                className="btn-primary"
                onClick={() => { setPhase('picks'); setActiveSlot(null) }}
                disabled={conflicts.length > 0}
              >
                Lock in Bans →
              </button>
            </>
          )}

          {/* Picks phase */}
          {phase === 'picks' && (
            <>
              {/* Ban strips */}
              <BanStrip myBans={myBans} enemyBans={enemyBans} />

              {/* Picks grid */}
              <div className="draft-picks">
                <div className="picks-team-col">
                  <div className="picks-section my-picks">
                    <h3 className="section-title my">Your Team</h3>
                    <div className="picks-col">
                      {LANES.map(lane => (
                        <LaneRow
                          key={lane}
                          lane={lane}
                          hero={myPicks[lane]}
                          team="my"
                          onSlotClick={handleSlotClick}
                          onClear={handleClear}
                          dragActiveId={dragActiveId}
                          onAction={handleAction}
                          allBannedIds={allBannedIds}
                          pickedIds={myPickedIds}
                          lastPicked={lastPicked}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                <div className="picks-team-col">
                  <div className="picks-section enemy-picks">
                    <h3 className="section-title enemy">Enemy Team</h3>
                    <div className="picks-col">
                      {LANES.map(lane => (
                        <LaneRow
                          key={lane}
                          lane={lane}
                          hero={enemyPicks[lane]}
                          team="enemy"
                          onSlotClick={handleSlotClick}
                          onClear={handleClear}
                          dragActiveId={dragActiveId}
                          onAction={handleAction}
                          allBannedIds={allBannedIds}
                          pickedIds={enemyPickedIds}
                          lastPicked={lastPicked}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Suggestion Panel */}
              <div className="suggestion-panel">
                <h3 className="suggestion-title">Live Suggestions</h3>
                <div className="suggestion-grid">

                  <div className="suggestion-card">
                    <h4 className="suggestion-card-title">Role Coverage</h4>
                    {/* TODO: replace with POST /api/draft/analyse/ response */}
                    {(() => {
                      const filledRoles = myPickList.map(h => h.role)
                      const allRoles = ['Tank', 'Fighter', 'Mage', 'Marksman', 'Assassin', 'Support']
                      const missing = allRoles.filter(r => !filledRoles.includes(r))
                      const suggested = HEROES.filter(h =>
                        missing.includes(h.role) &&
                        !allBannedIds.includes(h.id) &&
                        !myPickedIds.includes(h.id)
                      ).slice(0, 4)

                      return missing.length === 0 ? (
                        <p className="suggestion-ok">All roles covered ✓</p>
                      ) : (
                        <>
                          <p className="suggestion-missing">
                            Missing: <span>{missing.join(', ')}</span>
                          </p>
                          <div className="suggestion-heroes">
                            {suggested.map(hero => (
                              <div key={hero.id} className="suggestion-hero-chip">
                                <span style={{ color: ROLE_COLOURS[hero.role] }}>{hero.initial}</span>
                                <span>{hero.name}</span>
                              </div>
                            ))}
                          </div>
                        </>
                      )
                    })()}
                  </div>

                  <div className="suggestion-card">
                    <h4 className="suggestion-card-title">Counter Picks</h4>
                    {/* TODO: replace with POST /api/draft/analyse/ response */}
                    {enemyPickList.length === 0 ? (
                      <p className="suggestion-empty">Pick enemy heroes to see counters</p>
                    ) : (
                      <>
                        <p className="suggestion-missing">
                          Enemy has: <span>{enemyPickList.map(h => h.name).join(', ')}</span>
                        </p>
                        <div className="suggestion-heroes">
                          {HEROES.filter(h =>
                            !allBannedIds.includes(h.id) &&
                            !myPickedIds.includes(h.id)
                          ).slice(0, 4).map(hero => (
                            <div key={hero.id} className="suggestion-hero-chip">
                              <span style={{ color: ROLE_COLOURS[hero.role] }}>{hero.initial}</span>
                              <span>{hero.name}</span>
                            </div>
                          ))}
                        </div>
                      </>
                    )}
                  </div>

                  <div className="suggestion-card">
                    <h4 className="suggestion-card-title">Enemy Pick Probability</h4>
                    {/* TODO: replace with POST /api/draft/analyse/ response */}
                    <div className="probability-list">
                      {HEROES.filter(h =>
                        !allBannedIds.includes(h.id) &&
                        !enemyPickedIds.includes(h.id)
                      ).slice(0, 5).map((hero, i) => {
                        const pct = Math.max(30, 85 - i * 12)
                        return (
                          <div key={hero.id} className="probability-item">
                            <span
                              className="probability-name"
                              style={{ color: ROLE_COLOURS[hero.role] }}
                            >
                              {hero.name}
                            </span>
                            <div className="probability-bar-wrap">
                              <div className="probability-bar" style={{ width: `${pct}%` }} />
                            </div>
                            <span className="probability-pct">{pct}%</span>
                          </div>
                        )
                      })}
                    </div>
                  </div>

                  <div className="suggestion-card">
                    <h4 className="suggestion-card-title">Lane Win Potential</h4>
                    {/* TODO: replace with POST /api/draft/analyse/ response */}
                    <div className="lane-list">
                      {[
                        { lane: 'Gold Lane', trend: 'up',   label: 'Advantage' },
                        { lane: 'Exp Lane',  trend: 'down', label: 'Disadvantage' },
                        { lane: 'Mid Lane',  trend: 'even', label: 'Even' },
                        { lane: 'Jungle',    trend: 'up',   label: 'Advantage' },
                        { lane: 'Roam',      trend: 'even', label: 'Even' },
                      ].map(({ lane, trend, label }) => (
                        <div key={lane} className="lane-item">
                          <span className="lane-name">{lane}</span>
                          <span className={`lane-trend ${trend}`}>
                            {trend === 'up' ? '↑' : trend === 'down' ? '↓' : '→'} {label}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              </div>

              {/* Conflict errors */}
              {conflicts.length > 0 && (
                <div className="conflict-errors">
                  {conflicts.map((msg, i) => (
                    <p key={i} className="conflict-error">⚠ {msg}</p>
                  ))}
                </div>
              )}

              <div className="draft-picks-actions">
                <button
                  className="btn-secondary"
                  onClick={() => { setPhase('bans'); setActiveSlot(null) }}
                >
                  ← Edit Bans
                </button>
                <button
                  className="btn-primary"
                  onClick={() => { setPhase('analysis'); setActiveSlot(null) }}
                  disabled={conflicts.length > 0}
                >
                  Analyse Draft →
                </button>
              </div>
            </>
          )}

          {/* Analysis phase */}
          {phase === 'analysis' && (
            <div className="draft-analysis">
              <div className="analysis-teams">
                <div className="analysis-team my-team">
                  <h3 className="section-title my">Your Team</h3>
                  <div className="analysis-picks">
                    {LANES.map(lane => {
                      const hero = myPicks[lane]
                      if (!hero) return null
                      return (
                        <div key={lane} className="analysis-hero">
                          <div
                            className="analysis-portrait"
                            style={{ borderColor: ROLE_COLOURS[hero.role] }}
                          >
                            <span style={{ color: ROLE_COLOURS[hero.role] }}>{hero.initial}</span>
                          </div>
                          <div className="analysis-hero-info">
                            <p className="analysis-hero-name">{hero.name}</p>
                            <p className="analysis-hero-role" style={{ color: ROLE_COLOURS[hero.role] }}>
                              {hero.role}
                            </p>
                          </div>
                          <span className="analysis-lane">{lane}</span>
                        </div>
                      )
                    })}
                  </div>
                </div>

                <div className="analysis-vs">VS</div>

                <div className="analysis-team enemy-team">
                  <h3 className="section-title enemy">Enemy Team</h3>
                  <div className="analysis-picks">
                    {LANES.map(lane => {
                      const hero = enemyPicks[lane]
                      if (!hero) return null
                      return (
                        <div key={lane} className="analysis-hero">
                          <div
                            className="analysis-portrait"
                            style={{ borderColor: ROLE_COLOURS[hero.role] }}
                          >
                            <span style={{ color: ROLE_COLOURS[hero.role] }}>{hero.initial}</span>
                          </div>
                          <div className="analysis-hero-info">
                            <p className="analysis-hero-name">{hero.name}</p>
                            <p className="analysis-hero-role" style={{ color: ROLE_COLOURS[hero.role] }}>
                              {hero.role}
                            </p>
                          </div>
                          <span className="analysis-lane">{lane}</span>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>

              <div className="analysis-cards">
                <div className="analysis-card">
                  <h3 className="analysis-card-title">Team Composition</h3>
                  <p className="analysis-placeholder">
                    Your team has a strong engage composition. Consider initiating fights around objectives.
                  </p>
                </div>
                <div className="analysis-card">
                  <h3 className="analysis-card-title">Win Condition</h3>
                  <p className="analysis-placeholder">
                    Based on your draft, your win condition is early aggression and snowballing the gold lane.
                  </p>
                </div>
                <div className="analysis-card">
                  <h3 className="analysis-card-title">Threats to Watch</h3>
                  <p className="analysis-placeholder">
                    Enemy has strong poke. Avoid extended trades in lane. Group early for team fights.
                  </p>
                </div>
                <div className="analysis-card">
                  <h3 className="analysis-card-title">Historical Win Rate</h3>
                  <p className="analysis-placeholder">
                    Similar drafts in your history: <span className="stat-highlight">68% win rate</span>
                  </p>
                </div>
              </div>

              <div className="draft-picks-actions">
                <button className="btn-secondary" onClick={() => setPhase('picks')}>
                  ← Edit Picks
                </button>
                <button className="btn-primary" onClick={() => navigate('/dashboard')}>
                  Save & Return
                </button>
              </div>
            </div>
          )}

          {/* Hero picker */}
          {activeSlot && (
            <div className="draft-picker">
              <div className="picker-header-row">
                <p className="picker-prompt">
                  Selecting: <span>
                    {activeSlot.type === 'ban'
                      ? `Ban ${activeSlot.index + 1}`
                      : activeSlot.lane
                    } — {activeSlot.team === 'my' ? 'Your Team' : 'Enemy Team'}
                  </span>
                </p>
                <button className="picker-close" onClick={() => setActiveSlot(null)}>✕</button>
              </div>
              <input
                className="search-input"
                type="text"
                placeholder="Search heroes..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                autoFocus={!('ontouchstart' in window)}
              />
              <div className="hero-grid">
                {filtered.map(hero => (
                  <div
                    key={hero.id}
                    className="hero-grid-card"
                    onClick={() => handleHeroSelect(hero)}
                  >
                    <div
                      className="hero-grid-portrait"
                      style={{ borderColor: ROLE_COLOURS[hero.role] }}
                    >
                      <span style={{ color: ROLE_COLOURS[hero.role] }}>{hero.initial}</span>
                    </div>
                    <p className="hero-grid-name">{hero.name}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

        </main>
      </div>

      {/* Drag overlay */}
      <DragOverlay>
        {dragActiveId ? (() => {
          const hero = getDragHero()
          return hero ? (
            <div className="pick-hero-chip" style={{ color: ROLE_COLOURS[hero.role] }}>
              <span className="chip-initial">{hero.initial}</span>
              <span className="chip-name">{hero.name}</span>
            </div>
          ) : null
        })() : null}
      </DragOverlay>

      {/* Synergy / Counter popup */}
      {popup && (
        <HeroPopup
          title={popup.title}
          hero={popup.hero}
          type={popup.type}
          allBannedIds={allBannedIds}
          pickedIds={popup.type === 'synergy' ? myPickedIds : enemyPickedIds}
          onClose={() => setPopup(null)}
        />
      )}

    </DndContext>
  )
}

export default Draft