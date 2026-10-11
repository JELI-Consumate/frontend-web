import type { ComponentType } from 'react';
import {
  AppWindow,
  Globe,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  type LucideProps,
} from 'lucide-react';
import type { ComplaintChannel, ComplaintChannelType } from '../model/complaintAgency';

export const CHANNEL_ICONS: Record<ComplaintChannelType, ComponentType<LucideProps>> = {
  website: Globe,
  whatsapp: MessageCircle,
  phone: Phone,
  email: Mail,
  app: AppWindow,
  address: MapPin,
};

const DEFAULT_BUTTON_LABELS: Record<ComplaintChannelType, string> = {
  website: 'Buka Tautan',
  whatsapp: 'Hubungi via WhatsApp',
  phone: 'Telepon Sekarang',
  email: 'Kirim Email',
  app: 'Buka Aplikasi',
  address: '',
};

export function channelButtonLabel(channel: ComplaintChannel): string {
  return channel.buttonLabel ?? DEFAULT_BUTTON_LABELS[channel.type];
}

/**
 * Membuka URL kanal (https, wa.me, tel:, mailto:) lewat anchor sementara.
 * Satu jalur untuk semua skema supaya tidak terbuka dua kali ketika
 * `window.open` dengan `noopener` mengembalikan null.
 */
export function openChannelUrl(url: string): void {
  const anchor = document.createElement('a');
  anchor.href = url;
  if (/^https?:/i.test(url)) {
    anchor.target = '_blank';
    anchor.rel = 'noopener noreferrer';
  }
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
}
