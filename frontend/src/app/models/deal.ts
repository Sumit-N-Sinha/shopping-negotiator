export interface Deal {
  title: string;
  seller: string;
  price: string;
  delivery: string;
  rating: string;
  badge: string;
  image: string;
  platform: string;
  basePrice: string;
  tax: string;
  shipping: string;
  match: number;
  dropChance: number;
  dropWindow: string;
  negotiation: string;
  negotiationCode?: string;
  isFakeDiscount?: boolean;
  totalValue: number;
  valueScore: number;
}