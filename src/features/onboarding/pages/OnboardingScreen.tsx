import { useRef, useState } from 'react';
import { useAppDispatch } from '@/app/hooks';
import { PrimaryButton } from '@/core/components/PrimaryButton';
import { PageDots } from '@/core/components/PageDots';
import { OnboardingPageContent } from '../components/OnboardingPageContent';
import { onboardingPages } from '../model/onboardingPages';
import { finishOnboarding } from '../state/onboardingSlice';

/** Padanan `onboarding_screen.dart`. */
export function OnboardingScreen() {
  const dispatch = useAppDispatch();
  const pages = onboardingPages;
  const [index, setIndex] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);

  function goTo(target: number) {
    const clamped = Math.max(0, Math.min(target, pages.length - 1));
    const track = trackRef.current;
    if (track) {
      track.scrollTo({ left: clamped * track.clientWidth, behavior: 'smooth' });
    }
    setIndex(clamped);
  }

  function onCta() {
    if (index === pages.length - 1) {
      dispatch(finishOnboarding());
    } else {
      goTo(index + 1);
    }
  }

  function onScroll() {
    const track = trackRef.current;
    if (!track) return;
    const next = Math.round(track.scrollLeft / track.clientWidth);
    if (next !== index) setIndex(next);
  }

  return (
    <div className="flex min-h-full flex-col bg-background">
      <div
        ref={trackRef}
        onScroll={onScroll}
        className="flex flex-1 snap-x snap-mandatory overflow-x-auto"
      >
        {pages.map((page) => (
          <div key={page.title} className="w-full flex-shrink-0 snap-center">
            <OnboardingPageContent data={page} />
          </div>
        ))}
      </div>
      <div className="px-screen pb-lg pt-xs">
        <PrimaryButton label={pages[index]?.ctaLabel ?? 'Lanjut'} onPressed={onCta} />
        {pages.length > 1 ? (
          <>
            <div className="h-md" />
            <PageDots count={pages.length} activeIndex={index} onDotTap={goTo} />
          </>
        ) : null}
      </div>
    </div>
  );
}
