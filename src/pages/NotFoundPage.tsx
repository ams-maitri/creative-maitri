import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <section className="container" style={{ padding: "120px 0 200px" }}>
      <div className="eyebrow">404</div>
      <h1 style={{ fontSize: "clamp(48px, 10vw, 120px)", fontWeight: 800, letterSpacing: "-0.025em", lineHeight: 1, margin: "12px 0 16px" }}>
        Nothing on this Monday.
      </h1>
      <p style={{ fontSize: 18, color: "var(--ink-soft)", maxWidth: "52ch" }}>
        Whatever you were looking for, it isn't here. Try the gallery.
      </p>
      <Link to="/" className="btn btn-primary" style={{ marginTop: 24 }}>Back to the gallery</Link>
    </section>
  );
}
