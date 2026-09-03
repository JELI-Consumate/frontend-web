import { AppIllustration } from '@/core/components/AppIllustration';
import { HighlightText } from '@/core/components/HighlightText';
import type { OnboardingPageData } from '../model/onboardingPages';

/** Padanan `onboarding_page_content.dart`. */
export function OnboardingPageContent({ data }: { data: OnboardingPageData }) {
  return (
    <div className="flex min-h-full flex-col items-stretch px-screen">
      <div className="h-xxxxl" />
      <h1 className="text-center text-display-lg text-primary">{data.title}</h1>
      <div className="h-xs" />
      <p className="text-center text-body-sm text-ink-muted">{data.subtitle}</p>
      <div className="flex-1" />
      <AppIllustration src={data.illustrationSrc} alt={data.illustrationLabel} />
      <div className="flex-1" />
      <HighlightText text={data.body} />
      <div className="h-md" />
    </div>
  );
}
