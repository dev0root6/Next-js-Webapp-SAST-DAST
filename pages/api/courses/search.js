import sqlite3 from 'sqlite3'
import { open } from 'sqlite'

// INTENTIONALLY VULNERABLE: Using string concatenation for SQL query
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { query } = req.body

  if (!query) {
    return res.json({ results: [] })
  }

  try {
    // Open SQLite database
    const db = await open({
      filename: ':memory:', // Use in-memory database for example
      driver: sqlite3.Database
    })

    // Create and populate courses table
    await db.exec(`
      CREATE TABLE IF NOT EXISTS courses (
        id INTEGER PRIMARY KEY,
        title TEXT,
        url TEXT,
        description TEXT
      )
    `)

    // Insert sample data if table is empty
    const count = await db.get('SELECT COUNT(*) as count FROM courses')
    if (count.count === 0) {
      await db.exec(`
        INSERT INTO courses (title, url, description) VALUES
        ('SQL Injection Basics', 'https://youtu.be/H7iGgDQB7hU?si=69nbE-MlqqlHxd2M', 'Learn the fundamentals of SQL injection attacks and prevention.'),
        ('Understanding XSS Vulnerabilities', 'https://youtu.be/UCuoTjOsT1Q?si=j3A2ZaHXW0ydcUbM', 'Comprehensive guide to Cross-Site Scripting vulnerabilities.'),
        ('Web Security Fundamentals', 'https://youtu.be/7mKNBUzy6Ys?si=W7DaMCzMdFmc5SOE', 'Essential concepts in web application security.'),
        ('Advanced Web Exploitation', 'https://youtu.be/EStNhpCe028?si=vA3qO0b-yVJa3dri', 'Deep dive into web exploitation techniques.'),
        ('Live Hacking Session', 'https://www.youtube.com/live/U97dHSuHoqU?si=3rAMr9EtpFJcwpp1', 'Real-time demonstration of security concepts.')
      `)
    }

    // INTENTIONALLY VULNERABLE: SQL injection through string concatenation
    const results = await db.all(
      'SELECT * FROM courses WHERE title LIKE "%' + query + '%" OR description LIKE "%' + query + '%"'
    )

    await db.close()
    res.json({ results })
  } catch (error) {
    console.error('Database error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}