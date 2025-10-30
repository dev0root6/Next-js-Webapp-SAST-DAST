import { useState } from 'react'
import { useRouter } from 'next/router'
import Layout from '../components/Layout'

export default function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()

  async function handleLogin(e) {
    e.preventDefault()
    setError('')

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      })
      
      const data = await res.json()
      
      if (data.error) {
        setError(data.error)
        return
      }

      // Store user data in localStorage
      localStorage.setItem('user', JSON.stringify(data.user))
      
      // Successful login
      router.push('/dashboard')
    } catch (err) {
      setError('Login failed. Please try again.')
    }
  }

  return (
    <Layout>
      <div className="login-page">
        <div className="login-container card">
          <h1>Welcome Back</h1>
          <p className="muted">Enter your credentials to continue</p>

          <form onSubmit={handleLogin} className="login-form">
            <div className="form-group">
              <label htmlFor="username">Username</label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
              />
            </div>

            {error && (
              // INTENTIONAL VULNERABILITY: Rendering error messages with dangerouslySetInnerHTML
              // This is for educational demonstration only
              <div 
                className="message error" 
                dangerouslySetInnerHTML={{ __html: error }}
              />
            )}

            <button type="submit" className="btn login-btn">
              Sign In
            </button>
          </form>

          <p className="signup-link">
            Don't have an account? <a href="/signup">Sign up</a>
          </p>
        </div>
      </div>

      <style jsx>{`
        .login-page {
          min-height: calc(100vh - 70px - 89px); /* viewport - (navbar + footer) */
          display: grid;
          place-items: center;
          padding: 2rem 1rem;
        }

        .login-container {
          width: 100%;
          max-width: 400px;
          background: var(--bg);
        }

        .login-container h1 {
          margin-bottom: 0.5rem;
        }

        .login-form {
          margin-top: 2rem;
        }

        .login-btn {
          width: 100%;
          margin-top: 1rem;
        }

        .signup-link {
          margin-top: 1.5rem;
          text-align: center;
          color: var(--muted);
        }

        .signup-link a {
          color: var(--accent);
          text-decoration: none;
          font-weight: 500;
        }

        .signup-link a:hover {
          text-decoration: underline;
        }
      `}</style>
    </Layout>
  )
}