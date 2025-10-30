import { getStats } from '../../../lib/stats'

export default async function handler(req, res) {
  // Check if user is admin
  try {
    const user = req.headers.authorization
    if (!user || !user.includes('admin')) {
      return res.status(403).json({ error: 'Admin access required' })
    }

    const stats = getStats()
    res.json(stats)
  } catch (error) {
    console.error('Admin stats error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}