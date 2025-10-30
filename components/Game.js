import { useEffect, useState } from 'react'

export default function Game() {
  const [name, setName] = useState('')
  const [message, setMessage] = useState('')
  const [board, setBoard] = useState([])
  const [captcha, setCaptcha] = useState({ id: '', html: '' })
  const [answer, setAnswer] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    loadLeaderboard()
  }, [])

  async function loadLeaderboard() {
    const res = await fetch('/api/leaderboard')
    const json = await res.json()
    setBoard(json.leaderboard || [])
  }

  async function getNewCaptcha() {
    setLoading(true)
    try {
      const res = await fetch('/api/leaderboard?captcha=true')
      const json = await res.json()
      setCaptcha(json.captcha)
      setAnswer('')
      setMessage('')
    } catch (err) {
      setMessage('Failed to load CAPTCHA')
    }
    setLoading(false)
  }

  useEffect(() => {
    getNewCaptcha()
  }, [])

  async function submitAnswer(e) {
    e.preventDefault()
    if (!answer || !captcha.id) return

    setLoading(true)
    try {
      const res = await fetch('/api/leaderboard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          name,
          captchaId: captcha.id,
          captchaAnswer: answer
        })
      })
      const json = await res.json()
      
      if (json.error) {
        setMessage(json.error)
      } else {
        setBoard(json.leaderboard || [])
        setMessage('CAPTCHA solved! +10 points')
        getNewCaptcha() // Get a new CAPTCHA for another try
      }
    } catch (err) {
      setMessage('Submission failed')
    }
    setLoading(false)
  }

  return (
    <div className="game">
      <div className="play">
        <div className="captcha-container">
          {/* INTENTIONAL VULNERABILITY: rendering CAPTCHA HTML without sanitization */}
          {captcha.html ? (
            <div 
              className="captcha-display"
              dangerouslySetInnerHTML={{ __html: captcha.html }}
            />
          ) : (
            <div className="captcha-loading">Loading CAPTCHA...</div>
          )}
        </div>
        
        <form onSubmit={submitAnswer} className="form">
          <div className="input-group">
            <label>
              Name:
              <input 
                value={name} 
                onChange={e => setName(e.target.value)} 
                placeholder="your name"
                disabled={loading}
              />
            </label>
          </div>
          
          <div className="input-group">
            <label>
              CAPTCHA answer:
              <input
                value={answer}
                onChange={e => setAnswer(e.target.value)}
                placeholder="enter the text"
                disabled={loading}
              />
            </label>
          </div>
          
          <div className="buttons">
            <button type="submit" className="btn" disabled={loading || !answer}>
              Submit answer
            </button>
            <button type="button" onClick={getNewCaptcha} className="btn alt" disabled={loading}>
              New CAPTCHA
            </button>
          </div>
        </form>
      </div>

      {message && <p className="message">{message}</p>}

      <section className="board">
        <h2>Leaderboard</h2>
        <ul>
          {board.map((entry, i) => (
            <li key={i} className="entry">
              {/* INTENTIONAL VULNERABILITY: rendering user-provided name as HTML without sanitization */}
              <span className="name" dangerouslySetInnerHTML={{ __html: entry.name }}></span>
              <span className="score">{entry.score}</span>
            </li>
          ))}
        </ul>
      </section>

      <style jsx>{`
        .container { max-width:700px; margin:40px auto; padding:0 16px; }
        .game {
          position:relative; padding:22px; border-radius:14px;
          background: linear-gradient(135deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01));
          border: 1px solid rgba(126,252,255,0.06);
          box-shadow: 0 8px 30px rgba(2,6,23,0.6), inset 0 1px 0 rgba(255,255,255,0.02);
          backdrop-filter: blur(8px) saturate(120%);
        }
        .game::after{
          content:''; position:absolute; inset:-1px; z-index:-1; border-radius:16px;
          background: linear-gradient(90deg, rgba(126,252,255,0.03), rgba(138,92,255,0.02));
          filter: blur(18px); opacity:0.9;
        }
        .play { margin-bottom:16px }
        .captcha-container {
          margin-bottom: 20px;
          padding: 20px;
          background: rgba(0,0,0,0.2);
          border-radius: 12px;
          border: 1px solid rgba(126,252,255,0.1);
        }
        .captcha-display {
          min-height: 80px;
          display: flex;
          align-items: center;
          justify-content: center;
          letter-spacing: 2px;
          padding: 10px;
          background: rgba(0,0,0,0.4);
          border-radius: 8px;
          overflow: hidden;
        }
        .captcha-loading {
          text-align: center;
          color: var(--muted);
          padding: 20px;
        }
        .captcha-inner {
          padding: 10px 20px;
          background: rgba(0,0,0,0.3);
          border-radius: 6px;
          border: 1px solid rgba(255,255,255,0.05);
          box-shadow: 0 4px 12px rgba(0,0,0,0.5) inset;
        }
        .btn{
          background: linear-gradient(180deg, rgba(126,252,255,0.12), rgba(138,92,255,0.12));
          color: var(--accent); border:none; padding:10px 14px; border-radius:10px; cursor:pointer; font-weight:700;
          box-shadow: 0 6px 18px rgba(124,233,255,0.06), 0 0 10px rgba(138,92,255,0.04);
        }
        .btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
          transform: none !important;
        }
        .btn:not(:disabled):hover{ transform:translateY(-2px); box-shadow: 0 10px 30px rgba(124,233,255,0.09) }
        .btn.alt{ background:linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01)); color:var(--accent); border:1px solid rgba(255,255,255,0.03) }
        .form{ margin-bottom:12px }
        .input-group { margin-bottom: 16px }
        .input-group label { display: block; margin-bottom: 8px; color: var(--muted) }
        .input-group input { width: 100%; max-width: 300px }
        .buttons { display: flex; gap: 12px }
        .board{ margin-top:24px }
        .board h2{ color:var(--accent-2); margin:0 0 8px }
        .board ul{ list-style:none; padding:0; margin:0 }
        .entry{ display:flex; justify-content:space-between; padding:10px 12px; border-radius:10px; margin-bottom:8px;
          background: linear-gradient(180deg, rgba(255,255,255,0.01), rgba(255,255,255,0.005)); border:1px solid rgba(255,255,255,0.02);
          box-shadow: 0 6px 20px rgba(2,6,23,0.45) inset;
        }
        .entry:nth-child(odd){ border-left:4px solid rgba(126,252,255,0.06) }
        .name{ color:var(--accent); font-weight:600 }
        .score{ color:var(--accent-2); font-family: 'Courier New', Courier, monospace }
        .message{ color:#ff9aa2; margin: 16px 0; padding: 10px; border-radius: 6px; background: rgba(255,154,162,0.1) }
        @media (max-width:640px){ 
          .buttons { flex-direction: column }
          .btn { width: 100% }
        }
      `}</style>
    </div>
  )
}
