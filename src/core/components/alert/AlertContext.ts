import { createContext } from 'react';
import type { AppAlertOptions } from './alertTypes';

export type ShowAlert = (options: AppAlertOptions) => Promise<void>;

export const AlertContext = createContext<ShowAlert | null>(null);
