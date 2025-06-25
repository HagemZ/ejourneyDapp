import { Journey, User } from '../types';

export const mockUsers: User[] = [
  {
    id: '1',
    name: 'Alex Chen',
    email: 'alex@example.com',
    avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    id: '2',
    name: 'Maria Rodriguez',
    email: 'maria@example.com',
    avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400'
  }
];

export const mockJourneys: Journey[] = [
  {
    id: '1',
    userId: '1',
    title: 'Amazing Tokyo Adventure',
    description: 'Spent 5 incredible days exploring Tokyo. The cherry blossoms were in full bloom, and the food scene was absolutely mind-blowing. From traditional sushi at Tsukiji to modern ramen joints in Shibuya.',
    location: {
      name: 'Tokyo, Japan',
      coordinates: [139.6917, 35.6895],
      country: 'Japan',
      city: 'Tokyo'
    },
    images: [
      'https://images.pexels.com/photos/2070485/pexels-photo-2070485.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/2070033/pexels-photo-2070033.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    rating: 5,
    tags: ['culture', 'food', 'city', 'cherry-blossoms'],
    createdAt: new Date('2024-03-15'),
    verifiedLocation: true
  },
  {
    id: '2',
    userId: '2',
    title: 'Breathtaking Iceland Road Trip',
    description: 'Drove the Ring Road for 10 days. Witnessed the Northern Lights, explored ice caves, and soaked in geothermal hot springs. Iceland\'s raw natural beauty is unmatched.',
    location: {
      name: 'Reykjavik, Iceland',
      coordinates: [-21.8174, 64.1466],
      country: 'Iceland',
      city: 'Reykjavik'
    },
    images: [
      'https://images.pexels.com/photos/1433052/pexels-photo-1433052.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/2613260/pexels-photo-2613260.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    rating: 5,
    tags: ['nature', 'adventure', 'northern-lights', 'hot-springs'],
    createdAt: new Date('2024-02-20'),
    verifiedLocation: true
  },
  {
    id: '3',
    userId: '1',
    title: 'Parisian Romance',
    description: 'A magical week in the City of Light. Climbed the Eiffel Tower at sunset, strolled along the Seine, and discovered hidden cafés in Montmartre. Pure romance!',
    location: {
      name: 'Paris, France',
      coordinates: [2.3522, 48.8566],
      country: 'France',
      city: 'Paris'
    },
    images: [
      'https://images.pexels.com/photos/2467558/pexels-photo-2467558.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    rating: 4,
    tags: ['romance', 'culture', 'architecture', 'cafés'],
    createdAt: new Date('2024-01-10'),
    verifiedLocation: true
  }
];

export const locationSuggestions = [
  { name: 'Tokyo, Japan', coordinates: [139.6917, 35.6895], country: 'Japan', city: 'Tokyo' },
  { name: 'Paris, France', coordinates: [2.3522, 48.8566], country: 'France', city: 'Paris' },
  { name: 'New York, USA', coordinates: [-74.0059, 40.7128], country: 'USA', city: 'New York' },
  { name: 'London, UK', coordinates: [-0.1276, 51.5074], country: 'UK', city: 'London' },
  { name: 'Sydney, Australia', coordinates: [151.2093, -33.8688], country: 'Australia', city: 'Sydney' },
  { name: 'Reykjavik, Iceland', coordinates: [-21.8174, 64.1466], country: 'Iceland', city: 'Reykjavik' },
];