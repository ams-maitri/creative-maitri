import { Link, useParams } from "react-router-dom";
import { getAll, getBySlug, formatDate } from "../lib/presentations";
import styles from "./ProjectPage.module.css";

export default function ProjectPage() {
  const { slug } = useParams<{ slug: string }>();
  const all = getAll();
  const idx = all.findIndex((p) => p.slug === slug);
  const p = slug ? getBySlug(slug) : undefined;

  if (!p) {
    return (
      <section className="container" style={{ padding: "120px 0" }}>
        <h1>Not found</h1>
        <p>That project does not exist.</p>
        <Link to="/" className="btn btn-primary">Back to the gallery</Link>
      </section>
    );
  }

  const prev = all[(idx + 1) % all.length];
  const next = all[(idx - 1 + all.length) % all.length];

  return (
    <article className={styles.page}>
      <header className={styles.heroWrap}>
        <div className="container">
          <Link to="/" className={styles.breadcrumb}>
            <ArrowSm flipped />
            All projects
          </Link>

          <div className={styles.heroEyebrow}>
            <span className={styles.numLabel}>Entry {String(idx + 1).padStart(2, "0")}</span>
            <span className={styles.topicTag}>{p.topic}</span>
          </div>

          <h1 className={styles.title}>{p.title}</h1>

          <div className={styles.meta}>
            <div className={styles.metaPresenter}>
              <div className="eyebrow">Presented by</div>
              <div className={styles.presenterRow}>
                {p.avatar && <img className={styles.presenterAvatar} src={p.avatar} alt="" />}
                <div>
                  <div className={styles.metaValue}>{p.presenter}</div>
                  <a className={styles.presenterEmail} href={`mailto:${p.email}`}>{p.email}</a>
                </div>
              </div>
            </div>
            <div>
              <div className="eyebrow">On</div>
              <div className={styles.metaValue}>{formatDate(p.date)}</div>
            </div>
            <div>
              <div className="eyebrow">Tools</div>
              <div className={styles.metaTools}>
                {p.tools.map((t) => <span key={t} className="tag">{t}</span>)}
              </div>
            </div>
          </div>
        </div>
      </header>

      {p.photos.length > 0 && (
        <section className={styles.gallery}>
          <div className="container">
            <ul className={styles.galleryGrid}>
              {p.photos.map((src, i) => (
                <li key={src} className={`${styles.shot} ${p.photos.length === 1 ? styles.shotFull : ""}`} style={{ animationDelay: `${i * 60}ms` }}>
                  <a href={src} target="_blank" rel="noreferrer">
                    <img src={src} alt={`${p.title} screenshot ${i + 1}`} loading="lazy" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      <section className={styles.body}>
        <div className="container">
          <div className={`${styles.bodyGrid} ${p.links.length === 0 && p.documents.length === 0 ? styles.bodyGridNoSidebar : ""}`}>
            <aside className={styles.sidebar} hidden={p.links.length === 0 && p.documents.length === 0}>
              {p.links.length > 0 && (
                <div className={styles.sidebarBlock}>
                  <div className="eyebrow">Links</div>
                  <ul className={styles.sidebarList}>
                    {p.links.map((l) => (
                      <li key={l}>
                        <a href={l} target="_blank" rel="noreferrer">
                          <span>{prettyHost(l)}</span>
                          <ArrowSm />
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {p.documents.length > 0 && (
                <div className={styles.sidebarBlock}>
                  <div className="eyebrow">Files</div>
                  <ul className={styles.sidebarList}>
                    {p.documents.map((d) => (
                      <li key={d.path}>
                        <a href={d.path} target="_blank" rel="noreferrer">
                          <span>{d.label}</span>
                          <ArrowSm />
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </aside>
            <div className={styles.prose}>
              {p.description.split("\n\n").map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className={styles.nextWrap}>
        <div className="container">
          <hr className="rule-faint" />
          <div className={styles.nextGrid}>
            <Link to={`/p/${prev.slug}`} className={styles.nextCard}>
              <div className="eyebrow">Previous</div>
              <div className={styles.nextTitle}>{prev.title}</div>
              <div className="dim" style={{ fontSize: 13 }}>{prev.presenter}</div>
            </Link>
            <Link to={`/p/${next.slug}`} className={`${styles.nextCard} ${styles.nextRight}`}>
              <div className="eyebrow">Next</div>
              <div className={styles.nextTitle}>{next.title}</div>
              <div className="dim" style={{ fontSize: 13 }}>{next.presenter}</div>
            </Link>
          </div>
        </div>
      </section>
    </article>
  );
}

function prettyHost(url: string): string {
  try {
    const u = new URL(url);
    return u.host.replace(/^www\./, "") + (u.pathname && u.pathname !== "/" ? u.pathname.slice(0, 32) : "");
  } catch {
    return url;
  }
}

function ArrowSm({ flipped }: { flipped?: boolean }) {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden="true" style={{ transform: flipped ? "scaleX(-1)" : undefined }}>
      <path d="M5 12h14M13 5l7 7-7 7" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
