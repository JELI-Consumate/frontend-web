import { PrimaryButton } from '@/core/components/PrimaryButton';
import { CHANNEL_ICONS, channelButtonLabel, openChannelUrl } from '../lib/channel';
import type { ComplaintChannel } from '../model/complaintAgency';

export function ChannelCard({ channel }: { channel: ComplaintChannel }) {
  const Icon = CHANNEL_ICONS[channel.type];
  const url = channel.url;

  return (
    <div className="rounded-lg border border-border bg-white p-md">
      <div className="flex items-start gap-sm">
        <span className="flex h-44 w-44 shrink-0 items-center justify-center rounded-full bg-primary-soft">
          <Icon size={20} className="text-primary" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-label-sm uppercase text-ink-muted">{channel.label}</p>
          <p className="mt-xxs break-words text-title-sm text-ink">{channel.value}</p>
        </div>
      </div>
      {url ? (
        <div className="mt-sm">
          <PrimaryButton
            label={channelButtonLabel(channel)}
            trailingIcon={Icon}
            onPressed={() => openChannelUrl(url)}
          />
        </div>
      ) : null}
    </div>
  );
}
