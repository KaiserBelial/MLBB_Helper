import { Link } from 'react-router-dom'
import './Register.css'

function Register() {
  return (
    <div className="register-page">
      <div className="register-card">

        <div className="register-brand">
          <h1 className="register-logo">ML<span>BUDDY</span></h1>
          <p className="register-tagline">Your smart draft companion</p>
        </div>

        <form className="register-form">
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              id="username"
              type="text"
              placeholder="Enter your username"
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              placeholder="Enter your email"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              placeholder="Enter your password"
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirm-password">Confirm Password</label>
            <input
              id="confirm-password"
              type="password"
              placeholder="Confirm your password"
            />
          </div>

          <button type="submit" className="btn-primary">
            Register
          </button>
        </form>

        <p className="register-footer">
          Already have an account? <Link to="/login">Log In</Link>
        </p>

      </div>
    </div>
  )
}

export default Register