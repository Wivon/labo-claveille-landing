import './App.css'

const DOWNLOADS = [
  {
    id: 'windows',
    label: 'Windows',
    description: '(.exe package)',
    url: '#',
  },
  {
    id: 'macos',
    label: 'macOS',
    description: '(.dmg installer)',
    url: '#',
  },
  {
    id: 'linux',
    label: 'Linux',
    description: '(.AppImage / .deb)',
    url: '#',
  },
]

const detectOS = () => {
  if (typeof navigator === 'undefined') {
    return 'linux'
  }

  const platform = navigator.platform || ''
  const agent = navigator.userAgent || ''
  const loweredPlatform = platform.toLowerCase()
  const loweredAgent = agent.toLowerCase()

  if (loweredPlatform.includes('win')) {
    return 'windows'
  }
  if (loweredPlatform.includes('mac')) {
    return 'macos'
  }
  if (
    loweredPlatform.includes('linux') ||
    loweredAgent.includes('linux') ||
    loweredPlatform.includes('bsd')
  ) {
    return 'linux'
  }

  return 'linux'
}

function App() {
  const detected = detectOS()
  const primary = DOWNLOADS.find((entry) => entry.id === detected) ?? DOWNLOADS[0]

  return (
    <div className="app-shell">
      <header className="hero-header">
        <p className="eyebrow">Labo Claveille</p>
        <h1>Télécharger Labo Claveille</h1>
        <p className="hero-subtitle">
          Logiciel pour élèves et enseignants : installation rapide, hors connexion,
          conçu en France.
        </p>
      </header>

      <main className="hero-main">
        <div className="download-card">
          <div className="download-primary">
            <p className="download-label">Téléchargement recommandé</p>
            <a href={primary.url} className="primary-button" download>
              Télécharger pour {primary.label}
            </a>
            <p className="detected-note">Détecté : {primary.label}</p>
          </div>

          <div className="download-grid">
            {DOWNLOADS.map((entry) => (
              <a
                key={entry.id}
                href={entry.url}
                className={`os-button ${entry.id === primary.id ? 'active' : ''}`}
                download
              >
                <span>{entry.label}</span>
                <small>{entry.description}</small>
              </a>
            ))}
          </div>
        </div>
      </main>

      <section className="oss-mention">
        <p>
          Open source, contributions bienvenues sur{' '}
          <a
            href="https://github.com/Wivon/AC-Sciences"
            target="_blank"
            rel="noreferrer"
          >
            GitHub (AC Sciences)
          </a>
          .
        </p>
      </section>

      <footer className="page-footer">
        <span>Made in France</span>
        <span>Lycée Albert Claveille</span>
        <a className="contact-button" href="mailto:contact@labo-claveille.fr">
          Contact
        </a>
      </footer>
    </div>
  )
}

export default App
