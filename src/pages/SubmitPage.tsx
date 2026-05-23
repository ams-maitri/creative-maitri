import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import type { Presentation, Document as DocFile } from "../lib/types";
import { formatDate } from "../lib/presentations";
import styles from "./SubmitPage.module.css";

type Draft = {
  presenter: string;
  email: string;
  topic: string;
  title: string;
  date: string;
  toolsRaw: string;
  description: string;
  linksRaw: string;
  photos: File[];
  documents: File[];
};

const EMPTY: Draft = {
  presenter: "",
  email: "",
  topic: "",
  title: "",
  date: "",
  toolsRaw: "",
  description: "",
  linksRaw: "",
  photos: [],
  documents: [],
};

function slugify(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "").slice(0, 60);
}

function imageMime(name: string) {
  return /\.(png|jpe?g|webp|gif|avif|svg)$/i.test(name);
}

function parseList(raw: string): string[] {
  return raw
    .split(/[\n,]/)
    .map((s) => s.trim())
    .filter(Boolean);
}

export default function SubmitPage() {
  const [d, setD] = useState<Draft>(EMPTY);
  const [photoPreviews, setPhotoPreviews] = useState<string[]>([]);

  const preview = useMemo<Presentation>(() => {
    const slug = slugify(`${d.presenter}-${d.topic || d.title}`) || "your-project";
    const seed = encodeURIComponent(d.presenter || "Your name");
    const avatar = d.presenter
      ? `https://api.dicebear.com/9.x/notionists/svg?seed=${seed}&backgroundColor=e6f7f4,fafaf6,f0ecdf,f5e6d3&radius=50`
      : undefined;
    return {
      slug,
      presenter: d.presenter || "Your name",
      email: d.email,
      topic: d.topic || "Topic",
      title: d.title || d.topic || "Title of your project",
      date: d.date,
      tools: parseList(d.toolsRaw),
      description: d.description || "Tell us what you built, what is interesting about it, and what you learned. One or two paragraphs is plenty.",
      photos: photoPreviews,
      documents: d.documents.map((f) => ({ path: `#${f.name}`, label: f.name })),
      links: parseList(d.linksRaw),
      avatar,
    };
  }, [d, photoPreviews]);

  function onFiles(files: FileList | null, kind: "photos" | "documents") {
    if (!files) return;
    const list = Array.from(files);
    if (kind === "photos") {
      const images = list.filter((f) => imageMime(f.name));
      const docs = list.filter((f) => !imageMime(f.name));
      setD((prev) => ({ ...prev, photos: [...prev.photos, ...images], documents: [...prev.documents, ...docs] }));
      const urls = images.map((f) => URL.createObjectURL(f));
      setPhotoPreviews((prev) => [...prev, ...urls]);
    } else {
      setD((prev) => ({ ...prev, documents: [...prev.documents, ...list] }));
    }
  }

  function removePhoto(i: number) {
    setD((prev) => ({ ...prev, photos: prev.photos.filter((_, j) => j !== i) }));
    setPhotoPreviews((prev) => {
      URL.revokeObjectURL(prev[i]);
      return prev.filter((_, j) => j !== i);
    });
  }

  function removeDoc(i: number) {
    setD((prev) => ({ ...prev, documents: prev.documents.filter((_, j) => j !== i) }));
  }

  async function generate() {
    const slug = preview.slug;
    const zip = new JSZip();

    const photoFolder = `photos/${slug}`;
    const photoPaths: string[] = [];
    for (let i = 0; i < d.photos.length; i++) {
      const f = d.photos[i];
      const ext = (f.name.split(".").pop() || "png").toLowerCase();
      const name = `photo-${String(i + 1).padStart(2, "0")}.${ext}`;
      zip.file(`${photoFolder}/${name}`, await f.arrayBuffer());
      photoPaths.push(`/photos/${slug}/${name}`);
    }

    const docPaths: DocFile[] = [];
    for (let i = 0; i < d.documents.length; i++) {
      const f = d.documents[i];
      const ext = (f.name.split(".").pop() || "bin").toLowerCase();
      const name = `artifact-${String(i + 1).padStart(2, "0")}.${ext}`;
      zip.file(`${photoFolder}/${name}`, await f.arrayBuffer());
      docPaths.push({ path: `/photos/${slug}/${name}`, label: f.name });
    }

    const entry: Presentation = {
      slug,
      presenter: d.presenter,
      email: d.email,
      topic: d.topic,
      title: d.title || d.topic,
      date: d.date,
      tools: parseList(d.toolsRaw),
      description: d.description,
      photos: photoPaths,
      documents: docPaths,
      links: parseList(d.linksRaw),
      avatar: `/avatars/${slug}.svg`,
    };

    zip.file("submission.json", JSON.stringify(entry, null, 2));
    zip.file("README.md", readmeFor(entry));

    const blob = await zip.generateAsync({ type: "blob" });
    saveAs(blob, `creative-maitri-${slug}.zip`);
  }

  const ready = d.presenter && d.topic && d.description;

  return (
    <section className={styles.page}>
      <div className="container">
        <header className={styles.head}>
          <div>
            <div className="eyebrow">Submit a project</div>
            <h1 className={styles.title}>Tell us what you built.</h1>
            <p className={styles.lede}>
              Fill in the form on the left. The card on the right is exactly how your project will look
              on the gallery. When it feels right, hit generate, drop the zip into the repo, open a PR.
            </p>
          </div>
          <Link to="/" className={styles.backLink}>
            <ArrowSm flipped /> All projects
          </Link>
        </header>

        <div className={styles.split}>
          {/* ===== Form ===== */}
          <form className={styles.form} onSubmit={(e) => { e.preventDefault(); generate(); }}>
            <Field label="Your name">
              <input value={d.presenter} onChange={(e) => setD({ ...d, presenter: e.target.value })} placeholder="Aayush Man Singh" required />
            </Field>

            <Field label="Email">
              <input type="email" value={d.email} onChange={(e) => setD({ ...d, email: e.target.value })} placeholder="you@maitriservices.com" />
            </Field>

            <Field label="Topic" hint="A short label. Goes in the badge on your card.">
              <input value={d.topic} onChange={(e) => setD({ ...d, topic: e.target.value })} placeholder="Travel Itinerary Generator" required />
            </Field>

            <Field label="Title" hint="The one-line headline for your detail page. Defaults to topic.">
              <input value={d.title} onChange={(e) => setD({ ...d, title: e.target.value })} placeholder="A day-by-day travel planner with real maps" />
            </Field>

            <Field label="Date you presented">
              <input type="date" value={d.date} onChange={(e) => setD({ ...d, date: e.target.value })} />
            </Field>

            <Field label="Tools" hint="One per line, or comma-separated.">
              <textarea rows={3} value={d.toolsRaw} onChange={(e) => setD({ ...d, toolsRaw: e.target.value })} placeholder={`Claude Code\nReact 19\nGroq`} />
            </Field>

            <Field label="Description" hint="One or two paragraphs. No need for headers or bullets, plain prose is best.">
              <textarea rows={7} value={d.description} onChange={(e) => setD({ ...d, description: e.target.value })} placeholder="What it does, what's interesting about it, what you learned." required />
            </Field>

            <Field label="Links" hint="Github, deployed url, slides. One per line.">
              <textarea rows={3} value={d.linksRaw} onChange={(e) => setD({ ...d, linksRaw: e.target.value })} placeholder={`https://github.com/you/project\nhttps://your-project.vercel.app`} />
            </Field>

            <Field label="Photos and screenshots" hint="Drop images here. PDFs and other files are attached as documents.">
              <FileDrop onFiles={(fl) => onFiles(fl, "photos")}>
                <span>Drop files, or click to choose</span>
              </FileDrop>
              {d.photos.length > 0 && (
                <ul className={styles.fileList}>
                  {d.photos.map((f, i) => (
                    <li key={i}>
                      <span>{f.name}</span>
                      <button type="button" onClick={() => removePhoto(i)} aria-label="Remove">×</button>
                    </li>
                  ))}
                </ul>
              )}
              {d.documents.length > 0 && (
                <ul className={styles.fileList}>
                  {d.documents.map((f, i) => (
                    <li key={i}>
                      <span>📎 {f.name}</span>
                      <button type="button" onClick={() => removeDoc(i)} aria-label="Remove">×</button>
                    </li>
                  ))}
                </ul>
              )}
            </Field>

            <div className={styles.actions}>
              <button type="submit" className="btn btn-primary" disabled={!ready}>
                Generate submission
                <ArrowSm />
              </button>
              <button type="button" className="btn btn-ghost" onClick={() => { setD(EMPTY); setPhotoPreviews([]); }}>
                Reset
              </button>
            </div>

            <p className={styles.legal}>
              Generates a zip with your submission as JSON, plus your photos. To add it to the gallery:
              unzip into the repo root so it merges into <code>public/photos/</code>, then add the JSON
              entry to <code>src/data/presentations.json</code>, commit, and open a PR.
            </p>
          </form>

          {/* ===== Live preview ===== */}
          <aside className={styles.preview}>
            <div className={styles.previewLabelRow}>
              <span className="eyebrow">Live preview</span>
              <span className={styles.previewBadge}>Updates as you type</span>
            </div>

            <div className={styles.previewSection}>
              <div className="eyebrow" style={{ marginBottom: 12 }}>How your card will look</div>
              <CardPreview p={preview} />
            </div>

            <div className={styles.previewSection}>
              <div className="eyebrow" style={{ marginBottom: 12 }}>How the detail page opens</div>
              <DetailPreview p={preview} />
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}

function readmeFor(p: Presentation): string {
  const seed = encodeURIComponent(p.presenter);
  return `# Creative Maitri submission: ${p.title}\n\nDrop this zip into the repo root. It merges:\n\n- Photos and files into \`public/photos/${p.slug}/\`\n- A new entry to add to \`src/data/presentations.json\`\n\nYou will also need an avatar at \`public/avatars/${p.slug}.svg\`. Fetch one with:\n\n\`\`\`bash\ncurl -o public/avatars/${p.slug}.svg \\\n  "https://api.dicebear.com/9.x/notionists/svg?seed=${seed}&backgroundColor=e6f7f4,fafaf6,f0ecdf,f5e6d3&radius=50"\n\`\`\`\n\nThen commit and open a PR.\n`;
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <label className={styles.field}>
      <div className={styles.fieldHead}>
        <span className={styles.fieldLabel}>{label}</span>
        {hint && <span className={styles.fieldHint}>{hint}</span>}
      </div>
      {children}
    </label>
  );
}

