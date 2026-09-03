/** Padanan `auth_header.dart`. */
export function AuthHeader() {
  return (
    <div className="relative overflow-hidden bg-white">
      <span
        aria-hidden
        className="absolute -right-[20px] -top-[30px] h-[130px] w-[130px] rounded-full bg-primary/[0.06]"
      />
      <span
        aria-hidden
        className="absolute right-[60px] top-[40px] h-[70px] w-[70px] rounded-full bg-primary/[0.05]"
      />
      <span
        aria-hidden
        className="absolute -top-[10px] left-[10px] h-[60px] w-[60px] rounded-full bg-primary/[0.04]"
      />
      <div className="relative px-screen pb-xl pt-xxl">
        <h1 className="text-[32px] font-extrabold leading-[1.25] tracking-[-0.6px] text-ink">
          Siap untuk
          <br />
          mulai perjalanan
          <br />
          <span className="text-primary">belajarmu?</span>
        </h1>
        <p className="mt-sm text-body-sm text-ink-muted">
          Masuk atau daftar untuk mengakses semua materi dan fitur pembelajaran.
        </p>
      </div>
    </div>
  );
}
