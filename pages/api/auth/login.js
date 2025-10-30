// IMPORTANT: This is a deliberately vulnerable implementation for educational purposes
// DO NOT use this in production!

import { getDb } from '../../../lib/db'
import { trackFailedLogin, trackRequest } from '../../../lib/stats'

// NOTE: This endpoint intentionally constructs SQL using string concatenation
// to demonstrate SQL injection vulnerabilities. Example injection payloads:
// - username: ' OR '1'='1
// - password: ' OR '1'='1
// These payloads can bypass authentication when the query is built unsafely.

const handler = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { username, password } = req.body || {}

  if (!username || !password) {
    return res.status(400).json({
      // INTENTIONAL XSS: reflecting username without escaping
      error: `Missing credentials. Provided username: <span class="user-input">${username || 'none'}</span>`
    })
  }

  try {
    // Use shared database connection with demo users
    const db = await getDb()

    // INTENTIONALLY VULNERABLE: building SQL using string concatenation
    // This is what allows SQL injection via the username or password fields.
    const sql = "SELECT username, name FROM users WHERE username = '" + username + "' AND password = '" + password + "'"
    
    console.log('Executing login SQL:', sql)
    
    try {
      const user = await db.get(sql)
      console.log('Query result:', user)

      if (!user) {
        // Track failed login attempt
        trackFailedLogin()
        return res.status(401).json({
          // INTENTIONAL XSS: reflecting username without escaping
          error: `Invalid credentials for user: <span class="user-input">${username}</span>`
        })
      }

      // Success - return user object with session token
      const userData = {
        username: user.username,
        name: user.name,
        token: 'demo-token-' + Date.now() // Demo only - use proper JWT in production
      };
      
      return res.status(200).json({ user: userData })
    } catch (sqlError) {
      console.error('SQL Error:', sqlError)
      // Reflect the error for learning purposes
      return res.status(500).json({ 
        error: `SQL error occurred: <span class="user-input">${sqlError.message}</span>`,
        sql: sql  // Show the SQL that failed
      })
    }
  } catch (err) {
    console.error('Login handler error:', err)
    return res.status(500).json({ 
      error: `Server error: <span class="user-input">${err.message}</span>`
    })
  }
}

export default handler;