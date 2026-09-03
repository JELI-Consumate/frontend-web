/** Padanan `content/simulation_content.dart`. */
export type SimulationGameType = 'matching' | 'ordering' | 'unknown';

export function parseSimulationGameType(value: unknown): SimulationGameType {
  return value === 'matching' || value === 'ordering' ? value : 'unknown';
}

function int(value: unknown): number {
  return typeof value === 'number' ? Math.trunc(value) : 0;
}

export interface SimulationMatchingPair {
  readonly id: string;
  readonly leftLabel: string;
  readonly leftDescription: string | null;
  readonly leftImageUrl: string | null;
  readonly rightLabel: string;
  readonly rightDescription: string | null;
  readonly rightImageUrl: string | null;
  readonly order: number;
}

export interface SimulationOrderingStep {
  readonly id: string;
  readonly label: string;
  readonly imageUrl: string | null;
  readonly order: number;
}

export interface SimulationContent {
  readonly id: string;
  readonly title: string;
  readonly simulationType: SimulationGameType;
  readonly scenario: string;
  readonly matchingPairs: SimulationMatchingPair[];
  readonly orderingSteps: SimulationOrderingStep[];
}

function parsePair(json: Record<string, unknown>): SimulationMatchingPair {
  return {
    id: json['id'] as string,
    leftLabel: json['left_label'] as string,
    leftDescription: (json['left_description'] as string | undefined) ?? null,
    leftImageUrl: (json['left_image_url'] as string | undefined) ?? null,
    rightLabel: json['right_label'] as string,
    rightDescription: (json['right_description'] as string | undefined) ?? null,
    rightImageUrl: (json['right_image_url'] as string | undefined) ?? null,
    order: int(json['order']),
  };
}

function parseStep(json: Record<string, unknown>): SimulationOrderingStep {
  return {
    id: json['id'] as string,
    label: json['label'] as string,
    imageUrl: (json['image_url'] as string | undefined) ?? null,
    order: int(json['order']),
  };
}

export function parseSimulationContent(json: Record<string, unknown>): SimulationContent {
  const rawPairs = json['matching_pairs'];
  const rawSteps = json['ordering_steps'];
  return {
    id: json['id'] as string,
    title: json['title'] as string,
    simulationType: parseSimulationGameType(json['simulation_type']),
    scenario: (json['scenario'] as string | undefined) ?? '',
    matchingPairs: Array.isArray(rawPairs)
      ? (rawPairs as Record<string, unknown>[]).map(parsePair)
      : [],
    orderingSteps: Array.isArray(rawSteps)
      ? (rawSteps as Record<string, unknown>[]).map(parseStep)
      : [],
  };
}
