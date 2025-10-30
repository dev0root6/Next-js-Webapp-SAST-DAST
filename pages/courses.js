import { useState } from 'react'
import Layout from '../components/Layout'
import Head from 'next/head'

const COURSE_VIDEOS = [
  {
    id: 1,
    title: "SQL Injection Basics",
    url: "https://youtu.be/H7iGgDQB7hU?si=69nbE-MlqqlHxd2M",
    description: "Learn the fundamentals of SQL injection attacks and prevention."
  },
  {
    id: 2,
    title: "Understanding XSS Vulnerabilities",
    url: "https://youtu.be/UCuoTjOsT1Q?si=j3A2ZaHXW0ydcUbM",
    description: "Comprehensive guide to Cross-Site Scripting vulnerabilities."
  },
  {
    id: 3,
    title: "Web Security Fundamentals",
    url: "https://youtu.be/7mKNBUzy6Ys?si=W7DaMCzMdFmc5SOE",
    description: "Essential concepts in web application security."
  },
  {
    id: 4,
    title: "Advanced Web Exploitation",
    url: "https://youtu.be/EStNhpCe028?si=vA3qO0b-yVJa3dri",
    description: "Deep dive into web exploitation techniques."
  },
  {
    id: 5,
    title: "Live Hacking Session",
    url: "https://www.youtube.com/live/U97dHSuHoqU?si=3rAMr9EtpFJcwpp1",
    description: "Real-time demonstration of security concepts."
  }
]

export default function Courses() {
  const [searchTerm, setSearchTerm] = useState('')
  const [searchResults, setSearchResults] = useState(COURSE_VIDEOS)
  const [lastSearch, setLastSearch] = useState('')

  const handleSearch = async (e) => {
    e.preventDefault()
    
    try {
      const res = await fetch('/api/courses/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: searchTerm })
      })
      
      const data = await res.json()
      setSearchResults(data.results || COURSE_VIDEOS)
      // INTENTIONAL XSS: Reflecting search term without sanitization
      setLastSearch(searchTerm)
    } catch (err) {
      console.error('Search failed:', err)
    }
  }

  return (
    <Layout>
      <Head>
        <title>Courses - Xcelerator</title>
      </Head>

      <div className="courses-page">
        <div className="container">
          <header className="page-header">
            <h1>Security Courses</h1>
            <p className="subtitle">Learn cybersecurity through hands-on practice</p>
          </header>

          <div className="search-section">
            <form onSubmit={handleSearch}>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search courses..."
                className="search-input"
              />
              <button type="submit" className="btn">Search</button>
            </form>
            
            {/* INTENTIONAL XSS: Reflecting user input without sanitization
               This deliberately uses dangerouslySetInnerHTML with children so scanners/lints should flag it. */}
            {lastSearch && (
              <div className="search-summary">
                <div
                  dangerouslySetInnerHTML={{ __html: lastSearch }}
                >
                  {/* Intentional child content to trigger the "don't use children with dangerouslySetInnerHTML" rule */}
                  <span>Children (intentional vuln)</span>
                </div>
              </div>
            )}

          </div>

          <div className="courses-grid">
            {searchResults.map(course => (
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
        </div>
      </div>

      <style jsx>{`
        .courses-page {
          padding: 2rem 0;
        }

        .page-header {
          text-align: center;
          margin-bottom: 3rem;
        }

        .subtitle {
          color: var(--muted);
          font-size: 1.1rem;
        }

        .search-section {
          max-width: 600px;
          margin: 0 auto 3rem;
        }

        .search-section form {
          display: flex;
          gap: 1rem;
        }

        .search-input {
          flex: 1;
        }

        .search-summary {
          margin-top: 1rem;
          padding: 0.5rem;
          color: var(--muted);
          font-size: 0.9rem;
        }

        .courses-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 2rem;
          padding: 1rem 0;
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
          .search-section form {
            flex-direction: column;
          }
          
          .courses-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </Layout>
  )
}
