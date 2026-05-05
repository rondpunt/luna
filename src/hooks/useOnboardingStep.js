import { useState, useCallback } from "react";

/**
 * @param {number} totalSteps
 */
export function useOnboardingStep(totalSteps) {
  const [step, setStep] = useState(0);

  const next = useCallback(() => {
    setStep((s) => Math.min(s + 1, Math.max(0, totalSteps - 1)));
  }, [totalSteps]);

  const back = useCallback(() => {
    setStep((s) => Math.max(s - 1, 0));
  }, []);

  const goTo = useCallback((n) => {
    const max = Math.max(0, totalSteps - 1);
    setStep(Math.min(Math.max(n, 0), max));
  }, [totalSteps]);

  const progress = totalSteps > 0 ? (step + 1) / totalSteps : 0;

  return { step, setStep, next, back, goTo, progress, isFirst: step === 0, isLast: step >= totalSteps - 1 };
}
