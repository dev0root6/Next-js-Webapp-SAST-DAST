import Head from 'next/head'
import Layout from '../components/Layout'
import XLogo from '../components/XLogo'
import Link from 'next/link'

export default function Home() {
  return (
    <Layout>
      <Head>
        <title>Xcelerator - Transform Your Learning Journey</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content="Xcelerator is your gateway to accelerated learning. Join our platform to access curated courses and transform your educational journey." />
      </Head>

      <div className="hero">
        <div className="container">
          <div className="hero-content">
            <XLogo size={60} className="hero-logo" />
            <h1>Transform Your Learning Journey</h1>
            <p className="hero-text">
              Join thousands of students accelerating their education through our innovative learning platform.
            </p>
            <div className="hero-buttons">
              <Link href="/courses" className="btn">Explore Courses</Link>
              <Link href="/signup" className="btn outline">Get Started</Link>
            </div>
          </div>
        </div>
      </div>

      <section className="features">
        <div className="container">
          <div className="features-grid">
            <div className="feature-card card">
              <h3>Expert-Led Courses</h3>
              <p>Learn from industry professionals and academic experts in your field.</p>
            </div>
            <div className="feature-card card">
              <h3>Interactive Learning</h3>
              <p>Engage with hands-on projects and real-world applications.</p>
            </div>
            <div className="feature-card card">
              <h3>Flexible Schedule</h3>
              <p>Study at your own pace with 24/7 access to course materials.</p>
            </div>
            <div className="feature-card card">
              <h3>Community Support</h3>
              <p>Connect with peers and mentors in our learning community.</p>
            </div>
          </div>
        </div>
      </section>

      <style jsx>{`
        .hero {
          background: linear-gradient(to bottom, var(--bg), var(--hover));
          padding: 4rem 0;
          text-align: center;
        }

        .hero-content {
          max-width: 800px;
          margin: 0 auto;
          padding: 2rem;
        }

        .hero-logo {
          margin-bottom: 2rem;
        }

        .hero h1 {
          font-size: 3.5rem;
          margin-bottom: 1.5rem;
        }

        .hero-text {
          font-size: 1.25rem;
          color: var(--muted);
          margin-bottom: 2rem;
          line-height: 1.6;
        }

        .hero-buttons {
          display: flex;
          gap: 1rem;
          justify-content: center;
        }

        .features {
          padding: 4rem 0;
        }

        .features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 2rem;
          padding: 2rem 0;
        }

        .feature-card {
          text-align: center;
        }

        .feature-card h3 {
          color: var(--accent);
          margin-bottom: 1rem;
        }

        .feature-card p {
          color: var(--muted);
          line-height: 1.6;
        }

        @media (max-width: 768px) {
          .hero h1 {
            font-size: 2.5rem;
          }

          .hero-text {
            font-size: 1.1rem;
          }

          .hero-buttons {
            flex-direction: column;
          }

          .features-grid {
            grid-template-columns: 1fr;
            padding: 1rem;
          }
        }
      `}</style>
    </Layout>
  );
}