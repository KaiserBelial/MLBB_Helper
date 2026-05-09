import { Link } from 'react-router-dom'
import { useState, useEffect, useRef } from 'react'
import './Navbar.css'

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const accountRef = useRef(null)

  const toggleMenu = () => setMenuOpen(prev => !prev)
  const closeMenu = () => setMenuOpen(false)

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (accountRef.current && !accountRef.current.contains(e.target)) {
        closeMenu()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <nav className="navbar">
      <Link to="/dashboard" className="navbar-logo">
        ML<span>BUDDY</span>
      </Link>

      <div className="navbar-right">
        <div className="navbar-coins">
          <span className="coin-icon">⬡</span>
          <span className="coin-balance">12</span>
        </div>

        <div className="navbar-account" ref={accountRef} onClick={toggleMenu}>
          <div className="navbar-avatar">K</div>
          <span className="navbar-username">Kaiser</span>
          <span className={`account-chevron ${menuOpen ? 'open' : ''}`}>▾</span>

          <div className={`account-dropdown ${menuOpen ? 'dropdown-open' : ''}`}>
            <Link to="/settings" className="dropdown-item" onClick={closeMenu}>
              ⚙ Settings
            </Link>
            <button className="dropdown-item dropdown-logout" onClick={closeMenu}>
              ⎋ Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar