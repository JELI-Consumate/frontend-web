import { useEffect, useRef } from 'react';
import { useAppDispatch } from '@/app/hooks';
import { tokenStorage } from '@/core/storage/tokenStorage';
import { useGetMeQuery } from '../api/authApi';
import { markBootstrapped, setUser } from '../state/authSlice';

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
