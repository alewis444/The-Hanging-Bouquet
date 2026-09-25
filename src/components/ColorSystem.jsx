import { useEffect, useRef, useState } from "react";

const PRIMITIVE_NAMES = [
  "maroon", "brown", "peach-100", "peach-200", "orange", "purple",
  "white-100", "white-200", "green-100", "green-200", "pink-100",
  "pink-200", "yellow", "black", "deep-purple", "gray",
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

const THEME_IDS = ["romantic", "moody", "apothecary", "joyful", "pollinator", "wild"];

const SEMANTIC_TOKENS = [
  { name: "text-on-dark",   cssVar: "--text-on-dark",   note: "on dark surfaces" },
  { name: "text-on-light",  cssVar: "--text-on-light",  note: "on light surfaces" },
  { name: "border-default", cssVar: "--border-default", note: "borders" },
];

function Swatch({ cssVar, label, resolvedValue, sub }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <div
        style={{
          background: `var(${cssVar})`,
          borderRadius: 8,
          height: 72,
          border: "1px solid rgba(0,0,0,0.08)",
        }}
      />
      <span style={{ fontSize: 12, fontWeight: 600, color: "var(--color-maroon)" }}>
        {label}
      </span>
      <span style={{ fontSize: 11, color: "var(--color-brown)", fontFamily: "monospace" }}>
        {resolvedValue || "…"}
      </span>
      {sub && (
        <span style={{ fontSize: 11, color: "var(--color-brown)" }}>{sub}</span>
      )}
    </div>
  );
}

function ThemeRow({ themeId, values, setRef }) {
  return (
    <div ref={setRef} data-theme={themeId} style={{ display: "flex", alignItems: "center", gap: 16 }}>
      <span style={{
        width: 120,
        fontSize: 13,
        fontWeight: 600,
        color: "var(--color-maroon)",
        textTransform: "capitalize",
      }}>
        {themeId}
      </span>
      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
        <div title="surface-base" style={{
          width: 48, height: 48, borderRadius: 8,
          background: "var(--surface-base)",
          border: "1px solid rgba(0,0,0,0.08)",
        }} />
        <div title="interactive-primary" style={{
          width: 48, height: 48, borderRadius: 8,
          background: "var(--interactive-primary)",
          border: "1px solid rgba(0,0,0,0.08)",
        }} />
        <div style={{ display: "flex", gap: 8, marginLeft: 8 }}>
          <span style={{ fontSize: 11, color: "var(--color-brown)", fontFamily: "monospace" }}>
            {values?.surface || "…"}
          </span>
          <span style={{ fontSize: 11, color: "var(--color-brown)" }}>surface</span>
          <span style={{ fontSize: 11, color: "var(--color-brown)", fontFamily: "monospace", marginLeft: 16 }}>
            {values?.interactive || "…"}
          </span>
          <span style={{ fontSize: 11, color: "var(--color-brown)" }}>interactive</span>
        </div>
      </div>
    </div>
  );
}

export default function ColorSystem() {
  const [primitiveValues, setPrimitiveValues] = useState({});
  const [semanticValues, setSemanticValues] = useState({});
  const [themeValues, setThemeValues] = useState({});
  const themeRefs = useRef({});

  useEffect(() => {
    const rootStyle = getComputedStyle(document.documentElement);

    const prims = {};
    PRIMITIVE_NAMES.forEach((name) => {
      prims[name] = rootStyle.getPropertyValue(`--color-${name}`).trim();
    });
    setPrimitiveValues(prims);

    const sems = {};
    SEMANTIC_TOKENS.forEach(({ name, cssVar }) => {
      sems[name] = rootStyle.getPropertyValue(cssVar).trim();
    });
    setSemanticValues(sems);

    const themes = {};
    THEME_IDS.forEach((id) => {
      const el = themeRefs.current[id];
      if (!el) return;
      const s = getComputedStyle(el);
      themes[id] = {
        surface: s.getPropertyValue("--surface-base").trim(),
        interactive: s.getPropertyValue("--interactive-primary").trim(),
      };
    });
    setThemeValues(themes);
  }, []);

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
        Source of truth for all colors used across The Hanging Bouquet. Every swatch below
        renders its actual CSS custom property live from tokens.css — nothing on this page
        is a hardcoded hex value.
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
          {PRIMITIVE_NAMES.map((name) => (
            <Swatch
              key={name}
              cssVar={`--color-${name}`}
              label={name}
              resolvedValue={primitiveValues[name]}
            />
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
          {SEMANTIC_TOKENS.map((t) => (
            <Swatch
              key={t.name}
              cssVar={t.cssVar}
              label={t.name}
              resolvedValue={semanticValues[t.name]}
              sub={t.note}
            />
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
          {THEME_IDS.map((id) => (
            <ThemeRow
              key={id}
              themeId={id}
              values={themeValues[id]}
              setRef={(el) => { themeRefs.current[id] = el; }}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
