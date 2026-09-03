import { parseSectorDetail, pretestGateActive, nextJourney, allJourneysCompleted } from './sectorDetail';
import { sectorDetailJson, journeyJson } from '@/test/fixtures';

describe('SectorDetail turunan', () => {
  it('pretestGateActive: aktif kalau pretest terkonfigurasi, belum diisi, dan semua journey belum mulai', () => {
    const detail = parseSectorDetail(
      sectorDetailJson({
        surveys: {
          pretest: { link: 'https://forms.gle/x', completed_at: null },
          posttest: { link: null, completed_at: null },
        },
        journeys: [journeyJson({ progress: { status: 'not_started', percent: 0 } })],
      }),
    );
    expect(pretestGateActive(detail)).toBe(true);
  });

  it('pretestGateActive: nonaktif kalau ada journey yang sudah dikerjakan', () => {
    const detail = parseSectorDetail(
      sectorDetailJson({
        surveys: {
          pretest: { link: 'https://forms.gle/x', completed_at: null },
          posttest: { link: null, completed_at: null },
        },
        journeys: [journeyJson({ progress: { status: 'in_progress', percent: 20 } })],
      }),
    );
    expect(pretestGateActive(detail)).toBe(false);
  });

  it('nextJourney: journey unlocked pertama yang belum selesai', () => {
    const detail = parseSectorDetail(
      sectorDetailJson({
        journeys: [
          journeyJson({ id: 'j1', order: 1, is_unlocked: true, progress: { status: 'completed', percent: 100 } }),
          journeyJson({ id: 'j2', order: 2, is_unlocked: true, progress: { status: 'not_started', percent: 0 } }),
        ],
      }),
    );
    expect(nextJourney(detail)?.id).toBe('j2');
  });

  it('allJourneysCompleted', () => {
    const detail = parseSectorDetail(
      sectorDetailJson({
        journeys: [journeyJson({ progress: { status: 'completed', percent: 100 } })],
      }),
    );
    expect(allJourneysCompleted(detail)).toBe(true);
  });
});