function FileDrop({ children, onFiles }: { children: React.ReactNode; onFiles: (f: FileList) => void }) {
  return (
    <label className={styles.drop}>
      <input
        type="file"
        multiple
        onChange={(e) => e.target.files && onFiles(e.target.files)}
        style={{ position: "absolute", inset: 0, opacity: 0, cursor: "pointer" }}
      />
      <div className={styles.dropInner}>{children}</div>
    </label>
  );
}

/* ---- preview pieces (mini-versions of the real cards) ---- */

function CardPreview({ p }: { p: Presentation }) {
  const cover = p.photos[0];
  return (
    <div className={styles.cardPrev}>
      <div className={styles.cardPrevMedia}>
        {cover ? <img src={cover} alt="" /> : <div className={styles.cardPrevPlaceholder} />}
      </div>
      <div className={styles.cardPrevBody}>
        <div className={styles.cardPrevEyebrow}>
          <span className="eyebrow">{p.topic}</span>
          {p.date && <span style={{ fontSize: 12, color: "var(--ink-mute)" }}>{formatDate(p.date)}</span>}
        </div>
        <div className={styles.cardPrevTitle}>{p.title}</div>
        <div className={styles.cardPrevPresenter}>
          {p.avatar ? (
            <img src={p.avatar} alt="" className={styles.cardPrevAvatar} />
          ) : (
            <span className={styles.cardPrevInitials}>{(p.presenter[0] || "?").toUpperCase()}</span>
          )}
          {p.presenter}
        </div>
      </div>
    </div>
  );
}

