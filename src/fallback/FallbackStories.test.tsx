import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FallbackStories } from './FallbackStories';

it('opens a story, advances slides, and closes with Escape', async () => {
  const user = userEvent.setup();
  render(<FallbackStories />);
  await user.click(screen.getByRole('button', { name: /matchday/i }));
  expect(screen.getByRole('heading', { name: 'Kick-off 15:00' })).toBeInTheDocument();
  await user.click(screen.getByRole('button', { name: 'Next' }));
  expect(screen.getByRole('heading', { name: 'Team news' })).toBeInTheDocument();
  await user.keyboard('{Escape}');
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
});

it('moves to the next story after the last slide', async () => {
  const user = userEvent.setup();
  render(<FallbackStories />);
  await user.click(screen.getByRole('button', { name: /tickets/i }));
  await user.click(screen.getByRole('button', { name: 'Next' }));
  expect(screen.getByRole('heading', { name: 'U18s win 3–1' })).toBeInTheDocument();
});
