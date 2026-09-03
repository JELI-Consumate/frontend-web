# Perlindungan Konsumen — Web (SPA)

Port web dari `../frontend-android` (Flutter). Tujuan: **paritas 1:1** — logika,
alur, dan design system yang sama, hanya beda platform.

- **React 19 + Vite 6 + TypeScript** (strict)
- **Tailwind CSS** — token warna/spacing/radius/shadow/tipografi disalin
  token-per-token dari `frontend-android/lib/core/theme/*`
  (lihat `tailwind.config.ts`)
- **Redux Toolkit + RTK Query** untuk SELURUH state management
  - server state (data backend) → RTK Query di `src/features/*/api/*`
  - UI/sesi state → slice biasa (`auth`, `onboarding`, `activeSector`, `mainTab`)
- **Feature-based** — `src/features/<fitur>/{api,model,state,hooks,components,pages}`
- **Custom hooks** untuk logika reusable (mis. `useLoginForm`, `useOtpVerification`,
  `usePrimarySectorDetail`) — pengganti `*State` class di Flutter
- **Mobile-first** — konten dibatasi `max-w-app` (480px) & dipusatkan di layar besar

## Menjalankan

```bash
npm install
cp .env.example .env      # isi VITE_API_BASE_URL & VITE_GOOGLE_CLIENT_ID
npm run dev               # http://localhost:5173
```

Backend Laravel harus jalan di `VITE_API_BASE_URL` (default
`http://localhost:8000/api/v1`) dengan CORS mengizinkan `http://localhost:5173`.

### Google Sign-In

Butuh **OAuth 2.0 Web Client ID** (bukan client id Android). Buat di Google Cloud
Console → Credentials → tipe "Web application", tambahkan `http://localhost:5173`
ke Authorized JavaScript origins, taruh di `VITE_GOOGLE_CLIENT_ID`. Tanpa itu,
tombol Google menampilkan info "belum dikonfigurasi".

## Skrip

| perintah            | fungsi                                   |
| ------------------- | ---------------------------------------- |
| `npm run dev`       | dev server                              |
| `npm run build`     | typecheck + build produksi (`dist/`)   |
| `npm run typecheck` | `tsc` saja                              |
| `npm run lint`      | ESLint                                  |
| `npm run test`      | Vitest + React Testing Library          |

## Keamanan

- Token Sanctum di `localStorage` (`auth_token`) + cache in-memory — setara
  `flutter_secure_storage` yang membuat sesi Android bertahan melewati cold start.
- CSP ketat di `index.html`; tanpa `dangerouslySetInnerHTML`.
- Interceptor 401 (`src/api/httpClient.ts`) langsung membuang token + reset state.

## Status port

**Sudah diport (paritas dengan Flutter):**

- ✅ Scaffold, design system (Tailwind), lapisan API (`src/api` + RTK Query)
- ✅ Auth: login, register, Google (GIS), lupa password, reset password, OTP verify
- ✅ Onboarding + pilih sektor (grid + panel konfirmasi)
- ✅ MainShell (bottom nav) + Dashboard (kartu lanjut belajar, kartu survei
  pre/post-test, gerbang pre-test, kartu journey berikutnya)
- ✅ Perjalanan (daftar journey) + gerbang pre-test
- ✅ Detail journey (baris modul, kartu progres) + rantai modul + cek "journey baru tuntas"
- ✅ 5 layar modul: article/materi/infografis, video (embed YouTube), kuis
  (multiple-choice + likert + hasil), simulasi (matching + ordering, drag/tap),
  refleksi (open question + checklist)
- ✅ Modul multi-halaman: chrome (top/bottom bar) di-*hoist* ke induk — tidak
  ikut menggeser saat swipe antar-halaman (`ModulePageScaffold`)
- ✅ Layar perayaan journey + badge (ring + ringkasan + lanjut/beranda)
- ✅ Tab Pencapaian (badges): sektor-scoped + kartu ringkasan + detail sheet
- ✅ Profil: data + logout + edit nama (sheet) + edit tanggal lahir (date picker)
- ✅ Test: Vitest + React Testing Library — 23 test (parser murni, error-mapper,
  `computeJourneyCelebration`, validasi Auth, gerbang Dashboard, filter Badges,
  daftar modul Journey detail, smoke AppRoot). `npm run test`.

**Belum / beda dari Flutter:**

- ⏳ FCM push (di-drop sesuai keputusan) & deep-link resume via `/progress/next`
  — Dashboard "Lanjutkan Belajar" sudah menutupi kebutuhan utamanya
- ⏳ Ganti foto profil (Flutter juga masih "Segera Hadir")
- ⏳ Code-splitting per rute (bundle ~164 KB gzip, satu chunk)
- Video: Flutter pakai `webview_flutter` + `youtube_player_iframe`; web pakai
  `<iframe>` embed YouTube langsung (lebih sederhana, hasil setara)
- Drag-and-drop simulasi ordering: HTML5 DnD + tap-to-place (Flutter: long-press drag)

## Peta padanan (Flutter → Web)

| Flutter                                   | Web                                              |
| ----------------------------------------- | ----------------------------------------------- |
| `lib/core/theme/*`                        | `tailwind.config.ts` + `src/core/theme/*`      |
| `lib/core/network/api_client.dart`        | `src/api/httpClient.ts` + `src/api/baseQuery.ts`|
| `lib/core/network/api_exception.dart`     | `src/api/apiError.ts` + `src/api/apiEnvelope.ts`|
| `lib/core/widgets/*`                      | `src/core/components/*`                         |
| Riverpod `FutureProvider` / `AsyncNotifier` | RTK Query query/mutation di `features/*/api`  |
| Riverpod `Notifier` (state sesi)          | slice Redux di `features/*/state`               |
| `ConsumerStatefulWidget` + `*State`       | custom hook (`useLoginForm`, dst.)              |
| `Navigator.push`                          | `react-router` (`AppRoot` = gerbang berlapis)  |
| `showAppAlert`                            | `useAlert()` + `<AlertProvider>`               |
