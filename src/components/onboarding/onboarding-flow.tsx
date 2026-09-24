"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Icon } from "@/components/icons";
import { createClient } from "@/lib/supabase/client";

const genreChoices = [
  "Action",
  "Adventure",
  "Fantasy",
  "Sci-Fi",
  "Romance",
  "Drama",
];
const formatChoices = [
  {
    value: "Comics",
    label: "Comics",
    note: "Panels, pages, and bold visual worlds",
  },
  {
    value: "Vertical",
    label: "Vertical stories",
    note: "Built for a smooth mobile scroll",
  },
  {
    value: "Illustrated",
    label: "Illustrated fiction",
    note: "Words and artwork together",
  },
  {
    value: "Prose",
    label: "Serialized fiction",
    note: "Chapter-by-chapter reading",
  },
];
const discoveryChoices = [
  "New releases",
  "Hidden gems",
  "Popular stories",
  "Creator updates",
];

export function OnboardingFlow() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [genres, setGenres] = useState<string[]>([]);
  const [formats, setFormats] = useState<string[]>([]);
  const [discovery, setDiscovery] = useState<string[]>([]);
  const totalSteps = 3;

  const canContinue = useMemo(() => {
    if (step === 1) return genres.length >= 2;
    if (step === 2) return formats.length >= 1;
    return discovery.length >= 1;
  }, [step, genres, formats, discovery]);

  function toggle(
    value: string,
    selected: string[],
    update: (values: string[]) => void,
  ) {
    update(
      selected.includes(value)
        ? selected.filter((item) => item !== value)
        : [...selected, value],
    );
  }

  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");

  async function savePreferences(shouldSkip = false) {
    setSaving(true);
    setSaveError("");
    const preferences = shouldSkip ? { genres: [], formats: [], discovery: [] } : { genres, formats, discovery };
    const { error } = await createClient().auth.updateUser({
      data: { preferences, onboarding_complete: true },
    });
    if (error) {
      setSaveError(error.message);
      setSaving(false);
      return;
    }
    sessionStorage.setItem("ashabi-preferences", JSON.stringify(preferences));
    router.push("/home");
  }

  return (
    <section className="onboarding-shell" aria-labelledby="onboarding-title">
      <div
        className="onboarding-progress"
        aria-label={`Step ${step} of ${totalSteps}`}
      >
        <div>
          <span style={{ width: `${(step / totalSteps) * 100}%` }} />
        </div>
        <p>
          Step {step} of {totalSteps}
        </p>
      </div>

      {step === 1 && (
        <div className="onboarding-step">
          <p className="eyebrow">Shape your discovery</p>
          <h1 id="onboarding-title">Which worlds pull you in?</h1>
          <p className="onboarding-lead">
            Choose at least two. You can change these later.
          </p>
          <div className="choice-grid genre-choice-grid">
            {genreChoices.map((genre) => {
              const active = genres.includes(genre);
              return (
                <button
                  type="button"
                  key={genre}
                  className={active ? "choice-card selected" : "choice-card"}
                  aria-pressed={active}
                  onClick={() => toggle(genre, genres, setGenres)}
                >
                  <Icon name="compass" />
                  <span>{genre}</span>
                  {active && <span className="choice-check">Selected</span>}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="onboarding-step">
          <p className="eyebrow">Choose your rhythm</p>
          <h1 id="onboarding-title">How do you like stories told?</h1>
          <p className="onboarding-lead">Pick one or more formats.</p>
          <div className="choice-grid format-choice-grid">
            {formatChoices.map((format) => {
              const active = formats.includes(format.value);
              return (
                <button
                  type="button"
                  key={format.value}
                  className={active ? "choice-card selected" : "choice-card"}
                  aria-pressed={active}
                  onClick={() => toggle(format.value, formats, setFormats)}
                >
                  <Icon name="book" />
                  <span>{format.label}</span>
                  <small>{format.note}</small>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="onboarding-step">
          <p className="eyebrow">Fine-tune your home</p>
          <h1 id="onboarding-title">What should Ashabi bring you?</h1>
          <p className="onboarding-lead">
            We’ll use this to organize your reader home.
          </p>
          <div className="choice-grid discovery-choice-grid">
            {discoveryChoices.map((item) => {
              const active = discovery.includes(item);
              return (
                <button
                  type="button"
                  key={item}
                  className={active ? "choice-card selected" : "choice-card"}
                  aria-pressed={active}
                  onClick={() => toggle(item, discovery, setDiscovery)}
                >
                  <Icon name="grid" />
                  <span>{item}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      <div className="onboarding-actions">
        {step > 1 ? (
          <button
            type="button"
            className="button secondary"
            onClick={() => setStep(step - 1)}
          >
            Back
          </button>
        ) : (
          <button
            type="button"
            className="onboarding-skip"
            onClick={() => savePreferences(true)}
            disabled={saving}
          >
            Skip for now
          </button>
        )}
        <button
          type="button"
          className="button primary"
          disabled={!canContinue || saving}
          onClick={() =>
            step === totalSteps ? savePreferences() : setStep(step + 1)
          }
        >
          {saving ? "Saving…" : step === totalSteps ? "Build my reader home" : "Continue"}
          <Icon name="arrow" />
        </button>
      </div>
      {saveError && <p className="auth-notice" role="alert">{saveError}</p>}
    </section>
  );
}
