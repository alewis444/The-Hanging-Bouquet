const PRIMITIVES = [
  { name: "maroon",      value: "#25030C" },
  { name: "brown",       value: "#604336" },
  { name: "peach-100",   value: "#ECAB80" },
  { name: "peach-200",   value: "#F3A26C" },
  { name: "orange",      value: "#FF7F49" },
  { name: "purple",      value: "#B5B2C0" },
  { name: "white-100",   value: "#E9E3D7" },
  { name: "white-200",   value: "#EBE4D1" },
  { name: "green-100",   value: "#827F42" },
  { name: "green-200",   value: "#64640B" },
  { name: "pink-100",    value: "#C14C55" },
  { name: "pink-200",    value: "#D44871" },
  { name: "yellow",      value: "#FCB837" },
  { name: "black",       value: "#000000" },
  { name: "deep-purple", value: "#220F87" },
  { name: "gray",        value: "#AEAEAE" },
];

const RADIUS = [
  { name: "radius-sm",   value: "8px" },
  { name: "radius-md",   value: "12px" },
  { name: "radius-full", value: "9999px" },
];

const FONTS = [
  {
    family: "Gwendolyn",
    css: "'Gwendolyn', cursive",
    role: "Display / Script",
    usedFor: "Site title, mood names, footer signature",
    samples: [
      { label: "--font-size-xl / landing-title", size: "96px", weight: 700 },
      { label: "mood-name active", size: "72px",  weight: 700 },
      { label: "mood-name inactive / signature", size: "40px",  weight: 400 },
    ],
  },
  {
    family: "Bellota Text",
    css: "'Bellota Text', sans-serif",
    role: "Body / UI",
    usedFor: "Descriptions, labels, date input, library links",
    samples: [
      { label: "description / footer", size: "18px", weight: 400 },
      { label: "tagline", size: "16px", weight: 400 },
      { label: "library link", size: "18px", weight: 700 },
    ],
  },
  {
    family: "system-ui",
    css: "system-ui, sans-serif",
    role: "UI / Data",
    usedFor: "Tables, inputs, badges, all non-branded text",
    samples: [
      { label: "step-title", size: "28px", weight: 600 },
      { label: "body default", size: "15px", weight: 400 },
      { label: "label / meta", size: "13px", weight: 400 },
      { label: "badge / caption", size: "11px", weight: 700 },
    ],
  },
];

const SPACING = [
  8, 12, 16, 20, 24, 28, 32, 40, 63, 73, 80, 112, 116, 120, 126, 132, 176, 270, 369, 400,
];

const THEMES = [
  { id: "romantic",   surface: "#EBE4D1", interactive: "#C14C55" },
  { id: "moody",      surface: "#25030C", interactive: "#D44871" },
  { id: "apothecary", surface: "#604336", interactive: "#F3A26C" },
  { id: "joyful",     surface: "#ECAB80", interactive: "#64640B" },
  { id: "pollinator", surface: "#B5B2C0", interactive: "#220F87" },
  { id: "wild",       surface: "#827F42", interactive: "#FF7F49" },
];

const SEMANTIC = [
  { name: "text-on-dark",  value: "#E9E3D7", note: "on dark surfaces" },
  { name: "text-on-light", value: "#000000", note: "on light surfaces" },
  { name: "border-default",value: "#AEAEAE", note: "borders" },
];

function isDark(hex) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return (r * 299 + g * 587 + b * 114) / 1000 < 128;
}

function Swatch({ color, label, sub }) {
  const dark = isDark(color);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <div
        style={{
          background: color,
          borderRadius: 8,
          height: 72,
          border: "1px solid rgba(0,0,0,0.08)",
        }}
      />
      <span style={{ fontSize: 12, fontWeight: 600, color: "var(--color-maroon)" }}>
        {label}
      </span>
      <span style={{ fontSize: 11, color: "var(--color-brown)", fontFamily: "monospace" }}>
        {color}
      </span>
      {sub && (
        <span style={{ fontSize: 11, color: "var(--color-brown)" }}>{sub}</span>
      )}
    </div>
  );
}

function ThemeRow({ theme }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
      <span style={{
        width: 120,
        fontSize: 13,
        fontWeight: 600,
        color: "var(--color-maroon)",
        textTransform: "capitalize",
      }}>
        {theme.id}
      </span>
      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
        <div title="surface-base" style={{
          width: 48, height: 48, borderRadius: 8,
          background: theme.surface,
          border: "1px solid rgba(0,0,0,0.08)",
        }} />
        <div title="interactive-primary" style={{
          width: 48, height: 48, borderRadius: 8,
          background: theme.interactive,
          border: "1px solid rgba(0,0,0,0.08)",
        }} />
        <div style={{ display: "flex", gap: 8, marginLeft: 8 }}>
          <span style={{ fontSize: 11, color: "var(--color-brown)", fontFamily: "monospace" }}>
            {theme.surface}
          </span>
          <span style={{ fontSize: 11, color: "var(--color-brown)" }}>surface</span>
          <span style={{ fontSize: 11, color: "var(--color-brown)", fontFamily: "monospace", marginLeft: 16 }}>
            {theme.interactive}
          </span>
          <span style={{ fontSize: 11, color: "var(--color-brown)" }}>interactive</span>
        </div>
      </div>
    </div>
  );
}

