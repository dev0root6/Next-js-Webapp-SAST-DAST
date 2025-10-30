import { getDb } from '../../../lib/db'

// INTENTIONALLY VULNERABLE signup endpoint - uses string concatenation for SQL
// This is for educational/demo purposes only.
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { username, password, name } = req.body || {}

  if (!username || !password || !name) {
    return res.status(400).json({ 
      error: `Missing fields. Got username: <span class="user-input">${username || 'none'}</span>` 
    })
  }

  try {
    const db = await getDb() // Use shared connection

    // INTENTIONALLY VULNERABLE: string concatenation allows SQL injection
    const sql = "INSERT INTO users (username, password, name) VALUES ('" + username + "', '" + password + "', '" + name + "')"

    // For educational feedback, log the constructed SQL
    console.log('Signup SQL:', sql)

    await db.exec(sql)
    await db.close()

    return res.status(201).json({ success: true })
  } catch (err) {
    console.error('Signup error:', err)
    // Reflect input in error message for demonstration (intentional XSS)
    return res.status(500).json({ error: `Signup failed for user: <span class="user-input">${username}</span>` })
  }
}
