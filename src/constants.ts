import { Instructor, NewsItem } from './types';

export const LOGO_URL = 'https://i.imgur.com/8Yv9p8R.png';

export const INSTRUCTORS: Instructor[] = [
  {
    id: 'inst-4',
    name: 'Małgorzata Kielek',
    specialization: 'Trener II',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Malgorzata',
    workingDays: [1, 3, 5, 6, 0], // Mon, Wed, Fri, Sat, Sun
  },
  {
    id: 'inst-5',
    name: 'Ewa Plucińska-Kowacka',
    specialization: 'Instruktor Sportu',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ewa',
    workingDays: [2, 4, 6, 0], // Tue, Thu, Sat, Sun
    flexibleDays: [1, 3, 5], // Mon, Wed, Fri
  },
  {
    id: 'inst-6',
    name: 'Wiktoria Andrzejewska',
    specialization: 'Instruktor PZJ zawodnik',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Wiktoria',
    workingDays: [1, 2, 3, 6, 0], // Mon, Tue, Wed, Sat, Sun
    flexibleDays: [4, 5], // Thu, Fri
  },
];

export const INITIAL_NEWS: NewsItem[] = [
  {
    id: 'news-1',
    title: 'Wiosenne Zawody w Skokach',
    content: 'Zapraszamy wszystkich członków klubu na doroczne zawody wiosenne. Zapisy w biurze do końca tygodnia!',
    date: '2024-05-15',
    image: 'https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?auto=format&fit=crop&q=80&w=800',
    category: 'event',
  },
  {
    id: 'news-2',
    title: 'Egzamin na Odznakę "Jeżdżę Konno"',
    content: 'Kolejny termin egzaminu wyznaczony na 20 czerwca. Prosimy o zgłaszanie się do instruktorów prowadzących.',
    date: '2024-06-20',
    image: 'https://images.unsplash.com/photo-1598974357801-cbca100e65d3?auto=format&fit=crop&q=80&w=800',
    category: 'badge',
  },
  {
    id: 'news-3',
    title: 'Nowy koń w stajni - Wiki',
    content: 'Do naszego stada dołączyła wspaniała klacz Wiki. Jest idealna dla początkujących jeźdźców.',
    date: '2024-04-10',
    image: 'https://images.unsplash.com/photo-1534073133331-c4b6269d5d01?auto=format&fit=crop&q=80&w=800',
    category: 'news',
  },
];
