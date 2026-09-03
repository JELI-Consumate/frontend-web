import type { Config } from 'tailwindcss';

/**
 * Token-for-token dari `frontend-android/lib/core/theme/*`.
 * Warna *soft* / *muted* memakai alpha yang sama persis dengan
 * `Color.withValues(alpha: ...)` di Flutter.
 */
const config: Config = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    // Skala jarak PERSIS `AppSpacing` (dalam px). Menimpa skala default
    // supaya `p-md`, `gap-lg`, dst. selalu merujuk token, bukan angka Tailwind.
    spacing: {
      '0': '0px',
      px: '1px',
      xxs: '4px',
      xs: '8px',
      sm: '12px',
      md: '16px',
      lg: '24px',
      xl: '32px',
      xxl: '40px',
      xxxl: '56px',
      xxxxl: '64px',
      screen: '24px', // AppSpacing.screenPadding
      // beberapa ukuran mentah yang dipakai apa adanya di layout Flutter
      '2': '2px',
      '3': '3px',
      '6': '6px',
      '13': '13px',
      '20': '20px',
      '28': '28px',
      '36': '36px',
      '40': '40px',
      '44': '44px',
      '48': '48px',
      '56': '56px',
      '60': '60px',
      '72': '72px',
      '76': '76px',
      '92': '92px',
      '96': '96px',
      '104': '104px',
      '130': '130px',
      '132': '132px',
      '170': '170px',
      '208': '208px',
    },
    borderRadius: {
      none: '0px',
      sm: '8px', // AppRadius.sm
      md: '12px', // AppRadius.md
      lg: '16px', // AppRadius.lg
      xl: '24px', // AppRadius.xl
      pill: '999px', // AppRadius.pill
      full: '9999px',
    },
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      inherit: 'inherit',
      primary: {
        DEFAULT: '#0037B0',
        pressed: '#002B8C',
        soft: 'rgba(0, 55, 176, 0.08)', // primary @ 8%
      },
      ink: {
        DEFAULT: '#434655',
        muted: 'rgba(67, 70, 85, 0.75)', // ink @ 75%
      },
      white: '#FFFFFF',
      black: '#000000',
      muted: '#C4C5D7',
      background: '#F8F9FF',
      border: 'rgba(196, 197, 215, 0.5)', // muted @ 50%
      danger: {
        DEFAULT: '#D1344B',
        soft: 'rgba(209, 52, 75, 0.12)', // danger @ 12%
      },
      success: {
        DEFAULT: '#1E9E5A',
        soft: 'rgba(30, 158, 90, 0.12)', // success @ 12%
      },
      warning: {
        DEFAULT: '#E9A23B',
        soft: 'rgba(233, 162, 59, 0.12)', // warning @ 12%
      },
    },
    fontFamily: {
      sans: ['"Plus Jakarta Sans"', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
    },
    // Setiap entri = satu `AppTypography.*` (size / lineHeight-multiple /
    // letterSpacing-px / weight). Warna default diterapkan lewat
    // `core/theme/typography.ts` (setara `TextStyle.color`).
    fontSize: {
      'display-lg': ['30px', { lineHeight: '1.25', letterSpacing: '-0.6px', fontWeight: '800' }],
      'display-md': ['24px', { lineHeight: '1.3', letterSpacing: '-0.4px', fontWeight: '800' }],
      'display-sm': ['20px', { lineHeight: '1.3', letterSpacing: '-0.2px', fontWeight: '700' }],
      'title-lg': ['18px', { lineHeight: '1.6', fontWeight: '700' }],
      'title-md': ['16px', { lineHeight: '1.4', fontWeight: '700' }],
      'title-sm': ['14px', { lineHeight: '1.4', fontWeight: '600' }],
      'body-lg': ['15px', { lineHeight: '1.6', fontWeight: '400' }],
      'body-md': ['14px', { lineHeight: '1.6', fontWeight: '400' }],
      'body-sm': ['13px', { lineHeight: '1.55', fontWeight: '400' }],
      'body-highlight': ['15px', { lineHeight: '1.6', fontWeight: '700' }],
      'label-lg': ['15px', { lineHeight: '1.2', letterSpacing: '0.1px', fontWeight: '600' }],
      'label-md': ['13px', { lineHeight: '1.2', fontWeight: '500' }],
      'label-sm': ['11px', { lineHeight: '1.3', fontWeight: '500' }],
    },
    extend: {
      boxShadow: {
        card: '0 8px 24px rgba(0, 55, 176, 0.06)', // AppShadows.card
        button: '0 6px 16px rgba(0, 55, 176, 0.28)', // AppShadows.button
        navbar: '0 -4px 16px rgba(67, 70, 85, 0.08)', // AppShadows.navBar
      },
      transitionDuration: {
        fast: '150ms', // AppDuration.fast
        normal: '250ms', // AppDuration.normal
        slow: '400ms', // AppDuration.slow
      },
      maxWidth: {
        app: '480px', // lebar konten "mobile-first" maksimum di layar besar
      },
      keyframes: {
        'spin-slow': { to: { transform: 'rotate(360deg)' } },
      },
    },
  },
  plugins: [],
};

export default config;
