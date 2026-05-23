type Props = { compact?: boolean };

export default function Wordmark({ compact }: Props) {
  if (compact) {
    return (
      <span style={{ display: "inline-flex", alignItems: "baseline", gap: "0.18em" }}>
        <span style={{ fontWeight: 800, letterSpacing: "-0.02em" }}>Creative</span>
        <span style={{
          fontStyle: "italic",
          fontWeight: 100,
          background: "linear-gradient(120deg, #1b8182, #2dcbb6)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
        }}>Maitri</span>
      </span>
    );
  }
  return (
    <span style={{ display: "inline-flex", alignItems: "baseline", gap: "0.18em" }}>
      <span style={{ fontWeight: 800, letterSpacing: "-0.03em" }}>Creative</span>
      <span style={{
        fontStyle: "italic",
        fontWeight: 100,
        letterSpacing: "-0.01em",
        background: "linear-gradient(120deg, #1b8182, #2dcbb6)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        backgroundClip: "text",
      }}>Maitri</span>
    </span>
  );
}
