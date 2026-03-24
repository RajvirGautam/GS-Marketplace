import React, { useEffect, useState, useRef, useCallback } from 'react';
import ReactDOM from 'react-dom';
import { useOnboarding } from '../../context/OnboardingContext';

// ── CSS injected once ─────────────────────────────────────────────────────────
const OVERLAY_STYLES = `
  @keyframes onb-fade-in { from { opacity: 0 } to { opacity: 1 } }
  @keyframes onb-card-pop {
    from { opacity: 0; transform: translateY(10px) scale(0.97); }
    to   { opacity: 1; transform: translateY(0)   scale(1); }
  }

  .onb-mask-container {
    position: fixed; inset: 0; z-index: 99990;
    pointer-events: auto;
    animation: onb-fade-in 0.25s ease;
  }

  .onb-svg-overlay {
    width: 100vw; height: 100vh;
    display: block;
    pointer-events: none;
  }

  .onb-svg-cutout {
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  }

  /* ─── Card shell ─────────────────────────────────────────────────────────── */
  .onb-card {
    position: fixed; z-index: 99992;
    width: 288px;
    max-width: calc(100vw - 32px);
    border-radius: 24px;
    padding: 24px 22px 20px;
    /* gradient: bright cornflower-blue → deep violet, matching reference */
    background:
      radial-gradient(ellipse at 18% 22%, rgba(255,255,255,0.28) 0%, transparent 48%),
      linear-gradient(148deg, #5B92F5 0%, #7260EC 42%, #8B48E4 100%);
    border: 1px solid rgba(255,255,255,0.18);
    box-shadow:
      0 2px 0 rgba(255,255,255,0.15) inset,
      0 20px 48px -8px rgba(80, 60, 200, 0.50),
      0 8px 20px rgba(0,0,0,0.22);
    animation: onb-card-pop 0.32s cubic-bezier(0.16, 1, 0.3, 1);
    font-family: 'Manrope', sans-serif;
    pointer-events: auto;
    transition: top 0.32s cubic-bezier(0.4,0,0.2,1), left 0.32s cubic-bezier(0.4,0,0.2,1);
    overflow: hidden;
  }

  /* ─── Title ──────────────────────────────────────────────────────────────── */
  .onb-card-title {
    font-size: 20px;
    font-weight: 800;
    color: #fff;
    line-height: 1.25;
    letter-spacing: -0.25px;
    margin-bottom: 8px;
    padding-right: 28px; /* clear the ✕ button */
  }

  /* ─── Body text ──────────────────────────────────────────────────────────── */
  .onb-card-msg {
    font-size: 13px;
    line-height: 1.58;
    color: rgba(255,255,255,0.78);
    margin-bottom: 20px;
  }

  /* ─── Footer row ─────────────────────────────────────────────────────────── */
  .onb-card-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
  }

  /* ─── Dots ───────────────────────────────────────────────────────────────── */
  .onb-dots {
    display: flex;
    gap: 5px;
    align-items: center;
  }
  .onb-dot {
    width: 5px; height: 5px;
    border-radius: 50%;
    background: rgba(255,255,255,0.28);
    transition: all 0.22s ease;
    flex-shrink: 0;
  }
  .onb-dot.active {
    background: rgba(255,255,255,0.95);
    width: 18px;
    border-radius: 3px;
  }
  .onb-dot.done {
    background: rgba(255,255,255,0.52);
  }

  /* ─── Button group ───────────────────────────────────────────────────────── */
  .onb-btns {
    display: flex;
    gap: 7px;
    align-items: center;
  }

  .onb-btn {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    height: 34px;
    padding: 0 17px;
    border-radius: 100px;
    font-size: 13px;
    font-weight: 700;
    cursor: pointer;
    border: none;
    font-family: 'Manrope', sans-serif;
    white-space: nowrap;
    transition: opacity 0.15s, transform 0.15s, box-shadow 0.15s;
  }

  /* Back — ghost pill */
  .onb-btn-prev {
    background: rgba(255,255,255,0.15);
    color: rgba(255,255,255,0.88);
    border: 1px solid rgba(255,255,255,0.22);
  }
  .onb-btn-prev:hover { background: rgba(255,255,255,0.23); }

  /* Next / Finish — white solid pill (matches reference "Learn more →") */
  .onb-btn-next {
    background: #ffffff;
    color: #1a1040;
    letter-spacing: -0.1px;
  }
  .onb-btn-next:hover {
    opacity: 0.92;
    transform: translateY(-1px);
    box-shadow: 0 6px 18px rgba(0,0,0,0.18);
  }

  /* ─── Close ──────────────────────────────────────────────────────────────── */
  .onb-close {
    position: absolute;
    top: 13px; right: 13px;
    width: 24px; height: 24px;
    border-radius: 50%;
    background: rgba(255,255,255,0.15);
    border: 1px solid rgba(255,255,255,0.2);
    color: rgba(255,255,255,0.72);
    display: flex; align-items: center; justify-content: center;
    cursor: pointer;
    font-size: 11px; line-height: 1;
    transition: background 0.15s, color 0.15s;
  }
  .onb-close:hover {
    background: rgba(255,255,255,0.28);
    color: #fff;
  }

  /* ─── Step counter ───────────────────────────────────────────────────────── */
  .onb-step-counter {
    font-family: 'JetBrains Mono', monospace;
    font-size: 10px;
    font-weight: 700;
    color: rgba(255,255,255,0.40);
    letter-spacing: 0.4px;
    text-align: center;
    margin-top: 10px;
  }

  /* ─── Mobile overrides ───────────────────────────────────────────────────── */
  @media (max-width: 768px) {
    .onb-card {
      width: calc(100vw - 44px) !important;
      left: 22px !important;
      padding: 20px 18px 16px !important;
      border-radius: 20px !important;
    }
    .onb-card-title { font-size: 17px; }
    .onb-card-msg   { font-size: 12px; margin-bottom: 14px; }
    .onb-btn        { height: 30px; padding: 0 13px; font-size: 12px; }
    .onb-step-counter { font-size: 9px; }
  }
`;