export default function ColorSystem() {
  return (
    <div style={{
      maxWidth: 900,
      margin: "0 auto",
      padding: "40px 24px",
      fontFamily: "inherit",
    }}>
      <h2 style={{ color: "var(--color-maroon)", marginBottom: 4, fontSize: 28 }}>
        Primitive Color System
      </h2>
      <p style={{ color: "var(--color-brown)", marginBottom: 40, fontSize: 14 }}>
        Source of truth for all colors used across The Hanging Bouquet.
      </p>

      {/* Primitives */}
      <section style={{ marginBottom: 48 }}>
        <h3 style={{ color: "var(--color-maroon)", fontSize: 16, marginBottom: 20, textTransform: "uppercase", letterSpacing: "0.08em" }}>
          Primitive Colors
        </h3>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))",
          gap: 20,
        }}>
          {PRIMITIVES.map((c) => (
            <Swatch key={c.name} color={c.value} label={c.name} />
          ))}
        </div>
      </section>

      {/* Typography */}
      <section style={{ marginBottom: 48 }}>
        <h3 style={{ color: "var(--color-maroon)", fontSize: 16, marginBottom: 20, textTransform: "uppercase", letterSpacing: "0.08em" }}>
          Typography
        </h3>
        <div style={{ display: "flex", flexDirection: "column", gap: 40 }}>
          {FONTS.map((font) => (
            <div key={font.family}>
              <div style={{ display: "flex", gap: 16, alignItems: "baseline", marginBottom: 4 }}>
                <span style={{ fontSize: 14, fontWeight: 700, color: "var(--color-maroon)" }}>{font.family}</span>
                <span style={{ fontSize: 12, color: "var(--color-brown)" }}>{font.role}</span>
                <span style={{ fontSize: 11, color: "var(--color-brown)", fontStyle: "italic" }}>{font.usedFor}</span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8, paddingLeft: 12, borderLeft: "2px solid var(--color-peach-100)" }}>
                {font.samples.map((s) => (
                  <div key={s.label} style={{ display: "flex", alignItems: "baseline", gap: 16 }}>
                    <span
                      style={{
                        fontFamily: font.css,
                        fontSize: s.size,
                        fontWeight: s.weight,
                        color: "var(--color-maroon)",
                        lineHeight: 1.1,
                        flex: 1,
                      }}
                    >
                      The Hanging Bouquet
                    </span>
                    <span style={{ fontSize: 11, color: "var(--color-brown)", fontFamily: "monospace", whiteSpace: "nowrap" }}>
                      {s.size} / {s.weight} — {s.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Radius */}
      <section style={{ marginBottom: 48 }}>
        <h3 style={{ color: "var(--color-maroon)", fontSize: 16, marginBottom: 20, textTransform: "uppercase", letterSpacing: "0.08em" }}>
          Radius
        </h3>
        <div style={{ display: "flex", gap: 32, alignItems: "flex-end" }}>
          {RADIUS.map((r) => (
            <div key={r.name} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
              <div style={{
                width: 64,
                height: 64,
                background: "var(--color-peach-100)",
                borderRadius: r.value,
                border: "1px solid rgba(0,0,0,0.08)",
              }} />
              <span style={{ fontSize: 12, fontWeight: 600, color: "var(--color-maroon)" }}>{r.name}</span>
              <span style={{ fontSize: 11, fontFamily: "monospace", color: "var(--color-brown)" }}>{r.value}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Spacing */}
      <section style={{ marginBottom: 48 }}>
        <h3 style={{ color: "var(--color-maroon)", fontSize: 16, marginBottom: 20, textTransform: "uppercase", letterSpacing: "0.08em" }}>
          Spacing
        </h3>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {SPACING.map((px) => (
            <div key={px} style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <span style={{ width: 80, fontSize: 12, fontFamily: "monospace", color: "var(--color-brown)", flexShrink: 0 }}>
                {px}px
              </span>
              <div style={{
                height: 12,
                width: px,
                maxWidth: "100%",
                background: "var(--color-peach-100)",
                borderRadius: 3,
              }} />
            </div>
          ))}
        </div>
      </section>

      {/* Semantic */}
      <section style={{ marginBottom: 48 }}>
        <h3 style={{ color: "var(--color-maroon)", fontSize: 16, marginBottom: 20, textTransform: "uppercase", letterSpacing: "0.08em" }}>
          Semantic Tokens
        </h3>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
          gap: 20,
        }}>
          {SEMANTIC.map((c) => (
            <Swatch key={c.name} color={c.value} label={c.name} sub={c.note} />
          ))}
        </div>
      </section>

      {/* Themes */}
      <section>
        <h3 style={{ color: "var(--color-maroon)", fontSize: 16, marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.08em" }}>
          Theme Pairs
        </h3>
        <p style={{ color: "var(--color-brown)", fontSize: 12, marginBottom: 20 }}>
          Each theme sets <code>--surface-base</code> and <code>--interactive-primary</code> via <code>data-theme</code>.
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {THEMES.map((t) => (
            <ThemeRow key={t.id} theme={t} />
          ))}
        </div>
      </section>
    </div>
  );
}
