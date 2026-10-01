import { useEffect, useId } from 'react';
import { FallbackStories } from '../fallback/FallbackStories';
import { useStoryteller, type SdkModule } from './useStoryteller';

const categories = (import.meta.env.VITE_STORYTELLER_CATEGORIES ?? '').split(',').filter(Boolean);

function SdkRow({ sdk }: { sdk: SdkModule }) {
  const id = `storyteller-row-${useId().replace(/:/g, '')}`;
  useEffect(() => {
    const row = new sdk.StorytellerStoriesRowView(id, categories);
    row.configuration = { categories, cellType: sdk.CellType.round };
    return () => row.destroy();
  }, [sdk, id]);
  return <div id={id} data-testid="sdk-row" />;
}

export function StoriesRow() {
  const state = useStoryteller();
  if (state.status === 'loading') return <p role="status">Loading stories…</p>;
  if (state.status === 'ready') return <SdkRow sdk={state.sdk} />;
  return <FallbackStories />;
}
