import { renderHook, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import { useStoryteller } from './useStoryteller';

const initialize = vi.fn();
vi.mock('@getstoryteller/storyteller-sdk-javascript', () => ({ sharedInstance: { initialize: (k: string) => initialize(k) } }));
vi.mock('@getstoryteller/storyteller-sdk-javascript/dist/storyteller.min.css', () => ({}));

beforeEach(() => {
  initialize.mockReset();
});

it('falls back immediately without an API key', () => {
  const { result } = renderHook(() => useStoryteller(''));
  expect(result.current).toEqual({ status: 'fallback', reason: 'no-api-key' });
  expect(initialize).not.toHaveBeenCalled();
});

it('becomes ready when the SDK initialises', async () => {
  initialize.mockResolvedValue(undefined);
  const { result } = renderHook(() => useStoryteller('key'));
  await waitFor(() => expect(result.current.status).toBe('ready'));
  expect(initialize).toHaveBeenCalledWith('key');
});

it('falls back when initialisation rejects', async () => {
  initialize.mockRejectedValue(new Error('bad key'));
  const { result } = renderHook(() => useStoryteller('key'));
  await waitFor(() => expect(result.current).toEqual({ status: 'fallback', reason: 'init-failed' }));
});

it('falls back when initialisation hangs', async () => {
  initialize.mockReturnValue(new Promise(() => {}));
  const { result } = renderHook(() => useStoryteller('key', 20));
  await waitFor(() => expect(result.current).toEqual({ status: 'fallback', reason: 'init-timeout' }));
});
