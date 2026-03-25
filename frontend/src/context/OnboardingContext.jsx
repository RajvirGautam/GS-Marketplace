import React, { createContext, useContext, useState, useCallback, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const OnboardingContext = createContext(null);

// ── Step definitions ──────────────────────────────────────────────────────────
const ONBOARDING_STEPS = [
  {
    target: 'list-item',
    route: '/marketplace',
    title: 'List an Item',
    message: 'Tap here to list your products for sale, barter, rent or give away!',
    position: 'top',      // tooltip appears above on mobile (the + is at bottom)
  },
  {
    target: 'chat-icon',
    route: '/marketplace',
    title: 'Messages',
    message: 'Message buyers & sellers directly from here.',
    position: 'top',
  },
  {
    target: 'notification-bell',
    route: '/marketplace',
    title: 'Notifications',
    message: 'Get notified about new offers, deals & messages in real-time.',
    position: 'top',
  },
  {
    target: 'dash-overview',
    route: '/dashboard',
    title: 'Dashboard Overview',
    message: 'Your dashboard — stats, activity & performance at a glance.',
    position: 'right',
    preAction: { tab: 'Overview' },
  },
  {
    target: 'dash-listings',
    route: '/dashboard',
    title: 'My Listings',
    message: 'View and manage all your listings here.',
    position: 'right',
    preAction: { tab: 'My Listings' },
  },
  {
    target: 'dash-saved',
    route: '/dashboard',
    title: 'Saved Products',
    message: 'Products you\'ve saved or wishlisted appear here.',
    position: 'right',
    preAction: { tab: 'Saved Products' },
  },
  {
    target: 'dash-deals',
    route: '/dashboard',
    title: 'My Deals',
    message: 'View, accept & track your deals here.',
    position: 'right',
    preAction: { tab: 'My Deals' },
  },
  {
    target: 'chat-page',
    route: '/chat',
    title: 'Chats',
    message: 'Your direct messages live here — negotiate prices and chat with other students.',
    position: 'bottom',
  },
  {
    target: 'product-grid',
    route: '/marketplace',
    title: 'Browse Listings',
    message: 'Browse and discover listings from your campus. Happy trading! 🎉',
    position: 'top',
  },
];

export const OnboardingProvider = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [active, setActive] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const tabSetterRef = useRef(null); // dashboard tab setter callback

  // Allows the Dashboard to register its setSidebarActive function
  const registerTabSetter = useCallback((setter) => {
    tabSetterRef.current = setter;
  }, []);

  const startOnboarding = useCallback(() => {
    setCurrentStep(0);
    setActive(true);
    // If not already on the first step's route, navigate there
    if (location.pathname !== ONBOARDING_STEPS[0].route) {
      navigate(ONBOARDING_STEPS[0].route);
    }
  }, [navigate, location.pathname]);

  const goToStep = useCallback((stepIndex) => {
    if (stepIndex < 0 || stepIndex >= ONBOARDING_STEPS.length) return;
    const step = ONBOARDING_STEPS[stepIndex];

    // Close any onboarding-triggered dropdowns from the previous step
    window.dispatchEvent(new Event('onboarding:close-notifications'));

    // Navigate if needed
    if (location.pathname !== step.route) {
      let targetRoute = step.route;
      if (step.preAction?.tab) {
        targetRoute += `?tab=${encodeURIComponent(step.preAction.tab)}`;
      }
      navigate(targetRoute);
    } else {
      // Apply pre-action (e.g. switch dashboard tab) directly
      if (step.preAction?.tab && tabSetterRef.current) {
        setTimeout(() => {
          if (tabSetterRef.current) tabSetterRef.current(step.preAction.tab);
        }, 100);
      }
    }

    // Open notification panel if this step highlights the notification bell
    if (step.target === 'notification-bell') {
      // Small delay so the element finishes spotlighting before opening panel
      setTimeout(() => {
        window.dispatchEvent(new Event('onboarding:open-notifications'));
      }, 350);
    }

    setCurrentStep(stepIndex);
  }, [navigate, location.pathname]);

  const next = useCallback(() => {
    const nextIdx = currentStep + 1;
    if (nextIdx >= ONBOARDING_STEPS.length) {
      // End of onboarding
      window.dispatchEvent(new Event('onboarding:close-notifications'));
      setActive(false);
      setCurrentStep(0);
      return;
    }
    goToStep(nextIdx);
  }, [currentStep, goToStep]);

  const prev = useCallback(() => {
    if (currentStep <= 0) return;
    goToStep(currentStep - 1);
  }, [currentStep, goToStep]);

  const skip = useCallback(() => {
    window.dispatchEvent(new Event('onboarding:close-notifications'));
    setActive(false);
    setCurrentStep(0);
  }, []);

  return (
    <OnboardingContext.Provider
      value={{
        active,
        currentStep,
        steps: ONBOARDING_STEPS,
        totalSteps: ONBOARDING_STEPS.length,
        currentStepData: ONBOARDING_STEPS[currentStep] || null,
        startOnboarding,
        next,
        prev,
        skip,
        registerTabSetter,
      }}
    >
      {children}
    </OnboardingContext.Provider>
  );
};

export const useOnboarding = () => {
  const ctx = useContext(OnboardingContext);
  if (!ctx) throw new Error('useOnboarding must be used within OnboardingProvider');
  return ctx;
};