// Helper: compute tooltip card position relative to the spotlight rect
const computeCardPos = (rect, preferredPos) => {
  const CARD_W = 300;
  const CARD_H_APPROX = 180;
  const GAP = 14;
  const vw = window.innerWidth;
  const vh = window.innerHeight;

  if (vw <= 768) {
    // Center vertically to safely avoid top notch and bottom nav
    // card height roughly ~150px on mobile
    return { 
      top: (vh / 2) - 75, 
      left: 24 
    };
  }

  let top, left;

  // Try preferred, fallback to what fits
  const positions = [preferredPos, 'bottom', 'top', 'right', 'left'];

  for (const pos of positions) {
    if (pos === 'bottom' && rect.bottom + GAP + CARD_H_APPROX < vh) {
      top = rect.bottom + GAP;
      left = Math.max(16, Math.min(rect.left + rect.width / 2 - CARD_W / 2, vw - CARD_W - 16));
      return { top, left };
    }
    if (pos === 'top' && rect.top - GAP - CARD_H_APPROX > 0) {
      top = rect.top - GAP - CARD_H_APPROX;
      left = Math.max(16, Math.min(rect.left + rect.width / 2 - CARD_W / 2, vw - CARD_W - 16));
      return { top, left };
    }
    if (pos === 'right' && rect.right + GAP + CARD_W < vw) {
      top = Math.max(16, Math.min(rect.top + rect.height / 2 - CARD_H_APPROX / 2, vh - CARD_H_APPROX - 16));
      left = rect.right + GAP;
      return { top, left };
    }
    if (pos === 'left' && rect.left - GAP - CARD_W > 0) {
      top = Math.max(16, Math.min(rect.top + rect.height / 2 - CARD_H_APPROX / 2, vh - CARD_H_APPROX - 16));
      left = rect.left - GAP - CARD_W;
      return { top, left };
    }
  }

  // Fallback: center
  return {
    top: vh / 2 - CARD_H_APPROX / 2,
    left: Math.max(16, vw / 2 - CARD_W / 2),
  };
};

