import { useState } from 'react'
import { useRouter } from 'next/router'
import Layout from '../components/Layout'

export default function Signup() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [message, setMessage] = useState('')
  const router = useRouter()

  async function handleSignup(e) {
    e.preventDefault()
    setMessage('')

    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password, name })
      })

      const data = await res.json()
      if (data.error) {
        // INTENTIONAL: rendering server message as HTML for demonstration
        setMessage(data.error)
        return
      }

      // On success, redirect to login
      router.push('/login')
    } catch (err) {
      setMessage('Signup failed. Please try again.')
    }
  }

  return (
    <Layout>
      <div className="signup-page">
        <div className="signup-container card">
          <h1>Create an Account</h1>
          <p className="muted">Sign up to access the platform. This page is intentionally vulnerable for learning.</p>

          <form onSubmit={handleSignup} className="signup-form">
            <div className="form-group">
              <label htmlFor="name">Full name</label>
              <input id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your full name" required />
            </div>

            <div className="form-group">
              <label htmlFor="username">Username</label>
              <input id="username" type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Choose a username" required />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Choose a password" required />
            </div>

            {message && (
              <div className="message" dangerouslySetInnerHTML={{ __html: message }} />
            )}

            <button type="submit" className="btn signup-btn">Create account</button>
          </form>

          <p className="signup-link">Already have an account? <a href="/login">Sign in</a></p>

          <div className="hint">
            <strong>Hint (educational):</strong>
            <p>Try SQL injection payloads in the <em>username</em> or <em>name</em> fields to see how unsafe concatenated SQL behaves (this app is intentionally vulnerable).</p>
            <pre>Example: username = ' OR '1'='1 --</pre>
          </div>
        </div>

      <style jsx>{`
        .signup-page { min-height: calc(100vh - 70px - 89px); display: grid; place-items: center; padding: 2rem 1rem; }
        .signup-container { width: 100%; max-width: 480px; }
        .signup-form { margin-top: 1.5rem; }
        .signup-btn { width: 100%; margin-top: 1rem; }
        .hint { margin-top: 1.5rem; color: var(--muted); font-size: 0.95rem; }
        pre { background: rgba(0,0,0,0.03); padding: 0.5rem; border-radius: 6px; overflow:auto }
      `}</style>
      </div>
    </Layout>
  )
}
