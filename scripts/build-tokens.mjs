#!/usr/bin/env node
// Generates src/tokens/tokens.generated.css from the Figma variable exports
// (primatives.json, semantic.json, number.json). Run via `npm run tokens:build`,
// or automatically before `npm run dev` / `npm run build`.
//
// This script owns only the values that map directly to a Figma variable.
// Hand-authored conveniences (legacy aliases) stay in tokens.css and are
// not touched here.

import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const tokensDir = path.join(__dirname, "..", "src", "tokens");

const THEME_ORDER = ["romantic", "moody", "apothecary", "joyful", "pollinator", "wild"];

// Figma names these by literal color ("white" / "black"); the app names them
// by role, matching the existing --text-on-dark / --text-on-light tokens.
const TEXT_SEMANTIC_MAP = {
  white: "text-on-dark",
  black: "text-on-light",
};

async function readJson(name) {
  const raw = await readFile(path.join(tokensDir, name), "utf8");
  return JSON.parse(raw);
}

// "color/peach-100" -> "--color-peach-100"
function aliasToVar(targetVariableName) {
  return `--${targetVariableName.replace("/", "-")}`;
}

// Resolve the *current* primitive hex for an alias, rather than trusting
// semantic.json's own $value.hex — that field is just a snapshot cached at
// export time and goes stale the moment the primitive changes without a
// fresh semantic.json export.
function resolveAliasHex(primitives, targetVariableName) {
  const primitiveName = targetVariableName.replace(/^color\//, "");
  return primitives.color[primitiveName]?.$value.hex ?? "?";
}

function buildPrimitives(primitives) {
  const lines = ["/* ── Primitive Colors ──────────────────────────────────── */", ":root {"];
  for (const [name, token] of Object.entries(primitives.color)) {
    lines.push(`  --color-${name}: ${token.$value.hex};`);
  }
  lines.push("}");
  return lines.join("\n");
}

function buildThemes(semantic, primitives) {
  const byTheme = {};
  for (const [key, token] of Object.entries(semantic.surface)) {
    const theme = key.replace(/^base_/, "");
    const targetVariableName = token.$extensions["com.figma.aliasData"].targetVariableName;
    byTheme[theme] ??= {};
    byTheme[theme].surface = { varRef: aliasToVar(targetVariableName), hex: resolveAliasHex(primitives, targetVariableName) };
  }
  for (const [key, token] of Object.entries(semantic.interactive)) {
    const theme = key.replace(/^primary_/, "");
    const targetVariableName = token.$extensions["com.figma.aliasData"].targetVariableName;
    byTheme[theme] ??= {};
    byTheme[theme].interactive = { varRef: aliasToVar(targetVariableName), hex: resolveAliasHex(primitives, targetVariableName) };
  }

  const lines = ["/* ── Semantic: Themes ──────────────────────────────────── */"];
  for (const theme of THEME_ORDER) {
    const pair = byTheme[theme];
    if (!pair) continue;
    const selector = theme === "romantic" ? `:root,\n[data-theme="romantic"]` : `[data-theme="${theme}"]`;
    lines.push(`${selector} {`);
    lines.push(`  --surface-base:        var(${pair.surface.varRef});  /* ${pair.surface.hex} */`);
    lines.push(`  --interactive-primary: var(${pair.interactive.varRef});  /* ${pair.interactive.hex} */`);
    lines.push("}");
    lines.push("");
  }
  return lines.join("\n").trimEnd();
}

function buildSharedSemantic(semantic, primitives) {
  const lines = ["/* ── Semantic: Shared ──────────────────────────────────── */", ":root {"];
  for (const [name, token] of Object.entries(semantic.text)) {
    const cssName = TEXT_SEMANTIC_MAP[name];
    if (!cssName) continue;
    const targetVariableName = token.$extensions["com.figma.aliasData"].targetVariableName;
    const varRef = aliasToVar(targetVariableName);
    lines.push(`  --${cssName}: var(${varRef});  /* ${resolveAliasHex(primitives, targetVariableName)} */`);
  }
  for (const [name, token] of Object.entries(semantic.border)) {
    const targetVariableName = token.$extensions["com.figma.aliasData"].targetVariableName;
    const varRef = aliasToVar(targetVariableName);
    lines.push(`  --border-${name}: var(${varRef});  /* ${resolveAliasHex(primitives, targetVariableName)} */`);
  }
  lines.push("}");
  return lines.join("\n");
}

function buildNumbers(numbers) {
  const lines = ["/* ── Spacing / Radius / Font-size / Font-weight ────────── */", ":root {"];
  for (const [group, entries] of Object.entries(numbers)) {
    if (group === "$extensions") continue;
    for (const [name, token] of Object.entries(entries)) {
      const unit = group === "font-weight" ? "" : "px";
      lines.push(`  --${group}-${name}: ${token.$value}${unit};`);
    }
  }
  lines.push("}");
  return lines.join("\n");
}

async function main() {
  const [primitives, semantic, numbers] = await Promise.all([
    readJson("primatives.json"),
    readJson("semantic.json"),
    readJson("number.json"),
  ]);

  const banner = [
    "/* ══════════════════════════════════════════════════════════",
    "   AUTO-GENERATED — DO NOT EDIT BY HAND",
    "   Source: primatives.json · semantic.json · number.json",
    "   Regenerate with: npm run tokens:build",
    "   ══════════════════════════════════════════════════════════ */",
    "",
  ].join("\n");

  const output = [
    banner,
    buildPrimitives(primitives),
    "",
    buildThemes(semantic, primitives),
    buildSharedSemantic(semantic, primitives),
    "",
    buildNumbers(numbers),
    "",
  ].join("\n");

  const outPath = path.join(tokensDir, "tokens.generated.css");
  await writeFile(outPath, output, "utf8");
  console.log(`✓ wrote ${path.relative(process.cwd(), outPath)}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
