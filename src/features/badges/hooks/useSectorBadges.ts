import { useMemo } from 'react';
import { usePrimarySectorDetail } from '@/features/learning/hooks/usePrimarySectorDetail';
import { useGetBadgesQuery } from '../api/badgeApi';
import type { Badge } from '../model/badge';

interface SectorBadgesResult {
  data: Badge[] | undefined;
  isLoading: boolean;
  isError: boolean;
  refetch: () => void;
}

/**
 * Padanan `_sectorBadgesProvider` (file-private) di `badges_screen.dart` sesudah
 * refactor Phase 3: komposisi lintas fitur (`badges` + `learning`) hidup di
 * layer presentation, bukan di `badges/api`.
 *
 * Lencana milik sektor aktif saja, diurutkan mengikuti urutan journey-nya.
 */
export function useSectorBadges(): SectorBadgesResult {
  const badgesQuery = useGetBadgesQuery();
  const sector = usePrimarySectorDetail();

  const data = useMemo(() => {
    if (!badgesQuery.data || sector.data === undefined) return undefined;
    const journeys = sector.data?.journeys ?? [];
    const orderByJourneyId = new Map(journeys.map((j) => [j.id, j.order]));
    return badgesQuery.data
      .filter((badge) => orderByJourneyId.has(badge.journeyId))
      .sort(
        (a, b) => (orderByJourneyId.get(a.journeyId) ?? 0) - (orderByJourneyId.get(b.journeyId) ?? 0),
      );
  }, [badgesQuery.data, sector.data]);

  return {
    data,
    isLoading: badgesQuery.isLoading || sector.isLoading,
    isError: badgesQuery.isError || sector.isError,
    refetch: () => {
      void badgesQuery.refetch();
      sector.refetch();
    },
  };
}
