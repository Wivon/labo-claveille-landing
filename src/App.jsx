import { useEffect, useState } from 'react'
import './App.css'
import logoGlass from './assets/logo-glass.png'

import { marked } from 'marked'
import DOMPurify from 'dompurify'

const DOWNLOADS = [
  {
    id: 'windows',
    label: 'Windows',
    description: '(.exe package)',
    url: 'https://github.com/Wivon/AC-Sciences/releases/download/prod/Labo-Claveille-1.0.2.exe',
  },
  {
    id: 'macos',
    label: 'macOS',
    description: '(.dmg installer)',
    url: 'https://github.com/Wivon/AC-Sciences/releases/download/prod/Labo-Claveille-1.0.2.dmg',
  },
  {
    id: 'linux',
    label: 'Linux',
    description: '(.AppImage / .deb)',
    url: 'https://github.com/Wivon/AC-Sciences/releases/download/prod/Labo-Claveille-1.0.2.AppImage',
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

const RELEASE_API = 'https://api.github.com/repos/Wivon/AC-Sciences/releases/latest'

const sanitizeMarkdown = (markdown) =>
  DOMPurify.sanitize(
    marked.parse(markdown || 'Pas de notes disponibles.', {
      gfm: true,
      breaks: true,
    }),
  )

function App() {
  const detected = detectOS()
  const primary = DOWNLOADS.find((entry) => entry.id === detected) ?? DOWNLOADS[0]
  const [releaseInfo, setReleaseInfo] = useState({ status: 'loading' })

  useEffect(() => {
    const controller = new AbortController()

    fetch(RELEASE_API, { signal: controller.signal })
      .then((res) => {
        if (res.ok) {
          return res.json()
        }
        if (res.status === 404) {
          setReleaseInfo({ status: 'empty' })
          return null
        }
        throw new Error('release')
      })
      .then((data) => {
        if (data) {
          setReleaseInfo({ status: 'ready', data })
        }
      })
      .catch((error) => {
        if (error.name !== 'AbortError') {
          setReleaseInfo({ status: 'error' })
        }
      })

    return () => controller.abort()
  }, [])

  return (
    <div className="app-shell">
      <header className="hero-header">
        <img
          className="hero-logo"
          src={logoGlass}
          alt="Logo Labo Claveille"
          loading="lazy"
        />
        <span className="sr-only">Labo Claveille</span>
        <h1>Télécharger Labo Claveille</h1>
        <p className="hero-subtitle">
          Logiciel pour élèves et enseignants de Physique-Chimie et de Sciences, conçu par les élèves.
        </p>
      </header>

      <main className="hero-main">
        <div className="download-card">
          <div className="download-primary">
            <p className="download-label">Téléchargement recommandé</p>
            <a href={primary.url} className="primary-button" download>
              Télécharger pour {primary.label}
            </a>
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

      <section className="release-block">
        <div className="release-header">
          <p className="download-label">Dernière release</p>
          <p className="release-subtitle">
            Contenu publié sur GitHub (AC Sciences).
          </p>
        </div>
        {releaseInfo.status === 'loading' && <p>Chargement des notes…</p>}
        {releaseInfo.status === 'ready' && (
          <>
            {releaseInfo.data.name && (
              <p className="release-title">{releaseInfo.data.name}</p>
            )}
            <div
              className="release-body"
              dangerouslySetInnerHTML={{
                __html: sanitizeMarkdown(releaseInfo.data.body),
              }}
            />
            <a
              className="release-link"
              href={releaseInfo.data.html_url}
              target="_blank"
              rel="noreferrer"
            >
              Voir sur GitHub
            </a>
          </>
        )}
        {releaseInfo.status === 'empty' && (
          <p>
            Aucune release publiée pour l’instant.{' '}
            <a href="https://github.com/Wivon/AC-Sciences/releases">Voir la page releases</a>.
          </p>
        )}
        {releaseInfo.status === 'error' && (
          <p>
            Impossible de charger les notes.{' '}
            <a href="https://github.com/Wivon/AC-Sciences/releases">Consultez GitHub</a>.
          </p>
        )}
      </section>

      <section className="oss-mention">
        <p>
          Open source, contributions bienvenues sur{' '}
          <a
            href="https://github.com/Wivon/AC-Sciences"
            target="_blank"
            rel="noreferrer"
          >
            GitHub
          </a>
          .
        </p>
      </section>

      <footer className="page-footer">
        <span>Made in Albert Claveille</span>
        <span>Créé par des élèves de M. Boulant (Le Goat)</span>
        <a className="contact-button" href="mailto:contact@vecting.org">
          Contact
        </a>
      </footer>
    </div>
  )
}

export default App
