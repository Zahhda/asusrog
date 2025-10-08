import type { Product } from '../components/ProductCard';
import g14 from '../../g14 strix.jpg';
import strixG15 from '../../strix g15.jpg';
import heroG16 from '../../strix g16.jpg';

export const products: Product[] = [
  {
    id: 'g14-2024',
    name: 'ROG Zephyrus G14 (2024)',
    price: 1999,
    image: g14,
    cpu: 'Ryzen 9',
    gpu: 'RTX 4070'
  },
  {
    id: 'scar-16',
    name: 'ROG Strix Scar 16',
    price: 2799,
    image: '/models/ROG-Strix-Scar-16.svg',
    cpu: 'Core i9',
    gpu: 'RTX 4080'
  },
  {
    id: 'flow-x13',
    name: 'ROG Flow X13',
    price: 1499,
    image: '/models/ROG-Flow-X13.svg',
    cpu: 'Ryzen 9',
    gpu: 'RTX 4050'
  },
  {
    id: 'strix-g15',
    name: 'ROG Strix G15',
    price: 1599,
    image: strixG15,
    cpu: 'Ryzen 7',
    gpu: 'RTX 4060'
  },
  {
    id: 'tuf-a15',
    name: 'TUF Gaming A15',
    price: 1199,
    image: '/models/TUF-Gaming-A15.svg',
    cpu: 'Ryzen 7',
    gpu: 'RTX 4050'
  },
  {
    id: 'tuf-f15',
    name: 'TUF Gaming F15',
    price: 1099,
    image: '/models/TUF-Gaming-F15.svg',
    cpu: 'Core i7',
    gpu: 'RTX 3050Ti'
  },
  {
    id: 'strix-g17',
    name: 'ROG Strix G17',
    price: 1799,
    image: '/models/ROG-Strix-G17.svg',
    cpu: 'Ryzen 9',
    gpu: 'RTX 4070'
  },
  {
    id: 'g16-2024',
    name: 'ROG Zephyrus G16 (2024)',
    price: 2399,
    image: '/models/ROG-Zephyrus-G16-2024.svg',
    cpu: 'Core Ultra 9',
    gpu: 'RTX 4080'
  },
  {
    id: 'ally',
    name: 'ROG Ally (handheld)',
    price: 699,
    image: '/models/ROG-Ally.svg',
    cpu: 'Ryzen Z1 Extreme',
    gpu: 'RDNA 3'
  },
  {
    id: 'duo-16',
    name: 'ROG Zephyrus Duo 16',
    price: 3299,
    image: '/models/ROG-Zephyrus-Duo-16.svg',
    cpu: 'Ryzen 9',
    gpu: 'RTX 4090'
  }
];


