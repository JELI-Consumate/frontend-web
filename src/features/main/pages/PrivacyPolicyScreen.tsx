import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function PrivacyPolicyScreen() {
  const navigate = useNavigate();

  return (
    <div className="min-h-full bg-background pb-2xl">
      <div className="sticky top-0 z-10 bg-background/80 px-screen py-md backdrop-blur-md">
        <button
          onClick={() => navigate(-1)}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm ring-1 ring-border"
        >
          <ArrowLeft className="h-5 w-5 text-content-primary" />
        </button>
      </div>

      <div className="px-screen pt-md">
        <h1 className="text-display-sm font-bold text-content-primary">
          Kebijakan Privasi
        </h1>
        <p className="mt-xs text-body-md text-content-secondary">
          Terakhir diperbarui: 19 September 2026
        </p>

        <div className="mt-xl flex flex-col gap-lg text-body-md text-content-primary">
          <section>
            <h2 className="mb-sm text-title-lg font-bold text-content-primary">
              1. Pengumpulan Informasi
            </h2>
            <p className="leading-relaxed">
              Kami mengumpulkan informasi yang Anda berikan langsung kepada kami,
              seperti nama, alamat email, dan nomor telepon saat mendaftar. Kami juga
              dapat mengumpulkan data progres pembelajaran Anda agar sistem berfungsi dengan baik.
            </p>
          </section>

          <section>
            <h2 className="mb-sm text-title-lg font-bold text-content-primary">
              2. Penggunaan Informasi
            </h2>
            <p className="leading-relaxed mb-xs">
              Informasi yang dikumpulkan digunakan untuk:
            </p>
            <ul className="list-inside list-disc space-y-xs leading-relaxed">
              <li>Menyediakan, memelihara, dan meningkatkan layanan kami.</li>
              <li>Melacak progres pembelajaran dan pencapaian (badges) Anda.</li>
              <li>Berkomunikasi dengan Anda terkait pembaruan layanan Consumate.</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-sm text-title-lg font-bold text-content-primary">
              3. Perlindungan Informasi
            </h2>
            <p className="leading-relaxed">
              Kami mengutamakan keamanan data pribadi Anda dan menerapkan langkah-langkah
              keamanan secara teknis maupun organisasi untuk melindunginya dari akses,
              perubahan, atau pengungkapan yang tidak sah.
            </p>
          </section>

          <section>
            <h2 className="mb-sm text-title-lg font-bold text-content-primary">
              4. Hubungi Kami
            </h2>
            <p className="leading-relaxed">
              Jika Anda memiliki pertanyaan tentang Kebijakan Privasi ini, silakan
              hubungi kami melalui email di tech@perlindungankonsumen.com.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
