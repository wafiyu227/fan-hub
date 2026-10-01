export interface DemoStory { id: string; title: string; slides: { headline: string; body: string }[] }

export const demoStories: DemoStory[] = [
  { id: 'matchday', title: 'Matchday', slides: [
    { headline: 'Kick-off 15:00', body: 'Gates open at 13:30. Programme sellers are by the north stand.' },
    { headline: 'Team news', body: 'Two changes in midfield after the midweek win.' },
  ] },
  { id: 'tickets', title: 'Tickets', slides: [
    { headline: 'Season passes', body: 'Renewals close Friday. Pay in three instalments.' },
  ] },
  { id: 'academy', title: 'Academy', slides: [
    { headline: 'U18s win 3–1', body: 'A late double sealed it on Saturday morning.' },
    { headline: 'Trials in May', body: 'Register by the end of April.' },
    { headline: 'Meet the coaches', body: 'Five coaches, one philosophy: play forward.' },
  ] },
];
