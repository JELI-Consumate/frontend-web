import { useContext } from 'react';
import { AlertContext, type ShowAlert } from './AlertContext';

/** Panggil `showAlert({...})` dari mana pun di bawah `<AlertProvider>`. */
export function useAlert(): ShowAlert {
  const ctx = useContext(AlertContext);
  if (!ctx) throw new Error('useAlert dipakai di luar <AlertProvider>');
  return ctx;
}
