export const journeyJson = (over: Record<string, unknown> = {}) => ({
  id: 'j1',
  slug: 'kenali-hakmu',
  title: 'Kenali Hakmu sebagai Konsumen',
  description: 'Pengantar hak konsumen.',
  image_url: null,
  order: 1,
  estimated_minutes: 30,
  is_unlocked: true,
  modules_count: 3,
  progress: { status: 'in_progress', percent: 33 },
  ...over,
});

export const sectorDetailJson = (over: Record<string, unknown> = {}) => ({
  id: 's1',
  slug: 'e-commerce',
  name: 'E-Commerce',
  description: 'Transaksi jual-beli online.',
  icon_url: null,
  color: null,
  order: 1,
  progress: { status: 'in_progress', percent: 10 },
  surveys: {
    pretest: { link: null, completed_at: null },
    posttest: { link: null, completed_at: null },
  },
  journeys: [journeyJson()],
  ...over,
});

export const sectorsListJson = () => [{ ...sectorDetailJson(), journeys: undefined }];

export const moduleDetailJson = (over: Record<string, unknown> = {}) => ({
  id: 'm1',
  type: 'materi',
  title: 'Mengenal Hak Dasar',
  description: null,
  estimated_minutes: 5,
  pages: [
    {
      id: 'p1',
      order: 1,
      content_type: 'article',
      progress: { status: 'not_started', last_position: 0 },
      content: {
        id: 'ac1',
        title: 'Hak Dasar',
        blocks: [
          {
            id: 'b1',
            block_type: 'paragraph',
            text_article: 'Konsumen berhak atas keamanan.',
            image_url: null,
            alt_text: null,
            order: 1,
          },
        ],
      },
    },
  ],
  ...over,
});

export const twoPageArticleModuleJson = () => ({
  id: 'm1',
  type: 'materi',
  title: 'Dua Halaman',
  description: null,
  estimated_minutes: 8,
  pages: [
    {
      id: 'p1',
      order: 1,
      content_type: 'article',
      progress: { status: 'not_started', last_position: 0 },
      content: {
        id: 'ac1',
        title: 'Bagian 1',
        blocks: [
          {
            id: 'b1',
            block_type: 'paragraph',
            text_article: 'Isi halaman satu.',
            image_url: null,
            alt_text: null,
            order: 1,
          },
        ],
      },
    },
    {
      id: 'p2',
      order: 2,
      content_type: 'article',
      progress: { status: 'not_started', last_position: 0 },
      content: {
        id: 'ac2',
        title: 'Bagian 2',
        blocks: [
          {
            id: 'b2',
            block_type: 'paragraph',
            text_article: 'Isi halaman dua.',
            image_url: null,
            alt_text: null,
            order: 1,
          },
        ],
      },
    },
  ],
});

export const journeyDetailJson = (over: Record<string, unknown> = {}) => ({
  ...journeyJson(),
  modules: [
    {
      id: 'm1',
      type: 'materi',
      title: 'Mengenal Hak Dasar',
      description: null,
      order: 1,
      estimated_minutes: 5,
      is_required: true,
      progress: { status: 'not_started', percent: 0 },
      locked: false,
      pages: [{ id: 'p1' }],
    },
  ],
  quiz_score: null,
  ...over,
});

export const badgesJson = () => [
  {
    id: 'bd1',
    journey_id: 'j1',
    name: 'Consumer Rights Explorer',
    description: 'Selesaikan journey 1.',
    congratulation_message: 'Hebat!',
    motivational_message: 'Terus belajar.',
    icon_url: null,
    earned: true,
    earned_at: '2026-01-10T00:00:00Z',
  },
  {
    id: 'bd2',
    journey_id: 'j99',
    name: 'Badge Sektor Lain',
    description: 'Tidak boleh muncul.',
    congratulation_message: null,
    motivational_message: null,
    icon_url: null,
    earned: false,
    earned_at: null,
  },
];

export const complaintAgenciesJson = () => [
  {
    id: 'a1',
    slug: 'bpom',
    short_name: 'BPOM',
    full_name: 'Badan Pengawas Obat dan Makanan',
    summary: 'Pengaduan terkait obat, makanan, dan kosmetik.',
    logo_url: null,
    order: 1,
  },
  {
    id: 'a2',
    slug: 'ylki',
    short_name: 'YLKI',
    full_name: 'Yayasan Lembaga Konsumen Indonesia',
    summary: 'Informasi, konsultasi, dan pengaduan konsumen.',
    logo_url: null,
    order: 2,
  },
];

export const complaintCategoriesJson = () => [
  {
    id: 'c1',
    problem: 'Dugaan produk obat atau makanan ilegal',
    agencies: [{ slug: 'bpom', short_name: 'BPOM' }],
  },
];

export const complaintAgencyDetailJson = (over: Record<string, unknown> = {}) => ({
  ...complaintAgenciesJson()[0],
  description: 'BPOM mengawasi obat dan makanan.',
  when_to_contact: ['Menemukan produk ilegal.', 'Kosmetik berbahaya.'],
  how_to_access: 'Gunakan kanal resmi BPOM.',
  notes: null,
  channels: [
    {
      type: 'whatsapp',
      label: 'WhatsApp Halo BPOM',
      value: '0811-9181-533',
      url: 'https://wa.me/6281191811533',
      button_label: 'Hubungi Halo BPOM',
    },
    {
      type: 'address',
      label: 'Alamat',
      value: 'Jl. Percetakan Negara',
      url: null,
      button_label: null,
    },
  ],
  ...over,
});
