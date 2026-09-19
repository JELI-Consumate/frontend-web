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
              Kami mengumpulkan informasi yang Anda berikan langsung kepada kami, seperti nama, alamat email, dan nomor telepon saat Anda mendaftar atau membuat akun. Kami juga secara otomatis mengumpulkan data aktivitas dan progres pembelajaran Anda di dalam aplikasi agar sistem dapat berfungsi dengan baik.
            </p>
          </section>

          <section>
            <h2 className="mb-sm text-title-lg font-bold text-content-primary">
              2. Penggunaan Informasi
            </h2>
            <p className="leading-relaxed mb-xs">
              Informasi yang kami kumpulkan digunakan untuk tujuan berikut:
            </p>
            <ul className="list-inside list-disc space-y-xs leading-relaxed">
              <li>Menyediakan, memelihara, dan meningkatkan kualitas layanan Consumate.</li>
              <li>Melacak progres pembelajaran dan memberikan pencapaian (badges) kepada Anda.</li>
              <li>Berkomunikasi dengan Anda terkait dukungan teknis, keamanan, dan pembaruan layanan.</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-sm text-title-lg font-bold text-content-primary">
              3. Pembagian Data dengan Pihak Ketiga
            </h2>
            <p className="leading-relaxed">
              Kami sangat menghargai privasi Anda dan tidak menjual data pribadi Anda kepada siapa pun. Kami hanya membagikan informasi Anda kepada vendor atau penyedia layanan pihak ketiga (misalnya layanan cloud hosting atau pengelola server) yang secara langsung membantu operasional layanan kami. Pihak ketiga ini terikat oleh kewajiban ketat untuk menjaga kerahasiaan dan keamanan data Anda.
            </p>
          </section>

          <section>
            <h2 className="mb-sm text-title-lg font-bold text-content-primary">
              4. Masa Penyimpanan Data
            </h2>
            <p className="leading-relaxed">
              Data pribadi Anda akan kami simpan selama akun Anda aktif atau selama diperlukan untuk menyediakan layanan kepada Anda. Apabila Anda memutuskan untuk berhenti menggunakan layanan dan menghapus akun, kami akan menghapus atau menganonimkan data pribadi Anda dari sistem kami sesuai dengan peraturan perundang-undangan yang berlaku.
            </p>
          </section>

          <section>
            <h2 className="mb-sm text-title-lg font-bold text-content-primary">
              5. Perlindungan Informasi
            </h2>
            <p className="leading-relaxed">
              Kami mengutamakan keamanan data pribadi Anda. Kami menerapkan langkah-langkah keamanan secara teknis maupun organisasi yang wajar untuk melindungi data Anda dari akses, perubahan, kehilangan, atau pengungkapan yang tidak sah oleh pihak yang tidak bertanggung jawab.
            </p>
          </section>

          <section>
            <h2 className="mb-sm text-title-lg font-bold text-content-primary">
              6. Penggunaan Cookies dan Teknologi Pelacakan
            </h2>
            <p className="leading-relaxed">
              Kami mungkin menggunakan cookies atau teknologi serupa untuk mengenali sesi login Anda, mengingat preferensi Anda, dan meningkatkan pengalaman penggunaan aplikasi. Anda dapat mengatur atau menolak cookies melalui pengaturan perangkat atau browser Anda.
            </p>
          </section>

          <section>
            <h2 className="mb-sm text-title-lg font-bold text-content-primary">
              7. Hak Anda atas Data Pribadi
            </h2>
            <p className="leading-relaxed mb-xs">
              Anda memiliki kendali penuh atas data pribadi Anda. Anda berhak untuk:
            </p>
            <ul className="list-inside list-disc space-y-xs leading-relaxed">
              <li>Mengakses dan melihat data pribadi yang kami simpan tentang Anda.</li>
              <li>Memperbarui atau mengoreksi data yang tidak akurat.</li>
              <li>Meminta penghapusan data pribadi Anda atau menghapus akun Anda secara permanen.</li>
            </ul>
            <p className="mt-xs leading-relaxed">
              Permintaan terkait hak ini dapat dilakukan melalui menu pengaturan di dalam aplikasi atau dengan menghubungi kami secara langsung.
            </p>
          </section>

          <section>
            <h2 className="mb-sm text-title-lg font-bold text-content-primary">
              8. Perubahan pada Kebijakan Privasi
            </h2>
            <p className="leading-relaxed">
              Kami dapat memperbarui Kebijakan Privasi ini dari waktu ke waktu untuk menyesuaikan dengan layanan kami atau peraturan hukum yang baru. Jika terdapat perubahan yang signifikan, kami akan memberikan pemberitahuan kepada Anda melalui aplikasi atau email sebelum pembaruan tersebut diberlakukan.
            </p>
          </section>

          <section>
            <h2 className="mb-sm text-title-lg font-bold text-content-primary">
              9. Hubungi Kami
            </h2>
            <p className="leading-relaxed">
              Jika Anda memiliki pertanyaan, masukan, atau ingin menggunakan hak Anda terkait Kebijakan Privasi ini, silakan hubungi kami melalui email di: consumate.id@gmail.com.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
