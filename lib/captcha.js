// Intentionally vulnerable CAPTCHA generator for educational purposes
// DO NOT USE IN PRODUCTION

function generateCaptchaText() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let text = '';
  for (let i = 0; i < 6; i++) {
    text += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return text;
}

// INTENTIONALLY VULNERABLE: This demo allows HTML in the CAPTCHA display
// for educational purposes. Real CAPTCHAs should never do this.
function generateCaptchaHTML(text, difficulty = 'medium') {
  // Note: This intentionally allows HTML injection for demo purposes
  const colors = ['#7efcff', '#8a5cff', '#ff9aa2'];
  const fonts = ['monospace', 'courier', 'courier new'];
  
  let html = '<div class="captcha-inner">';
  [...text].forEach((char, i) => {
    const color = colors[Math.floor(Math.random() * colors.length)];
    const font = fonts[Math.floor(Math.random() * fonts.length)];
    const rotation = Math.random() * 20 - 10;
    const size = Math.random() * 8 + 24;
    
    // INTENTIONAL VULNERABILITY: char is not escaped
    html += `<span style="
      color: ${color};
      font-family: ${font};
      display: inline-block;
      transform: rotate(${rotation}deg);
      font-size: ${size}px;
      text-shadow: 0 0 5px currentColor;
      margin: 0 2px;
    ">${char}</span>`;
  });
  html += '</div>';
  
  return html;
}

// Store active CAPTCHAs with their solutions
const activeCaptchas = new Map();

// Clean up old CAPTCHAs periodically (every 5 minutes)
setInterval(() => {
  const now = Date.now();
  for (const [id, data] of activeCaptchas.entries()) {
    if (now - data.created > 5 * 60 * 1000) {
      activeCaptchas.delete(id);
    }
  }
}, 60 * 1000);

export function createCaptcha() {
  const id = Date.now().toString(36) + Math.random().toString(36).slice(2);
  const text = generateCaptchaText();
  const html = generateCaptchaHTML(text);
  
  activeCaptchas.set(id, {
    solution: text,
    created: Date.now(),
    html // Intentionally store raw HTML
  });
  
  return { id, html };
}

export function verifyCaptcha(id, answer) {
  const captcha = activeCaptchas.get(id);
  if (!captcha) {
    return { valid: false, error: 'CAPTCHA expired' };
  }
  
  const isValid = captcha.solution === answer.toUpperCase();
  if (isValid) {
    activeCaptchas.delete(id); // Remove used CAPTCHA
  }
  
  return { valid: isValid };
}