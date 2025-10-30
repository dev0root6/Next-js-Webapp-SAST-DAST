import { getRecentRequests } from '../../../lib/stats'

export default async function handler(req, res) {
  // Check if user is admin
  try {
    const user = req.headers.authorization
    if (!user || !user.includes('admin')) {
      return res.status(403).json({ error: 'Admin access required' })
    }

    const requests = getRecentRequests()
    res.json({ requests })
  } catch (error) {
    console.error('Admin requests error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}