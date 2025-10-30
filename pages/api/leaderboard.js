import { createCaptcha, verifyCaptcha } from '../../lib/captcha';

let leaderboard = []

export default function handler(req, res) {
  if (req.method === 'GET') {
    // If captcha=true is passed, generate a new CAPTCHA
    if (req.query.captcha === 'true') {
      const { id, html } = createCaptcha();
      return res.status(200).json({ captcha: { id, html } });
    }

    // Otherwise return sorted leaderboard
    const sorted = leaderboard.slice().sort((a, b) => b.score - a.score)
    return res.status(200).json({ leaderboard: sorted })
  }

  if (req.method === 'POST') {
    try {
      const { name = 'Anonymous', captchaId, captchaAnswer } = req.body

      // INTENTIONAL VULNERABILITY: We store and render user input without proper sanitization
      // This is for educational/demo purposes only to show XSS vectors
      
      // Verify CAPTCHA
      const verification = verifyCaptcha(captchaId, captchaAnswer);
      if (!verification.valid) {
        return res.status(400).json({ error: verification.error || 'Invalid CAPTCHA' });
      }

      // Calculate score - in this version, each solved CAPTCHA is worth 10 points
      const score = 10;
      
      const entry = { 
        name: String(name), // Intentionally not sanitized
        score: score,
        timestamp: Date.now()
      };
      
      leaderboard.push(entry)

      // Keep leaderboard small
      leaderboard = leaderboard.slice(-50)

      const sorted = leaderboard.slice().sort((a, b) => b.score - a.score)
      res.status(200).json({ leaderboard: sorted })
    } catch (err) {
      res.status(500).json({ error: 'server error' })
    }
    return
  }

  res.setHeader('Allow', ['GET', 'POST'])
  res.status(405).end(`Method ${req.method} Not Allowed`)
}
