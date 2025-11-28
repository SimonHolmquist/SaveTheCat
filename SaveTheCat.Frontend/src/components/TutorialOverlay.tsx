import { useEffect, useMemo, useState, type CSSProperties, type RefObject } from "react";
import { useTranslation } from "react-i18next";

export type TutorialStep = {
  title: string;
  description: string;
  targetRef?: RefObject<HTMLElement | null>;
};

type Spotlight = {
  top: number;
  left: number;
  width: number;
  height: number;
};

type Props = {
  steps: TutorialStep[];
  currentStep: number;
  isOpen: boolean;
  onNext: () => void;
  onPrev: () => void;
  onSkip: () => void;
};

const CARD_MAX_WIDTH = 380;

function getDefaultSpotlight(): Spotlight {
  const margin = 40;
  return {
    top: margin,
    left: margin,
    width: window.innerWidth - margin * 2,
    height: window.innerHeight - margin * 2,
  };
}

function computeCardPosition(rect: Spotlight | null): CSSProperties {
  if (!rect) {
    return {
      left: "50%",
      bottom: 32,
      transform: "translateX(-50%)",
      maxWidth: CARD_MAX_WIDTH,
    };
  }

  const spaceRight = window.innerWidth - rect.left - rect.width;
  const spaceBottom = window.innerHeight - rect.top - rect.height;

  if (spaceRight > CARD_MAX_WIDTH + 24) {
    return {
      left: rect.left + rect.width + 16,
      top: rect.top,
      maxWidth: CARD_MAX_WIDTH,
    };
  }

  if (spaceBottom > 220) {
    return {
      top: rect.top + rect.height + 16,
      left: Math.min(Math.max(rect.left, 16), window.innerWidth - CARD_MAX_WIDTH - 16),
      maxWidth: CARD_MAX_WIDTH,
    };
  }

  return {
    left: "50%",
    bottom: 32,
    transform: "translateX(-50%)",
    maxWidth: CARD_MAX_WIDTH,
  };
}

export default function TutorialOverlay({
  steps,
  currentStep,
  isOpen,
  onNext,
  onPrev,
  onSkip,
}: Props) {
  const [spotlight, setSpotlight] = useState<Spotlight | null>(null);

  const activeStep = useMemo(() => steps[currentStep] ?? steps[steps.length - 1], [currentStep, steps]);

  useEffect(() => {
    if (!isOpen || !activeStep) return;

    const updateSpotlight = () => {
      const target = activeStep.targetRef?.current;
      if (target) {
        const rect = target.getBoundingClientRect();
        setSpotlight({
          top: rect.top - 12,
          left: rect.left - 12,
          width: rect.width + 24,
          height: rect.height + 24,
        });
      } else {
        setSpotlight(getDefaultSpotlight());
      }
    };

    updateSpotlight();
    const handleResize = () => updateSpotlight();
    window.addEventListener("resize", handleResize);
    window.addEventListener("scroll", handleResize, true);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("scroll", handleResize, true);
    };
  }, [activeStep, isOpen]);

  useEffect(() => {
    if (!isOpen || !activeStep?.targetRef?.current) return;
    const target = activeStep.targetRef.current;
    target.classList.add("tutorial-highlight");
    return () => {
      target.classList.remove("tutorial-highlight");
    };
  }, [activeStep, isOpen]);

  if (!isOpen || !steps.length || !activeStep) return null;

  const isLastStep = currentStep >= steps.length - 1;
  const { t } = useTranslation();

  return (
    <div className="tutorial-overlay" role="dialog" aria-modal="true" aria-label={t('tutorial.ariaLabel')}>
      <div className="tutorial-backdrop" />
      <div
        className="tutorial-spotlight"
        style={spotlight ?? getDefaultSpotlight()}
        aria-hidden
      />

      <div className="tutorial-card" style={computeCardPosition(spotlight ?? null)}>
        <div className="tutorial-card__header">
          <div>
            <p className="tutorial-card__eyebrow">{t('tutorial.stepCounter', { current: currentStep + 1, total: steps.length })}</p>
            <h3 className="tutorial-card__title">{activeStep.title}</h3>
          </div>
          <button type="button" className="tutorial-card__skip" onClick={onSkip}>
            {t('tutorial.skip')}
          </button>
        </div>
        <p className="tutorial-card__description">{activeStep.description}</p>

        <div className="tutorial-card__actions">
          <button type="button" onClick={onPrev} disabled={currentStep === 0}>
            {t('tutorial.prev')}
          </button>
          <div className="tutorial-card__actions--spacer" />
          <button type="button" className="tutorial-card__primary" onClick={onNext}>
            {isLastStep ? t('tutorial.done') : t('tutorial.next')}
          </button>
        </div>
      </div>
    </div>
  );
}
