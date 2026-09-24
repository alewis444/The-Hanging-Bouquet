import { useState, useEffect } from "react";
import { moods } from "../data/moods";

const BASE = import.meta.env.BASE_URL;

const MOOD_IMAGES = {
  moody:      `${BASE}baskets/moody_landing.png`,
  apothecary: `${BASE}baskets/apothecary_all_16.jpg`,
  joyful:     `${BASE}baskets/joyful_autumn_22.jpg`,
  pollinator: `${BASE}baskets/pollinator_autumn_4.jpg`,
  romantic:   `${BASE}baskets/romantic_spring-summer_7.jpg`,
  wild:       `${BASE}baskets/wild_spring-summer_11.jpg`,
};

const LANDING_MOOD_ORDER = ["moody", "apothecary", "joyful", "pollinator", "romantic", "wild"];

export default function LandingPage({ onSubmit, onLibrary, onColorSystem }) {
  const [selectedMood, setSelectedMood] = useState("moody");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const interval = setInterval(() => {
      setSelectedMood((prev) => {
        const idx = LANDING_MOOD_ORDER.indexOf(prev);
        return LANDING_MOOD_ORDER[(idx + 1) % LANDING_MOOD_ORDER.length];
      });
    }, 2000);
    return () => clearInterval(interval);
  }, [paused]);

  function handleSubmit() {
    if (date) onSubmit(date, selectedMood);
  }

  function handleKeyDown(e) {
    if (e.key === "Enter") handleSubmit();
  }

  const activeMood = moods.find((m) => m.id === selectedMood);

  return (
    <div className="landing" data-theme={selectedMood}>

      {/* Hero — title + description */}
      <div className="landing-hero">
        <h1 className="landing-title">The Hanging Bouquet</h1>
        <p className="landing-description">Based on your season and grow zone, select seeds that create the hanging bouquet of your desire.</p>
      </div>

      {/* Active mood + image */}
      <div className="landing-mood-section">
        <div className="landing-mood-list-wrap">
          <div className="landing-mood-item">
            <span className="landing-mood-name active">{activeMood?.label}</span>
            <p className="landing-mood-tagline">{activeMood?.tagline}</p>
          </div>

          <div className="landing-plant-prompt">
            <p className="landing-plant-label">When will you plant? We'll align your bouquet with your bloom season.</p>
            <div className="landing-date-row">
              <input
                type="date"
                className="landing-date-input"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                onKeyDown={handleKeyDown}
                aria-label="Plant date"
              />
              <button
                className="landing-submit-btn"
                onClick={handleSubmit}
                aria-label="Submit date"
              >
                <svg width="18" height="14" viewBox="0 0 29 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M2 10H27M19 2L27 10L19 18" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
          </div>
        </div>

        <div className="landing-flower-img-wrap">
          <img
            src={MOOD_IMAGES[selectedMood]}
            alt={`${selectedMood} bouquet`}
            className="landing-flower-img"
          />
        </div>
      </div>

      {/* Library link */}
      <div className="landing-cta-row">
        <button className="landing-library-link" onClick={onLibrary}>
          View full flower library
        </button>
        <button className="landing-library-link" onClick={onColorSystem}>
          View primitive color system
        </button>
      </div>

      {/* Footer */}
      <div className="landing-footer">
        <div className="landing-footer-body-wrap">
          <p className="landing-footer-body">We hope to inspire the hanging flower environment of your dreams.</p>
          <p className="landing-footer-body">Sincerely,</p>
        </div>
        <p className="landing-footer-signature">The Hanging Bouquet</p>
      </div>
    </div>
  );
}
