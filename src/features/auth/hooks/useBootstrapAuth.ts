import { useEffect, useRef } from 'react';
import { useAppDispatch } from '@/app/hooks';
import { tokenStorage } from '@/core/storage/tokenStorage';
import { useGetMeQuery } from '../api/authApi';
import { markBootstrapped, setUser } from '../state/authSlice';

/**
 * Setara `AuthController.build()`:
 * - tanpa token -> langsung "bootstrapped", user null.
 * - ada token   -> panggil `/auth/me`. Sukses -> set user. 401 -> interceptor
 *   sudah membuang token & men-dispatch signedOut; error apa pun -> tetap
 *   tandai bootstrapped supaya AppRoot lanjut ke alur login.
 */
export function useBootstrapAuth(): void {
  const dispatch = useAppDispatch();
  const hasTokenRef = useRef<boolean>(tokenStorage.read() !== null);
  const hasToken = hasTokenRef.current;

  const { data, isSuccess, isError } = useGetMeQuery(undefined, { skip: !hasToken });

  useEffect(() => {
    if (!hasToken) {
      dispatch(markBootstrapped());
      return;
    }
    if (isSuccess && data) {
      dispatch(setUser(data));
      dispatch(markBootstrapped());
    } else if (isError) {
      dispatch(markBootstrapped());
    }
  }, [hasToken, isSuccess, isError, data, dispatch]);
}
