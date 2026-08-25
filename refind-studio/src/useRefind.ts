import { create } from 'zustand';

export type Moment = {
  id: string;
  title: string;
  time: string;
  context: string;
  people: number;
  duration: string;
  palette: string;
  saved: boolean;
  signalled: boolean;
  expires: string;
};

export type Nearby = { id: string; name: string; tag: string; distance: string; color: string; initials: string; trust: number; signalSent?: boolean };

const moments: Moment[] = [
  { id: 'm1', title: 'Caffè lento', time: 'Oggi · 18:42', context: 'Bar Magenta, Brera', people: 4, duration: '18 min insieme', palette: '#E5DEFF', saved: false, signalled: false, expires: 'Scade tra 22h' },
  { id: 'm2', title: 'Ritorno a casa', time: 'Oggi · 17:10', context: 'Tram 3 · Porta Genova', people: 2, duration: '11 min insieme', palette: '#D9F4EF', saved: true, signalled: false, expires: 'Scade tra 20h' },
  { id: 'm3', title: 'Un tavolo vicino', time: 'Ieri · 21:08', context: 'Bicocca Village', people: 6, duration: '46 min insieme', palette: '#FFE8CB', saved: false, signalled: true, expires: 'Scade tra 3h' },
];

const nearby: Nearby[] = [
  { id: 'n1', name: 'Marta', tag: 'Architettura', distance: '2 m', color: '#F7B7C8', initials: 'M', trust: 98 },
  { id: 'n2', name: 'Leo', tag: 'Design & musica', distance: '6 m', color: '#B9D9FF', initials: 'L', trust: 96 },
  { id: 'n3', name: 'Sara', tag: 'Startup', distance: '11 m', color: '#D9C6FF', initials: 'S', trust: 99 },
  { id: 'n4', name: 'Nico', tag: 'Cinema', distance: '16 m', color: '#BFE9D4', initials: 'N', trust: 94 },
];

type RefindState = {
  live: boolean;
  invisible: boolean;
  moments: Moment[];
  nearby: Nearby[];
  matches: number;
  setLive: (value: boolean) => void;
  setInvisible: (value: boolean) => void;
  toggleSaved: (id: string) => void;
  sendMomentSignal: (id: string) => void;
  sendLiveSignal: (id: string) => void;
};

export const useRefind = create<RefindState>((set) => ({
  live: true,
  invisible: false,
  moments,
  nearby,
  matches: 2,
  setLive: (live) => set({ live }),
  setInvisible: (invisible) => set({ invisible, live: invisible ? false : true }),
  toggleSaved: (id) => set((state) => ({ moments: state.moments.map((item) => item.id === id ? { ...item, saved: !item.saved } : item) })),
  sendMomentSignal: (id) => set((state) => ({ moments: state.moments.map((item) => item.id === id ? { ...item, signalled: true } : item) })),
  sendLiveSignal: (id) => set((state) => ({ nearby: state.nearby.map((item) => item.id === id ? { ...item, signalSent: true } : item) })),
}));
