import { useMemo } from 'react';
import { useAppSelector } from '@/app/hooks';
import { skipToken } from '@reduxjs/toolkit/query';
import { useGetSectorsQuery, useGetSectorDetailQuery } from '../api/learningApi';
import type { SectorDetail } from '../model/sectorDetail';

interface PrimarySectorDetailResult {
  data: SectorDetail | null | undefined;
  isLoading: boolean;
  isError: boolean;
  refetch: () => void;
}

/**
 * Padanan `primarySectorDetailProvider`:
 * - ada `activeSectorSlug` -> muat detail sektor itu.
 * - tidak ada -> muat daftar sektor lalu detail sektor pertama.
 *   `null` kalau daftar sektor kosong.
 */
export function usePrimarySectorDetail(): PrimarySectorDetailResult {
  const activeSlug = useAppSelector((s) => s.activeSector.slug);

  const sectorsQuery = useGetSectorsQuery(undefined, { skip: activeSlug != null });

  const fallbackSlug = activeSlug == null ? sectorsQuery.data?.[0]?.slug : undefined;
  const effectiveSlug = activeSlug ?? fallbackSlug;

  const detailQuery = useGetSectorDetailQuery(effectiveSlug ?? skipToken);

  return useMemo(() => {
    // Mode fallback: daftar sektor sudah termuat tapi kosong -> null.
    if (activeSlug == null && sectorsQuery.isSuccess && (sectorsQuery.data?.length ?? 0) === 0) {
      return { data: null, isLoading: false, isError: false, refetch: () => void sectorsQuery.refetch() };
    }

    return {
      data: detailQuery.data,
      isLoading:
        (activeSlug == null && sectorsQuery.isLoading) ||
        detailQuery.isLoading ||
        (effectiveSlug != null && detailQuery.isUninitialized),
      isError: sectorsQuery.isError || detailQuery.isError,
      refetch: () => {
        if (activeSlug == null) void sectorsQuery.refetch();
        if (effectiveSlug != null) void detailQuery.refetch();
      },
    };
  }, [activeSlug, effectiveSlug, sectorsQuery, detailQuery]);
}
