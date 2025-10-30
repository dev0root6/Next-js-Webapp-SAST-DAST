import Link from 'next/link'
import XLogo from './XLogo'
import { useState, useEffect } from 'react'

// Client-side only component for admin link
function AdminLink() {
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    try {
      const userData = localStorage.getItem('user')
      if (userData) {
        const user = JSON.parse(userData)
        setIsAdmin(user.username === 'admin')
      }
    } catch (err) {
      console.error('Error checking admin status:', err)
    }
  }, [])

  if (!isAdmin) return null
  return <Link href="/admindashboard" className="nav-link">Admin</Link>
}

export default function Layout({ children }) {
  return (
    <div className="layout">
      <nav className="nav">
        <div className="container flex items-center justify-between" style={{ height: '100%' }}>
          <Link href="/" className="brand">
            <XLogo size={32} />
            <span className="brand-text">celerator</span>
          </Link>
          
          <div className="nav-links">
            <Link href="/courses" className="nav-link">Courses</Link>
            <Link href="/dashboard" className="nav-link">Dashboard</Link>
            <AdminLink />
            <Link href="/login" className="nav-link outline">Login</Link>
          </div>
        </div>
      </nav>

      <main>{children}</main>

      <footer className="footer">
        <div className="container">
          <div className="flex justify-between items-center p-8">
            <div className="flex items-center gap-4">
              <XLogo size={24} />
              <span>© 2025 Xcelerator. Educational Platform</span>
            </div>
            <div className="flex gap-4">
              <Link href="/terms">Terms</Link>
              <Link href="/privacy">Privacy</Link>
            </div>
          </div>
        </div>
      </footer>

      <style jsx>{`
        .layout {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
        }
        
        main {
          flex: 1;
        }

        .brand {
          display: flex;
          align-items: center;
          gap: 4px;
          text-decoration: none;
          color: var(--accent);
          font-weight: 600;
          font-size: 1.25rem;
        }

        .brand-text {
          font-weight: 700;
          letter-spacing: -0.02em;
        }

        .nav-links {
          display: flex;
          gap: 2rem;
          align-items: center;
        }

        .nav-link {
          text-decoration: none;
          color: var(--text);
          font-weight: 500;
          transition: color 0.2s;
        }

        .nav-link:hover {
          color: var(--accent);
        }

        .nav-link.outline {
          padding: 0.5rem 1rem;
          border-radius: 6px;
          border: 2px solid var(--accent);
          color: var(--accent);
        }

        .nav-link.outline:hover {
          background: var(--accent);
          color: var(--bg);
        }

        .footer {
          border-top: 1px solid var(--border);
          color: var(--muted);
          font-size: 0.875rem;
        }

        .footer a {
          color: inherit;
          text-decoration: none;
        }

        .footer a:hover {
          color: var(--text);
        }

        @media (max-width: 768px) {
          .nav-links {
            gap: 1rem;
          }
          
          .brand-text {
            display: none;
          }
        }
      `}</style>
    </div>
  )
}