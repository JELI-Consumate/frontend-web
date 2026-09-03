import { useState } from 'react';
import { isApiError } from '@/api/apiError';
import { useAlert } from '@/core/components/alert/useAlert';
import { useCompleteModulePageMutation } from '../api/moduleApi';
import type { ModulePageNav } from '../components/modulePageNav';

/**
 * Padanan mixin `ModulePageAdvance` di frontend-android: "tandai halaman selesai
 * lalu lanjut", dipakai layar modul artikel & video.
 */
export function useModulePageAdvance() {
  const showAlert = useAlert();
  const [completeModulePage] = useCompleteModulePageMutation();
  const [isAdvancing, setIsAdvancing] = useState(false);

  async function completeAndAdvance(params: {
    pageId: string;
    alreadyComplete: boolean;
    nav: ModulePageNav;
    onCompleted?: () => void;
  }): Promise<void> {
    const { pageId, alreadyComplete, nav, onCompleted } = params;
    if (!alreadyComplete) {
      setIsAdvancing(true);
      try {
        await completeModulePage(pageId).unwrap();
      } catch (error) {
        if (isApiError(error)) {
          void showAlert({
            type: 'error',
            title: 'Gagal Menandai Selesai',
            message: error.message,
          });
        }
        setIsAdvancing(false);
        return;
      }
      setIsAdvancing(false);
      onCompleted?.();
    }
    nav.onAdvance();
  }

  return { isAdvancing, completeAndAdvance };
}
