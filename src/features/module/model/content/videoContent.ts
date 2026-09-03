/** Padanan `content/video_content.dart`. */
export interface VideoContent {
  readonly id: string;
  readonly title: string;
  readonly description: string | null;
  readonly youtubeUrl: string;
  readonly youtubeVideoId: string | null;
  readonly promptQuestion: string | null;
}

export function parseVideoContent(json: Record<string, unknown>): VideoContent {
  return {
    id: json['id'] as string,
    title: json['title'] as string,
    description: (json['description'] as string | undefined) ?? null,
    youtubeUrl: (json['youtube_url'] as string | undefined) ?? '',
    youtubeVideoId: (json['youtube_video_id'] as string | undefined) ?? null,
    promptQuestion: (json['prompt_question'] as string | undefined) ?? null,
  };
}