function DetailPreview({ p }: { p: Presentation }) {
  return (
    <div className={styles.detailPrev}>
      <div style={{ fontSize: 11, color: "var(--ink-mute)", letterSpacing: ".14em", textTransform: "uppercase", marginBottom: 10 }}>
        {p.topic}
      </div>
      <div className={styles.detailPrevTitle}>{p.title}</div>
      <div className={styles.detailPrevMeta}>
        <span><strong>{p.presenter}</strong></span>
        {p.date && <span className="dim">{formatDate(p.date)}</span>}
      </div>
      {p.tools.length > 0 && (
        <div className={styles.detailPrevTools}>
          {p.tools.map((t) => <span key={t} className="tag">{t}</span>)}
        </div>
      )}
      {p.photos[0] && (
        <div className={styles.detailPrevShot}>
          <img src={p.photos[0]} alt="" />
        </div>
      )}
      <div className={styles.detailPrevProse}>
        {p.description.split("\n\n").slice(0, 2).map((para, i) => <p key={i}>{para}</p>)}
      </div>
      {p.links.length > 0 && (
        <div style={{ marginTop: 12 }}>
          <span className="eyebrow">Links</span>
          <ul style={{ listStyle: "none", padding: 0, margin: "8px 0 0", fontSize: 13 }}>
            {p.links.map((l) => <li key={l} style={{ borderBottom: "1px solid var(--ink-faint)", padding: "4px 0" }}>{l}</li>)}
          </ul>
        </div>
      )}
    </div>
  );
}

function ArrowSm({ flipped }: { flipped?: boolean }) {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden="true" style={{ transform: flipped ? "scaleX(-1)" : undefined }}>
      <path d="M5 12h14M13 5l7 7-7 7" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
