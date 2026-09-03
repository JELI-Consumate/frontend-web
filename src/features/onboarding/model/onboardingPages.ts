/** Padanan `frontend-android/lib/features/onboarding/domain/onboarding_page_data.dart`. */
export interface OnboardingPageData {
  title: string;
  subtitle: string;
  illustrationSrc: string;
  illustrationLabel: string;
  body: string;
  ctaLabel: string;
}

export const onboardingPages: OnboardingPageData[] = [
  {
    title: 'Selamat Datang!',
    subtitle: 'Mari menjadi konsumen yang lebih cerdas dan terlindungi.',
    illustrationSrc: '/images/welcome_shopping.png',
    illustrationLabel:
      'Ilustrasi seorang konsumen mendorong troli belanja berisi tas belanja.',
    body:
      'Tingkatkan pengetahuanmu dan jadilah **konsumen cerdas** ' +
      'di berbagai sektor kehidupan.',
    ctaLabel: 'Mulai',
  },
];
