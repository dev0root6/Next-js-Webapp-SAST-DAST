import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Layout from '../components/Layout'

export default function Dashboard() {
  const [user, setUser] = useState(null)
  const [courses, setCourses] = useState([])
  const router = useRouter()

  useEffect(() => {
    // Check if user is logged in
    const loggedInUser = localStorage.getItem('user')
    if (!loggedInUser) {
      router.push('/login')
      return
    }

    try {
      setUser(JSON.parse(loggedInUser))
    } catch (err) {
      console.error('Failed to parse user data:', err)
      router.push('/login')
    }
  }, [router])

  useEffect(() => {
    // Fetch available courses
    fetch('/api/courses/search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: '' }) // Empty query to get all courses
    })
    .then(res => res.json())
    .then(data => {
      if (data.results) {
        setCourses(data.results)
      }
    })
    .catch(err => console.error('Failed to fetch courses:', err))
  }, [])

  if (!user) {
    return null // Will redirect to login
  }

  return (
    <Layout>
      <div className="dashboard">
        <div className="container">
          <header className="welcome-section">
            <h1>Welcome, {user.name}</h1>
            <p className="subtitle">Your cybersecurity learning journey continues here</p>
          </header>

          <section className="stats-section">
            <div className="stats-grid">
              <div className="stat-card card">
                <h3>Learning Progress</h3>
                <div className="stat">
                  <span className="number">{courses.length}</span>
                  <span className="label">Available Courses</span>
                </div>
              </div>

              <div className="stat-card card">
                <h3>Account Type</h3>
                <div className="stat">
                  <span className="label">{user.username === 'admin' ? 'Administrator' : 'Student'}</span>
                </div>
              </div>
            </div>
          </section>

          <section className="courses-section">
            <h2>Your Courses</h2>
            <div className="courses-grid">
              {courses.map(course => (
                <div key={course.id} className="course-card card">
                  <div className="video-container">
                    <iframe
                      width="100%"
                      height="215"
                      src={course.url.replace('youtu.be/', 'youtube.com/embed/').replace('watch?v=', 'embed/')}
                      title={course.title}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                  <div className="course-info">
                    <h3>{course.title}</h3>
                    <p>{course.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>

      <style jsx>{`
        .dashboard {
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
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 2rem;
        }

        .stat-card {
          text-align: center;
          padding: 2rem;
        }

        .stat-card h3 {
          color: var(--accent);
          margin-bottom: 1rem;
        }

        .stat {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .stat .number {
          font-size: 2.5rem;
          font-weight: bold;
          color: var(--accent);
        }

        .stat .label {
          color: var(--muted);
          font-size: 1.1rem;
        }

        .courses-section {
          margin-top: 3rem;
        }

        .courses-section h2 {
          margin-bottom: 2rem;
        }

        .courses-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 2rem;
        }

        .course-card {
          overflow: hidden;
        }

        .video-container {
          position: relative;
          padding-bottom: 56.25%; /* 16:9 aspect ratio */
          height: 0;
          overflow: hidden;
          margin-bottom: 1rem;
        }

        .video-container iframe {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
        }

        .course-info {
          padding: 1rem;
        }

        .course-info h3 {
          margin-bottom: 0.5rem;
        }

        .course-info p {
          color: var(--muted);
          line-height: 1.5;
        }

        @media (max-width: 768px) {
          .stats-grid {
            grid-template-columns: 1fr;
          }
          
          .courses-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </Layout>
  )
}