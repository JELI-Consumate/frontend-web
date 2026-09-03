/** Padanan `content/article_content.dart`. */
export type ArticleBlockType = 'paragraph' | 'image' | 'list_item' | 'reference' | 'unknown';

export function parseArticleBlockType(value: unknown): ArticleBlockType {
  switch (value) {
    case 'paragraph':
    case 'image':
    case 'reference':
      return value;
    case 'list_item':
      return 'list_item';
    default:
      return 'unknown';
  }
}

export interface ArticleBlock {
  readonly id: string;
  readonly blockType: ArticleBlockType;
  readonly text: string | null;
  readonly imageUrl: string | null;
  readonly altText: string | null;
  readonly order: number;
}

export interface ArticleContent {
  readonly id: string;
  readonly title: string;
  readonly blocks: ArticleBlock[];
}

function int(value: unknown): number {
  return typeof value === 'number' ? Math.trunc(value) : 0;
}

export function parseArticleBlock(json: Record<string, unknown>): ArticleBlock {
  return {
    id: json['id'] as string,
    blockType: parseArticleBlockType(json['block_type']),
    text: (json['text_article'] as string | undefined) ?? null,
    imageUrl: (json['image_url'] as string | undefined) ?? null,
    altText: (json['alt_text'] as string | undefined) ?? null,
    order: int(json['order']),
  };
}

export function parseArticleContent(json: Record<string, unknown>): ArticleContent {
  const rawBlocks = json['blocks'];
  return {
    id: json['id'] as string,
    title: json['title'] as string,
    blocks: Array.isArray(rawBlocks)
      ? (rawBlocks as Record<string, unknown>[]).map(parseArticleBlock)
      : [],
  };
}
