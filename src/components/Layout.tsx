import { Outlet, Link, NavLink, useLocation } from "react-router-dom";
import { useEffect } from "react";
import Wordmark from "./Wordmark";
import styles from "./Layout.module.css";

export default function Layout() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <>
      <a className="sr-only" href="#main">Skip to content</a>
      <header className={styles.header}>
        <div className={`container ${styles.headerInner}`}>
          <Link to="/" className={styles.brand} aria-label="Creative Maitri, home">
            <span className={styles.brandMark} aria-hidden="true" />
            <span className={styles.brandText}>
              <Wordmark compact />
            </span>
          </Link>
          <nav className={styles.nav} aria-label="Primary">
            <NavLink to="/" end className={({ isActive }) => isActive ? styles.linkActive : styles.link}>
              Gallery
            </NavLink>
            <a href="https://maitriservices.com/life-at-maitri" className={styles.link} target="_blank" rel="noreferrer">
              Life at Maitri
            </a>
            <NavLink to="/submit" className={styles.cta}>
              Submit a project
              <Arrow />
            </NavLink>
          </nav>
        </div>
        <hr className="rule-faint" />
      </header>

      <main id="main">
        <Outlet />
      </main>

      <footer className={styles.footer}>
        <hr className="rule-faint" />
        <div className={`container ${styles.footerInner}`}>
          <div>
            <Wordmark compact />
            <p className={styles.footerNote}>A standing slot at <a href="https://maitriservices.com" target="_blank" rel="noreferrer">Maitri</a> for the team to share what they made for themselves.</p>
            <a href="https://maitriservices.com" target="_blank" rel="noreferrer" className={styles.footerMaitri}>
              <img src="/maitri-logo.svg" alt="Maitri" />
            </a>
          </div>
          <div className={styles.footerCols}>
            <div>
              <div className="eyebrow">Pages</div>
              <ul className={styles.footerList}>
                <li><Link to="/">Gallery</Link></li>
                <li><Link to="/submit">Submit a project</Link></li>
              </ul>
            </div>
            <div>
              <div className="eyebrow">Elsewhere</div>
              <ul className={styles.footerList}>
                <li><a href="https://maitriservices.com" target="_blank" rel="noreferrer">maitriservices.com</a></li>
                <li><a href="https://maitriservices.com/life-at-maitri" target="_blank" rel="noreferrer">Life at Maitri</a></li>
              </ul>
            </div>
          </div>
        </div>
        <div className={`container ${styles.footerBottom}`}>
          <span className="dim">© {new Date().getFullYear()} Maitri Services. Built by the people who present here.</span>
        </div>
      </footer>
    </>
  );
}

function Arrow() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M5 12h14M13 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
