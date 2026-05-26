import { Link } from "react-router-dom";
import { getAll, shortDate } from "../lib/presentations";
import Wordmark from "../components/Wordmark";
import styles from "./GalleryPage.module.css";

const SIZE_PATTERN = ["wide", "tall", "square", "wide", "square", "tall", "square", "wide", "square", "tall", "square", "wide", "square", "tall"] as const;

export default function GalleryPage() {
  const items = getAll();
  return (
    <>
      <Hero count={items.length} />
      <Marquee names={items.map((p) => p.presenter)} />
      <section className={styles.gridSection}>
        <div className="container">
          <div className={styles.gridHeader}>
            <div className="eyebrow">The catalog</div>
            <h2 className={styles.gridTitle}>Small obsessions, in chronological order.</h2>
            <p className={styles.gridLede}>Click any card to see how it works, what it is made of, and where you can find more.</p>
          </div>
          <ul className={styles.grid}>
            {items.map((p, i) => {
              const size = SIZE_PATTERN[i % SIZE_PATTERN.length];
              const cover = p.photos[0];
              return (
                <li key={p.slug} className={`${styles.card} ${styles[`card--${size}`]}`} style={{ animationDelay: `${i * 40}ms` }}>
                  <Link to={`/p/${p.slug}`} className={styles.cardLink}>
                    <span className={styles.cardNum} aria-hidden="true">{String(i + 1).padStart(2, "0")}</span>
                    <div className={styles.cardMedia}>
                      {cover ? (
                        <img src={cover} alt="" loading="lazy" />
                      ) : (
                        <PlaceholderArt seed={i} topic={p.topic} />
                      )}
                    </div>
                    <div className={styles.cardBody}>
                      <div className={styles.cardEyebrow}>
                        <span className="eyebrow">{p.topic}</span>
                        <span className={styles.cardDate}>{shortDate(p.date)}</span>
                      </div>
                      <h3 className={styles.cardTitle}>{p.title}</h3>
                      <div className={styles.cardPresenter}>
                        {p.avatar ? (
                          <img className={styles.cardAvatar} src={p.avatar} alt="" loading="lazy" />
                        ) : (
                          <Initials name={p.presenter} />
                        )}
                        <span>{p.presenter}</span>
                      </div>
                    </div>
                    <span className={styles.cardCta} aria-hidden="true">
                      Read on
                      <ArrowSm />
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </section>
      <ManifestoSection />
    </>
  );
}

function Hero({ count }: { count: number }) {
  return (
    <section className={styles.hero}>
      <div className="container">
        <div className={styles.heroAttribution}>
          <span className={styles.heroAttributionLabel}>A gallery from</span>
          <a href="https://maitriservices.com" target="_blank" rel="noreferrer" className={styles.heroAttributionLogo}>
            <img src="/maitri-mark.svg" alt="" className={styles.heroAttributionMark} aria-hidden="true" />
            <span className={styles.heroAttributionWord}>Maitri</span>
          </a>
        </div>
        <h1 className={`display ${styles.heroDisplay}`}>
          <span style={{ display: "block" }}>
            <Wordmark />
          </span>
          <span className={styles.heroSecondLine}>
            Creative expression <em className={styles.heroEm}>of the team.</em>
          </span>
        </h1>
        <div className={styles.heroMeta}>
          <p className={styles.heroLede}>
            Anyone can build anything. The only rule is that it has to be creative &mdash; and you
            have to present it to the team. The catalog below is everything they have shown so far.
          </p>
          <div className={styles.heroCount}>
            <span className={styles.heroCountValue}>{count}</span>
            <span className={styles.heroCountLabel}>in the catalog so far</span>
          </div>
        </div>
      </div>
    </section>
  );
}

function Marquee({ names }: { names: string[] }) {
  // Two copies, the keyframe shifts by exactly one copy width for a seamless loop
  const repeated = [...names, ...names];
  return (
    <div className={styles.marqueeWrap} aria-hidden="true">
      <hr className="rule-faint" />
      <div className={styles.marquee}>
        <div className={styles.marqueeTrack}>
          {repeated.map((n, i) => (
            <span key={i} className={styles.marqueeItem}>
              <em>{String((i % names.length) + 1).padStart(2, "0")}</em>
              {n}
              <span className={styles.marqueeDot} />
            </span>
          ))}
        </div>
      </div>
      <hr className="rule-faint" />
    </div>
  );
}

function ManifestoSection() {
  return (
    <section className={styles.manifesto}>
      <div className="container">
        <div className={styles.manifestoGrid}>
          <div>
            <div className="eyebrow">Why we do this</div>
            <h2 className={styles.manifestoTitle}>
              The taste comes from <em style={{ fontWeight: 100, fontStyle: "italic" }}>building too many things</em>.
            </h2>
          </div>
          <div className={styles.manifestoBody}>
            <p>
              We are an agentic development company. Most days are spent shipping for clients.
              Creative Mondays is the time we hold for the other half of the muscle: the part that
              picks the problem, picks the tools, and decides what good looks like.
            </p>
            <p>
              Some of the projects here are useful. Some are useless. All of them taught the person
              who built them something they can use the next day at work.
            </p>
            <div className={styles.manifestoActions}>
              <Link to="/submit" className="btn btn-primary">
                Submit a project <ArrowSm />
              </Link>
              <a href="https://maitriservices.com" target="_blank" rel="noreferrer" className="btn btn-ghost">
                About Maitri
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Initials({ name }: { name: string }) {
  const init = name.split(/\s+/).map((s) => s[0]).filter(Boolean).slice(0, 2).join("");
  return <span className={styles.initials} aria-hidden="true">{init}</span>;
}

function ArrowSm() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M5 12h14M13 5l7 7-7 7" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function PlaceholderArt({ seed, topic }: { seed: number; topic: string }) {
  const palettes = [
    { bg: "linear-gradient(135deg, #050818 0%, #1b8182 80%, #2dcbb6 100%)", text: "#ffffff" },
    { bg: "linear-gradient(160deg, #2dcbb6 0%, #15b3a5 50%, #0f8278 100%)", text: "#050818" },
    { bg: "linear-gradient(110deg, #fafaf6 0%, #e6f7f4 100%)", text: "#050818" },
  ];
  const p = palettes[seed % palettes.length];
  return (
    <div style={{
      width: "100%", height: "100%", background: p.bg, color: p.text,
      display: "flex", alignItems: "flex-end", padding: "24px",
      fontWeight: 100, fontStyle: "italic", fontSize: "clamp(36px, 5vw, 72px)",
      letterSpacing: "-0.02em", lineHeight: 0.95,
    }}>
      {topic}
    </div>
  );
}
