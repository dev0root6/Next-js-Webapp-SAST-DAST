// Store stats in memory for demo
let stats = {
  totalUsers: 3,  // Initial demo users
  activeUsers: 1,
  totalRequests: 0,
  failedLogins: 0
}

// Keep track of recent requests
const recentRequests = []
let requestId = 1

export function trackRequest(req) {
  const request = {
    id: requestId++,
    path: req.url,
    method: req.method,
    timestamp: new Date().toISOString(),
    ip: req.headers['x-forwarded-for'] || req.socket.remoteAddress
  }
  
  recentRequests.unshift(request)
  // Keep only last 50 requests
  if (recentRequests.length > 50) {
    recentRequests.pop()
  }
  
  stats.totalRequests++
}

export function trackFailedLogin() {
  stats.failedLogins++
}

export function getStats() {
  return stats
}

export function getRecentRequests() {
  return recentRequests
}
