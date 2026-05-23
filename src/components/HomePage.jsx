import { useState, useEffect } from "react";
import { flowers, FLOWER_IMAGES } from "../data/flowers";
import { CURATED_BASKETS } from "../data/curatedBaskets";
import { moods } from "../data/moods";
import { getSeason, getActualSowDate, formatDate, getBloomDate } from "../utils/scheduleCalc";

const ZONE = "9-10";
const ROLE_LABEL = { upright: "Thriller", mounder: "Filler", trailer: "Spiller" };
const SEASON_EMOJI = { spring: "🌱", summer: "☀️", autumn: "🍂", winter: "❄️" };

function FlowerRow({ flower, replacements, onSwap }) {
  const [open, setOpen] = useState(false);
  const sameRoleBackups = replacements.filter((r) => r.role === flower.role);

  return (
    <div className="hb-flower-row-wrap">
      <div className="hb-flower-row">
        <img
          src={FLOWER_IMAGES[flower.id]}
          alt={flower.name}
          className="hb-flower-thumb"
          onError={(e) => { e.target.style.display = "none"; }}
        />
        <span className={`role-badge role-${flower.role}`}>{ROLE_LABEL[flower.role]}</span>
        <span className="hb-flower-name">{flower.name}</span>
        {sameRoleBackups.length > 0 && (
          <button className="hb-swap-btn" onClick={() => setOpen((v) => !v)} title="Swap flower">⇄</button>
        )}
      </div>
      {open && (
        <div className="hb-swap-dropdown">
          <p className="hb-swap-hint">Swap with:</p>
          {sameRoleBackups.map((b) => (
            <button
              key={b.id}
              className="hb-swap-option"
              onClick={() => { onSwap(flower.id, b); setOpen(false); }}
            >
              <img
                src={FLOWER_IMAGES[b.id]}
                alt={b.name}
                className="hb-swap-thumb"
                onError={(e) => { e.target.style.display = "none"; }}
              />
              <span>{b.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function BasketCard({ basket, basketNum, replacements, sowDate, onAccept }) {
  const [flowerList, setFlowerList] = useState(basket.flowers);

  useEffect(() => {
    setFlowerList(basket.flowers);
  }, [basket]);

  function swapFlower(oldId, newFlower) {
    setFlowerList((prev) => prev.map((f) => (f.id === oldId ? newFlower : f)));
  }

  const actualSowDate = getActualSowDate(sowDate);

  return (
    <div className="hb-basket-card">
      <img
        src={basket.image}
        alt={`Basket ${basketNum}`}
        className="hb-basket-img"
        onError={(e) => {
          e.target.style.background = "var(--parchment)";
          e.target.style.display = "block";
        }}
      />
      <div className="hb-basket-header">
        <span className="hb-basket-num">Basket {basketNum}</span>
        <span className="hb-basket-count">{flowerList.length} flowers</span>
      </div>

      <div className="hb-flower-list">
        {flowerList.map((f) => (
          <FlowerRow
            key={f.id}
            flower={f}
            replacements={replacements}
            onSwap={swapFlower}
          />
        ))}
      </div>

      <div className="hb-bloom-row">
        {flowerList.map((f) => (
          <div key={f.id} className="hb-bloom-line">
            <span className="hb-bloom-name">{f.name}</span>
            <span className="hb-bloom-date">→ {formatDate(getBloomDate(f, actualSowDate))}</span>
          </div>
        ))}
      </div>

      <button className="btn-primary hb-accept-btn" onClick={() => onAccept(flowerList)}>
        Accept Basket {basketNum} →
      </button>
    </div>
  );
}

function padTo5(flowerList) {
  if (flowerList.length === 0) return flowerList;
  const padded = [...flowerList];
  while (padded.length < 5) padded.push(flowerList[0]);
  return padded;
}

function resolveMoodGroup(moodId, season) {
  const entry = CURATED_BASKETS[moodId]?.[season] || { baskets: [], replacementIds: [] };
  return {
    baskets: entry.baskets.map((b) => ({
      image: b.image,
      flowers: padTo5(b.flowerIds.map((id) => flowers.find((f) => f.id === id)).filter(Boolean)),
    })),
    replacements: entry.replacementIds
      .map((id) => flowers.find((f) => f.id === id))
      .filter(Boolean),
  };
}

export default function HomePage({ onAccept }) {
  const todayISO = new Date().toISOString().split("T")[0];
  const [mood, setMood] = useState(null);
  const [sowDate, setSowDate] = useState(todayISO);

  const actualSowDate = getActualSowDate(sowDate);
  const season = getSeason(actualSowDate);

  const activeMood = moods.find((m) => m.id === mood);

  // When a mood is selected show only that group; otherwise show all moods
  const moodGroups = mood
    ? [{ ...moods.find((m) => m.id === mood), ...resolveMoodGroup(mood, season) }]
    : moods
        .map((m) => ({ ...m, ...resolveMoodGroup(m.id, season) }))
        .filter((g) => g.baskets.length > 0);

  return (
    <div className="home-page">
      <div className="home-zone-banner">
        <span className="home-zone-badge">Zones 9–10</span>
        <span className="home-zone-sub">Season-matched basket recommendations for your grow zone</span>
      </div>

      <div className="home-mood-tabs">
        {moods.map((m) => (
          <button
            key={m.id}
            className={`home-mood-tab ${mood === m.id ? "active" : ""}`}
            onClick={() => setMood((prev) => (prev === m.id ? null : m.id))}
          >
            <span className="home-mood-emoji">{m.emoji}</span>
            <span className="home-mood-label">{m.label}</span>
          </button>
        ))}
      </div>

      {activeMood && (
        <p className="home-mood-tagline">{activeMood.tagline}</p>
      )}

      <div className="home-date-row">
        <div className="home-date-group">
          <label className="home-date-label">Sow date</label>
          <input
            type="date"
            className="date-input"
            value={sowDate}
            onChange={(e) => setSowDate(e.target.value)}
          />
        </div>
        <div className="home-date-arrow">→ +7 days shipping</div>
        <div className="home-date-group">
          <label className="home-date-label">Plant date</label>
          <input
            type="text"
            className="date-input date-input-readonly"
            value={formatDate(actualSowDate)}
            readOnly
          />
        </div>
        <div className="home-season-pill">
          {SEASON_EMOJI[season]} {season.charAt(0).toUpperCase() + season.slice(1)}
        </div>
      </div>

      {moodGroups.length === 0 ? (
        <div className="basket-empty">No baskets available for this season.</div>
      ) : (
        <div className="hb-all-groups">
          {moodGroups.map((group) => (
            <div key={group.id} className="hb-mood-group">
              {!mood && (
                <h3 className="hb-mood-group-label">
                  {group.emoji} {group.label}
                </h3>
              )}
              <div className="hb-baskets-row">
                {group.baskets.map((basket, idx) => (
                  <BasketCard
                    key={idx}
                    basket={basket}
                    basketNum={idx + 1}
                    replacements={group.replacements}
                    sowDate={sowDate}
                    onAccept={(flowerList) => onAccept(flowerList, group.id, sowDate)}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
