import { useMemo, useState, type ReactNode } from 'react';
import { ModuleHeader } from '../components/ModuleHeader';
import { ModulePageScaffold } from '../components/ModulePageScaffold';
import { ModuleContinueButton } from '../components/moduleChrome';
import { ZoomableImage } from '../components/ZoomableImage';
import { useModulePageAdvance } from '../hooks/useModulePageAdvance';
import type { ArticleBlock } from '../model/content/articleContent';
import type { ModuleDetail } from '../model/moduleDetail';
import type { ModulePage } from '../model/modulePage';
import type { ModulePageNav } from '../components/modulePageNav';

interface Props {
  module: ModuleDetail;
  page: ModulePage;
  nav: ModulePageNav;
}

/** Padanan `article_module_screen.dart`. */
export function ArticleModuleScreen({ module, page, nav }: Props) {
  const content = page.content.kind === 'article' ? page.content.content : null;

  const { isAdvancing, completeAndAdvance } = useModulePageAdvance();
  const [completed, setCompleted] = useState(page.status === 'completed');

  const { blocks, listItemNumbers } = useMemo(() => {
    const sorted = [...(content?.blocks ?? [])].sort((a, b) => a.order - b.order);
    const numbers = new Map<string, number>();
    let counter = 0;
    for (const block of sorted) {
      if (block.blockType === 'list_item') {
        counter += 1;
        numbers.set(block.id, counter);
      }
    }
    return { blocks: sorted, listItemNumbers: numbers };
  }, [content?.blocks]);

  if (!content) return null;

  const rendered: ReactNode[] = [];
  let referenceHeadingShown = false;
  for (const block of blocks) {
    const isReference = block.blockType === 'reference';
    if (isReference && !referenceHeadingShown) {
      referenceHeadingShown = true;
      rendered.push(
        <h2 key={`${block.id}-refhead`} className="text-title-sm text-ink">
          Referensi
        </h2>,
        <div key={`${block.id}-refgap`} className="h-xs" />,
      );
    }
    rendered.push(
      <ArticleBlockView key={block.id} block={block} listItemNumber={listItemNumbers.get(block.id)} />,
      <div key={`${block.id}-gap`} className={isReference ? 'h-sm' : 'h-md'} />,
    );
  }

  return (
    <ModulePageScaffold
      nav={nav}
      body={
        <div className="p-screen">
          <ModuleHeader module={module} />
          <div className="h-lg" />
          {rendered}
        </div>
      }
      footer={
        <ModuleContinueButton
          hasNext={nav.hasNext}
          busy={isAdvancing}
          onPressed={() =>
            void completeAndAdvance({
              pageId: page.id,
              alreadyComplete: completed,
              nav,
              onCompleted: () => setCompleted(true),
            })
          }
        />
      }
    />
  );
}

function ArticleBlockView({
  block,
  listItemNumber,
}: {
  block: ArticleBlock;
  listItemNumber?: number;
}) {
  switch (block.blockType) {
    case 'paragraph':
      return <p className="text-justify text-body-lg text-ink">{block.text ?? ''}</p>;
    case 'image':
      return block.imageUrl ? (
        <div className="flex flex-col items-stretch">
          <ZoomableImage url={block.imageUrl} />
          {block.altText ? (
            <p className="mt-xxs text-center text-body-sm text-ink-muted">{block.altText}</p>
          ) : null}
        </div>
      ) : null;
    case 'list_item':
      return (
        <div className="flex items-center gap-sm rounded-md border border-border bg-white p-sm">
          <span className="flex h-28 w-28 shrink-0 items-center justify-center rounded-full bg-primary text-label-md font-bold text-white">
            {listItemNumber ?? 1}
          </span>
          <p className="flex-1 text-justify text-body-lg text-ink">{block.text ?? ''}</p>
        </div>
      );
    case 'reference':
      return <p className="text-body-sm text-ink-muted">{block.text ?? ''}</p>;
    case 'unknown':
      return null;
  }
}
