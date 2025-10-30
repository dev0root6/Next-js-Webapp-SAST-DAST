import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Layout from '../components/Layout'

// For demo purposes - tracking active users and requests
const DEMO_ACTIVE_REQUESTS = [
  { id: 1, path: '/api/courses/search', method: 'POST', timestamp: new Date().toISOString(), ip: '192.168.1.101' },
  { id: 2, path: '/api/auth/login', method: 'POST', timestamp: new Date().toISOString(), ip: '192.168.1.102' },
  { id: 3, path: '/api/courses/search', method: 'POST', timestamp: new Date().toISOString(), ip: '192.168.1.103' }
]

export default function AdminDashboard() {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    totalRequests: 0,
    failedLogins: 0
  })
  const [recentRequests, setRecentRequests] = useState([])
  const router = useRouter()

  useEffect(() => {
    async function checkAuth() {
      try {
        const loggedInUser = localStorage.getItem('user')
        if (!loggedInUser) {
          router.replace('/login')
          return
        }

        const userData = JSON.parse(loggedInUser)
        if (userData.username !== 'admin') {
          router.replace('/dashboard')
          return
        }
        
        setUser(userData)
        setIsLoading(false)

        // Setup API polling with auth headers
        const headers = {
          'Authorization': `Bearer ${userData.token}`,
          'Content-Type': 'application/json'
        }

        // Initial stats fetch
        const statsRes = await fetch('/api/admin/stats', { headers })
        const statsData = await statsRes.json()
        if (!statsData.error) {
          setStats(statsData)
        }

        // Start polling for active requests
        const interval = setInterval(async () => {
          try {
            const reqRes = await fetch('/api/admin/requests', { headers })
            const reqData = await reqRes.json()
            if (!reqData.error) {
              setRecentRequests(reqData.requests)
            }
          } catch (err) {
            console.error('Failed to fetch requests:', err)
          }
        }, 5000)

        return () => clearInterval(interval)
      } catch (err) {
        console.error('Auth check failed:', err)
        router.replace('/login')
      }
    }
    
    checkAuth()

    return () => clearInterval(interval)
  }, [router])

  if (isLoading) {
    return (
      <Layout>
        <div className="loading-screen">
          <div className="loading-message">Loading admin dashboard...</div>
        </div>
        <style jsx>{`
          .loading-screen {
            min-height: calc(100vh - 160px);
            display: grid;
            place-items: center;
          }
          .loading-message {
            color: var(--muted);
            font-size: 1.1rem;
          }
        `}</style>
      </Layout>
    )
  }

  if (!user) {
    return null // Will redirect to login
  }

  return (
    <Layout>
      <div className="admin-dashboard">
        <div className="container">
          <header className="welcome-section">
            <h1>Admin Dashboard</h1>
            <p className="subtitle">System monitoring and management</p>
          </header>

          <section className="stats-section">
            <div className="stats-grid">
              <div className="stat-card card">
                <h3>User Stats</h3>
                <div className="stat-list">
                  <div className="stat-item">
                    <span className="label">Total Users</span>
                    <span className="number">{stats.totalUsers}</span>
                  </div>
                  <div className="stat-item">
                    <span className="label">Active Sessions</span>
                    <span className="number">{stats.activeUsers}</span>
                  </div>
                </div>
              </div>

              <div className="stat-card card">
                <h3>Request Stats</h3>
                <div className="stat-list">
                  <div className="stat-item">
                    <span className="label">Total Requests</span>
                    <span className="number">{stats.totalRequests}</span>
                  </div>
                  <div className="stat-item">
                    <span className="label">Failed Logins</span>
                    <span className="number error">{stats.failedLogins}</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="requests-section">
            <div className="card">
              <h2>Active Requests</h2>
              <div className="table-container">
                <table className="requests-table">
                  <thead>
                    <tr>
                      <th>Time</th>
                      <th>Method</th>
                      <th>Path</th>
                      <th>IP Address</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentRequests.map(req => (
                      <tr key={req.id}>
                        <td>{new Date(req.timestamp).toLocaleTimeString()}</td>
                        <td><span className={`method ${req.method.toLowerCase()}`}>{req.method}</span></td>
                        <td>{req.path}</td>
                        <td>{req.ip}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        </div>
      </div>

      <style jsx>{`
        .admin-dashboard {
          padding: 2rem 0;
        }

        .welcome-section {
          text-align: center;
          margin-bottom: 3rem;
        }

        .subtitle {
          color: var(--muted);
          font-size: 1.1rem;
          margin-top: 0.5rem;
        }

        .stats-section {
          margin-bottom: 3rem;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 2rem;
        }

        .stat-card {
          padding: 1.5rem;
        }

        .stat-card h3 {
          color: var(--accent);
          margin-bottom: 1rem;
          font-size: 1.2rem;
        }

        .stat-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .stat-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.5rem 0;
          border-bottom: 1px solid var(--border);
        }

        .stat-item:last-child {
          border-bottom: none;
        }

        .number {
          font-size: 1.2rem;
          font-weight: 600;
          color: var(--accent);
        }

        .number.error {
          color: #ff4444;
        }

        .label {
          color: var(--muted);
        }

        .requests-section {
          margin-top: 2rem;
        }

        .requests-section h2 {
          margin-bottom: 1rem;
          font-size: 1.5rem;
        }

        .table-container {
          overflow-x: auto;
        }

        .requests-table {
          width: 100%;
          border-collapse: collapse;
        }

        .requests-table th,
        .requests-table td {
          padding: 0.75rem 1rem;
          text-align: left;
        }

        .requests-table th {
          background: var(--hover);
          color: var(--accent);
          font-weight: 500;
        }

        .requests-table tr:nth-child(even) {
          background: var(--hover);
        }

        .method {
          padding: 0.25rem 0.5rem;
          border-radius: 4px;
          font-size: 0.9rem;
          font-weight: 500;
        }

        .method.get {
          background: #e3f2fd;
          color: #1976d2;
        }

        .method.post {
          background: #e8f5e9;
          color: #388e3c;
        }

        @media (max-width: 768px) {
          .stats-grid {
            grid-template-columns: 1fr;
          }

          .requests-table {
            font-size: 0.9rem;
          }
        }
      `}</style>
    </Layout>
  )
}