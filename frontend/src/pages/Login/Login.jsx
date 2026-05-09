import { Link } from 'react-router-dom'
import './Login.css'

function Login() {
  return (
    <div className="login-page">
      <div className="login-card">

        <div className="login-brand">
          <h1 className="login-logo">ML<span>BUDDY</span></h1>
          <p className="login-tagline">Your smart draft companion</p>
        </div>

        <form className="login-form">
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

          <button type="submit" className="btn-primary">
            Log In
          </button>
        </form>

        <p className="login-footer">
          Don't have an account? <Link to="/register">Register</Link>
        </p>

      </div>
    </div>
  )
}

export default Login