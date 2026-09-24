import { useState } from "react";
import LandingPage from "./components/LandingPage";
import HomePage from "./components/HomePage";
import GrowScheduleStep from "./components/steps/GrowScheduleStep";
import Congratulations from "./components/steps/Congratulations";
import Library from "./components/Library";
import ColorSystem from "./components/ColorSystem";
import "./App.css";

const ZONE = "9-10";

export default function App() {
  const [phase, setPhase] = useState("landing"); // "landing" | "builder" | "library" | "colors"
  const [step, setStep] = useState(0);           // 0=builder, 1=schedule, 2=congrats
  const [initialMood, setInitialMood] = useState(null);
  const [initialDate, setInitialDate] = useState(null);
  const [acceptedBasket, setAcceptedBasket] = useState(null);
  const [acceptedMood, setAcceptedMood] = useState(null);
  const [acceptedSowDate, setAcceptedSowDate] = useState(null);

  function handleLandingSubmit(sowDate, moodId) {
    setInitialMood(moodId);
    setInitialDate(sowDate);
    setStep(0);
    setPhase("builder");
  }

  function handleAccept(flowerList, mood, sowDate) {
    setAcceptedBasket(flowerList);
    setAcceptedMood(mood);
    setAcceptedSowDate(sowDate);
    setStep(1);
  }

  function restart() {
    setStep(0);
    setAcceptedBasket(null);
    setAcceptedMood(null);
    setAcceptedSowDate(null);
  }

  function goHome() {
    setPhase("landing");
    setStep(0);
    setAcceptedBasket(null);
    setAcceptedMood(null);
    setAcceptedSowDate(null);
    delete document.documentElement.dataset.theme;
  }

  if (phase === "landing") {
    return (
      <LandingPage
        onSubmit={handleLandingSubmit}
        onLibrary={() => setPhase("library")}
        onColorSystem={() => setPhase("colors")}
      />
    );
  }

  if (phase === "library") {
    return (
      <div className="app">
        <main className="main-content">
          <div className="builder-header">
            <button className="builder-back-btn" onClick={goHome}>← Home</button>
            <h1 className="site-header">The Hanging Bouquet</h1>
          </div>
          <Library />
        </main>
      </div>
    );
  }

  if (phase === "colors") {
    return (
      <div className="app">
        <main className="main-content">
          <div className="builder-header">
            <button className="builder-back-btn" onClick={goHome}>← Home</button>
            <h1 className="site-header">The Hanging Bouquet</h1>
          </div>
          <ColorSystem />
        </main>
      </div>
    );
  }

  // phase === "builder"
  return (
    <div className="app">
      <main className="main-content">
        <div className="builder-header">
          <button className="builder-back-btn" onClick={goHome}>← Home</button>
          <h1 className="site-header">The Hanging Bouquet</h1>
        </div>

        {step === 0 && (
          <HomePage
            initialMood={initialMood}
            initialSowDate={initialDate}
            onAccept={handleAccept}
          />
        )}
        {step === 1 && acceptedBasket && (
          <GrowScheduleStep
            basket={acceptedBasket}
            zone={ZONE}
            sowDate={acceptedSowDate}
            mood={acceptedMood}
            onNext={() => setStep(2)}
            onBack={() => setStep(0)}
          />
        )}
        {step === 2 && acceptedBasket && (
          <Congratulations
            basket={acceptedBasket}
            sowDate={acceptedSowDate}
            onRestart={restart}
          />
        )}
      </main>
    </div>
  );
}