const OnboardingOverlay = () => {
  const { active, currentStep, steps, totalSteps, currentStepData, next, prev, skip } = useOnboarding();
  const [rect, setRect] = useState(null);
  const rafRef = useRef(null);
  const observerRef = useRef(null);

  // Find the target element and track its position
  const trackTarget = useCallback(() => {
    if (!active || !currentStepData) return;

    // We select all elements matching the data-onboarding attribute.
    // Then we filter out the ones that are hidden (width or height is 0)
    // This solves the issue on mobile where the desktop version exists but is hidden.
    const els = Array.from(document.querySelectorAll(`[data-onboarding="${currentStepData.target}"]`));
    const el = els.find(e => {
        const r = e.getBoundingClientRect();
        return r.width > 0 && r.height > 0;
    });

    if (el) {
      const r = el.getBoundingClientRect();
      const PAD = 6;
      setRect({
        top: r.top - PAD,
        left: r.left - PAD,
        width: r.width + PAD * 2,
        height: r.height + PAD * 2,
      });
    } else {
      setRect(null);
    }

    rafRef.current = requestAnimationFrame(trackTarget);
  }, [active, currentStepData]);

  useEffect(() => {
    if (!active) {
      setRect(null);
      return;
    }

    // Wait for element to appear via polling (covers route changes)
    let attempts = 0;
    const maxAttempts = 50; // 5 seconds max
    const poll = setInterval(() => {
      const el = document.querySelector(`[data-onboarding="${currentStepData?.target}"]`);
      if (el || attempts >= maxAttempts) {
        clearInterval(poll);
        trackTarget();
      }
      attempts++;
    }, 100);

    // Also listen to scroll + resize
    window.addEventListener('scroll', trackTarget, true);
    window.addEventListener('resize', trackTarget);

    return () => {
      clearInterval(poll);
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('scroll', trackTarget, true);
      window.removeEventListener('resize', trackTarget);
    };
  }, [active, currentStep, currentStepData, trackTarget]);

  if (!active || !currentStepData) return null;

  const cardPos = rect ? computeCardPos(rect, currentStepData.position) : { top: '50%', left: '50%' };
  const isLast = currentStep === totalSteps - 1;
  const isFirst = currentStep === 0;

  const isDashboard = currentStepData?.route === '/dashboard';
  const overlayOpacity = isDashboard ? 0.3 : 0.85;

  const overlay = (
    <>
      <style>{OVERLAY_STYLES}</style>

      {/* SVG Mask for spotlight effect */}
      <div className="onb-mask-container" onClick={(e) => e.stopPropagation()}>
        <svg className="onb-svg-overlay" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <mask id="onb-hole">
              <rect width="100%" height="100%" fill="white" />
              {rect && (
                <rect
                  className="onb-svg-cutout"
                  x={rect.left}
                  y={rect.top}
                  width={rect.width}
                  height={rect.height}
                  rx={currentStepData?.target === 'list-item' ? rect.width / 2 : 12}
                  fill="black"
                />
              )}
            </mask>
          </defs>
          <rect width="100%" height="100%" fill={`rgba(0,0,0,${overlayOpacity})`} mask="url(#onb-hole)" />
        </svg>
      </div>

      {/* Tooltip card */}
      <div
        className="onb-card"
        key={currentStep}
        style={{
          top:  cardPos.top  !== undefined ? cardPos.top  : 'auto',
          bottom: cardPos.bottom !== undefined ? cardPos.bottom : 'auto',
          left: cardPos.left,
        }}
      >
        <button className="onb-close" onClick={skip} title="Skip tour">✕</button>

        <div className="onb-card-title">{currentStepData.title}</div>
        <div className="onb-card-msg">{currentStepData.message}</div>

        <div className="onb-card-footer">
          <div className="onb-dots">
            {steps.map((_, i) => (
              <div
                key={i}
                className={`onb-dot${i === currentStep ? ' active' : i < currentStep ? ' done' : ''}`}
              />
            ))}
          </div>

          <div className="onb-btns">
            {!isFirst && (
              <button className="onb-btn onb-btn-prev" onClick={prev}>Back</button>
            )}
            <button className="onb-btn onb-btn-next" onClick={next}>
              {isLast ? 'Finish' : 'Next'} →
            </button>
          </div>
        </div>

        <div className="onb-step-counter">{currentStep + 1} / {totalSteps}</div>
      </div>
    </>
  );

  return ReactDOM.createPortal(overlay, document.body);
};

export default OnboardingOverlay;
