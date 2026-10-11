export type ComplaintChannelType = 'website' | 'whatsapp' | 'phone' | 'email' | 'app' | 'address';

const CHANNEL_TYPES: readonly ComplaintChannelType[] = [
  'website',
  'whatsapp',
  'phone',
  'email',
  'app',
  'address',
];

export interface ComplaintAgency {
  readonly id: string;
  readonly slug: string;
  readonly shortName: string;
  readonly fullName: string;
  readonly summary: string;
  readonly logoUrl: string | null;
  readonly order: number;
}

export interface ComplaintChannel {
  readonly type: ComplaintChannelType;
  readonly label: string;
  readonly value: string;
  /** URL siap-buka (https, tel:, mailto:, wa.me). null = kanal hanya informasi. */
  readonly url: string | null;
  readonly buttonLabel: string | null;
}

export interface ComplaintAgencyDetail extends ComplaintAgency {
  readonly description: string;
  readonly whenToContact: readonly string[];
  readonly howToAccess: string | null;
  readonly notes: string | null;
  readonly channels: readonly ComplaintChannel[];
}

export interface ComplaintCategoryAgency {
  readonly slug: string;
  readonly shortName: string;
}

export interface ComplaintCategory {
  readonly id: string;
  readonly problem: string;
  readonly agencies: readonly ComplaintCategoryAgency[];
}

function optionalString(value: unknown): string | null {
  return typeof value === 'string' && value.trim().length > 0 ? value : null;
}

function parseChannelType(value: unknown): ComplaintChannelType {
  return CHANNEL_TYPES.includes(value as ComplaintChannelType)
    ? (value as ComplaintChannelType)
    : 'website';
}

export function parseComplaintAgency(json: Record<string, unknown>): ComplaintAgency {
  return {
    id: String(json['id']),
    slug: json['slug'] as string,
    shortName: json['short_name'] as string,
    fullName: (json['full_name'] as string | undefined) ?? '',
    summary: (json['summary'] as string | undefined) ?? '',
    logoUrl: optionalString(json['logo_url']),
    order: (json['order'] as number | undefined) ?? 0,
  };
}

export function parseComplaintChannel(json: Record<string, unknown>): ComplaintChannel {
  return {
    type: parseChannelType(json['type']),
    label: (json['label'] as string | undefined) ?? '',
    value: (json['value'] as string | undefined) ?? '',
    url: optionalString(json['url']),
    buttonLabel: optionalString(json['button_label']),
  };
}

export function parseComplaintAgencyDetail(json: Record<string, unknown>): ComplaintAgencyDetail {
  const whenToContact = Array.isArray(json['when_to_contact'])
    ? (json['when_to_contact'] as unknown[]).filter((v): v is string => typeof v === 'string')
    : [];
  const channels = Array.isArray(json['channels'])
    ? (json['channels'] as Record<string, unknown>[]).map(parseComplaintChannel)
    : [];

  return {
    ...parseComplaintAgency(json),
    description: (json['description'] as string | undefined) ?? '',
    whenToContact,
    howToAccess: optionalString(json['how_to_access']),
    notes: optionalString(json['notes']),
    channels,
  };
}

export function parseComplaintCategory(json: Record<string, unknown>): ComplaintCategory {
  const agencies = Array.isArray(json['agencies'])
    ? (json['agencies'] as Record<string, unknown>[]).map((a) => ({
        slug: a['slug'] as string,
        shortName: a['short_name'] as string,
      }))
    : [];

  return {
    id: String(json['id']),
    problem: json['problem'] as string,
    agencies,
  };
}
