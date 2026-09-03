import { createContext } from 'react';
import type { AppAlertOptions } from './alertTypes';

/** `showAlert` mengembalikan Promise yang selesai saat dialog ditutup — setara
 *  `Future<void>` dari `showAppAlert` di Flutter. */
export type ShowAlert = (options: AppAlertOptions) => Promise<void>;

export const AlertContext = createContext<ShowAlert | null>(null);
