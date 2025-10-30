export default function XLogo({ className = '', size = 40 }) {
  return (
    <div className={`x-logo ${className}`}>
      <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M10 10L90 90M90 10L10 90" stroke="currentColor" strokeWidth="12" strokeLinecap="round"/>
      </svg>
      <style jsx>{`
        .x-logo {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          color: #000;
          transition: transform 0.3s ease;
        }
        .x-logo:hover {
          transform: scale(1.1);
        }
      `}</style>
    </div>
  )
}