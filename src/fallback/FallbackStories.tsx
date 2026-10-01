import { useEffect, useState } from 'react';
import { demoStories, type DemoStory } from './stories';

/** Local 9:16 Stories viewer used when the Storyteller SDK is unavailable. */
export function FallbackStories({ stories = demoStories }: { stories?: DemoStory[] }) {
  const [open, setOpen] = useState<{ story: number; slide: number } | null>(null);
  const close = () => setOpen(null);

  const step = (dir: 1 | -1) =>
    setOpen((cur) => {
      if (!cur) return cur;
      const slide = cur.slide + dir;
      if (slide >= stories[cur.story].slides.length) return cur.story + 1 < stories.length ? { story: cur.story + 1, slide: 0 } : null;
      if (slide < 0) return cur.story > 0 ? { story: cur.story - 1, slide: 0 } : cur;
      return { ...cur, slide };
    });

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowRight') step(1);
      if (e.key === 'ArrowLeft') step(-1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  const current = open && stories[open.story];
  return (
    <>
      <ul className="story-row" aria-label="Stories">
        {stories.map((s, i) => (
          <li key={s.id}>
            <button className="story-tile" onClick={() => setOpen({ story: i, slide: 0 })}>
              <span className="story-ring">{s.title[0]}</span>
              {s.title}
            </button>
          </li>
        ))}
      </ul>
      {open && current && (
        <div className="story-viewer" role="dialog" aria-modal="true" aria-label={current.title}>
          <div className="story-progress">
            {current.slides.map((_, i) => <i key={i} data-done={i <= open.slide} />)}
          </div>
          <h2>{current.slides[open.slide].headline}</h2>
          <p>{current.slides[open.slide].body}</p>
          <button className="story-prev" aria-label="Previous" onClick={() => step(-1)} />
          <button className="story-next" aria-label="Next" onClick={() => step(1)} />
          <button className="story-close" onClick={close}>Close</button>
        </div>
      )}
    </>
  );
}
