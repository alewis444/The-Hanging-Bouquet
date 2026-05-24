import { useState } from "react";
import HomePage from "./components/HomePage";
import GrowScheduleStep from "./components/steps/GrowScheduleStep";
import Congratulations from "./components/steps/Congratulations";
import Library from "./components/Library";
import "./App.css";

const ZONE = "9-10";
const STEP_HOME = 0;
const STEP_SCHEDULE = 1;
const STEP_CONGRATS = 2;

export default function App() {
  const [tab, setTab] = useState("builder");
  const [step, setStep] = useState(STEP_HOME);
  const [acceptedBasket, setAcceptedBasket] = useState(null);
  const [acceptedMood, setAcceptedMood] = useState(null);
  const [acceptedSowDate, setAcceptedSowDate] = useState(null);

  function handleAccept(flowerList, mood, sowDate) {
    setAcceptedBasket(flowerList);
    setAcceptedMood(mood);
    setAcceptedSowDate(sowDate);
    setStep(STEP_SCHEDULE);
  }

  function restart() {
    setStep(STEP_HOME);
    setAcceptedBasket(null);
    setAcceptedMood(null);
    setAcceptedSowDate(null);
  }

  return (
    <div className="app">
      <main className="main-content">
        <h1 className="site-header">The Hanging Bouquet</h1>
        <div className="tabs">
          <button
            className={`tab ${tab === "builder" ? "active" : ""}`}
            onClick={() => { setTab("builder"); if (step !== STEP_HOME) restart(); }}
          >
            Builder
          </button>
          <button
            className={`tab ${tab === "library" ? "active" : ""}`}
            onClick={() => setTab("library")}
          >
            Library
          </button>
        </div>

        {tab === "library" ? (
          <Library />
        ) : (
          <>
            {step === STEP_HOME && (
              <HomePage onAccept={handleAccept} />
            )}
            {step === STEP_SCHEDULE && acceptedBasket && (
              <GrowScheduleStep
                basket={acceptedBasket}
                zone={ZONE}
                sowDate={acceptedSowDate}
                mood={acceptedMood}
                onNext={() => setStep(STEP_CONGRATS)}
                onBack={() => setStep(STEP_HOME)}
              />
            )}
            {step === STEP_CONGRATS && acceptedBasket && (
              <Congratulations
                basket={acceptedBasket}
                sowDate={acceptedSowDate}
                onRestart={restart}
              />
            )}
          </>
        )}
      </main>
    </div>
  );
}
