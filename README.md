# Captcha finder (Educational Demo)

This is a minimal Next.js app that implements a tiny CAPTCHA-based game and an in-memory leaderboard. It intentionally contains weaknesses for learning purposes:

- An XSS vector: user-provided player names are rendered into the leaderboard using `dangerouslySetInnerHTML` without sanitization.
- Weak server-side validation: the API accepts any submitted score without authoritative checks.

DO NOT deploy this app to a public/production environment. It's for local educational use only.

How to run (local):

1. Install dependencies

```bash
npm install
```

2. Start the dev server

```bash
npm run dev
```

Open http://localhost:3000

What this demonstrates

- Client-side game rules (you must reach 10 clicks to submit) are enforced only on the client. The server in this demo does not verify the score, which is a common class of logic flaws.
- Rendering user input as HTML in the leaderboard demonstrates how an XSS can be introduced.

Responsible use and mitigation (high-level)

- Never render user input as raw HTML. Escape or sanitize user content before injection.
- Enforce validation on the server. Treat all client data as untrusted.
- Use a strict Content Security Policy (CSP) to limit script execution origins.
- Use well-maintained libraries for sanitization, e.g., DOMPurify on the server or client as needed.
- For public demos of vulnerabilities, run locally or in an isolated environment and add clear signage/warnings.

Security note: This repository intentionally contains weaknesses. The README provides mitigation pointers but does not include exploit instructions. If your goal is to learn secure coding, review the fixes above and implement them as an exercise.
