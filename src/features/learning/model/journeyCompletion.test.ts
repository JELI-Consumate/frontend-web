import { computeJourneyCelebration } from './journeyCompletion';
import { parseJourneyDetail } from './journeyDetail';
import { parseSectorDetail } from './sectorDetail';
import { parseBadge } from '@/features/badges/model/badge';
import { journeyDetailJson, sectorDetailJson, journeyJson, badgesJson } from '@/test/fixtures';

const badges = badgesJson().map(parseBadge);

describe('computeJourneyCelebration', () => {
  it('null kalau journey belum completed', () => {
    const refreshed = parseJourneyDetail(
      journeyDetailJson({ progress: { status: 'in_progress', percent: 50 } }),
    );
    expect(
      computeJourneyCelebration({
        journeyId: 'j1',
        wasCompletedBefore: false,
        refreshed,
        badges,
        sectorDetail: null,
      }),
    ).toBeNull();
  });

  it('null kalau journey memang sudah lama selesai', () => {
    const refreshed = parseJourneyDetail(
      journeyDetailJson({ progress: { status: 'completed', percent: 100 } }),
    );
    expect(
      computeJourneyCelebration({
        journeyId: 'j1',
        wasCompletedBefore: true,
        refreshed,
        badges,
        sectorDetail: null,
      }),
    ).toBeNull();
  });

  it('mengembalikan data perayaan + badge yang diraih + next journey id', () => {
    const refreshed = parseJourneyDetail(
      journeyDetailJson({ id: 'j1', order: 1, progress: { status: 'completed', percent: 100 } }),
    );
    const sector = parseSectorDetail(
      sectorDetailJson({
        journeys: [
          journeyJson({ id: 'j1', order: 1 }),
          journeyJson({ id: 'j2', order: 2 }),
        ],
      }),
    );

    const data = computeJourneyCelebration({
      journeyId: 'j1',
      wasCompletedBefore: false,
      refreshed,
      badges,
      sectorDetail: sector,
    });

    expect(data).not.toBeNull();
    expect(data!.badge.name).toBe('Consumer Rights Explorer');
    expect(data!.nextJourneyId).toBe('j2');
    expect(data!.journeyOrder).toBe(1);
  });

  it('memakai fallback badge kalau tidak ada badge untuk journey itu', () => {
    const refreshed = parseJourneyDetail(
      journeyDetailJson({ id: 'jX', progress: { status: 'completed', percent: 100 } }),
    );
    const data = computeJourneyCelebration({
      journeyId: 'jX',
      wasCompletedBefore: false,
      refreshed,
      badges,
      sectorDetail: null,
    });
    expect(data!.badge.id).toBe('');
    expect(data!.badge.earned).toBe(true);
  });
});
