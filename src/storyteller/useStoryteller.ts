import { useEffect, useState } from 'react';

export type SdkModule = typeof import('@getstoryteller/storyteller-sdk-javascript');
export type FallbackReason = 'no-api-key' | 'init-failed' | 'init-timeout';
export type StorytellerState =
  | { status: 'loading' }
  | { status: 'ready'; sdk: SdkModule }
  | { status: 'fallback'; reason: FallbackReason };

/** Loads and initialises the Storyteller Web SDK; falls back instead of throwing. */
export function useStoryteller(
  apiKey: string | undefined = import.meta.env.VITE_STORYTELLER_API_KEY,
  timeoutMs = 8000,
): StorytellerState {
  const [state, setState] = useState<StorytellerState>(
    apiKey ? { status: 'loading' } : { status: 'fallback', reason: 'no-api-key' },
  );

  useEffect(() => {
    if (!apiKey) return;
    let cancelled = false;
    const done = (next: StorytellerState) => !cancelled && setState(next);

    const timer = new Promise<'timeout'>((r) => setTimeout(() => r('timeout'), timeoutMs));
    (async () => {
      try {
        const sdk = await import('@getstoryteller/storyteller-sdk-javascript');
        await import('@getstoryteller/storyteller-sdk-javascript/dist/storyteller.min.css');
        const result = await Promise.race([sdk.sharedInstance.initialize(apiKey), timer]);
        done(result === 'timeout' ? { status: 'fallback', reason: 'init-timeout' } : { status: 'ready', sdk });
      } catch {
        done({ status: 'fallback', reason: 'init-failed' });
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [apiKey, timeoutMs]);

  return state;
}
