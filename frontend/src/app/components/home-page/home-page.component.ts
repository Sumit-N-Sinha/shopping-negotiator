import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchService } from '../../services/search.service';
import { Deal } from '../../models/deal';
import { DealCardComponent } from '../deal-card/deal-card.component';
import { DealSortBarComponent } from '../deal-sort-bar/deal-sort-bar.component';
import { SearchComposerComponent } from '../search-composer/search-composer.component';
import { SiteHeaderComponent } from '../site-header/site-header.component';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [CommonModule, SiteHeaderComponent, SearchComposerComponent, DealSortBarComponent, DealCardComponent],
  providers: [SearchService],
  templateUrl: './home-page.component.html',
})
export class HomePageComponent implements OnInit {
  constructor(private readonly searchService: SearchService) {}

  ngOnInit(): void {
    this.search();
  }

  query = '';
  selectedCategory = 'electronics';
  sortOptions = [
    'Lowest Total Cost',
    'Best Value',
    'Price Drop Probability',
    'Personal Match Score',
    'Real Discount Detection',
    'Negotiation Potential'
  ];
  activeSort = this.sortOptions[0];
  deals: Deal[] = [
    {
      title: 'Sony WH-1000XM5 Wireless Noise Cancelling Headphones',
      seller: 'Sony India (Official)',
      platform: 'Amazon',
      price: '₹29,488',
      basePrice: '₹24,990',
      tax: '₹4,498',
      shipping: 'Free',
      delivery: 'Free delivery',
      rating: '4.6 (8,214)',
      badge: '✓ Real Discount · 16% off MRP',
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=480&q=85',
      match: 94,
      dropChance: 85,
      dropWindow: '7d',
      negotiation: 'High Negotiation',
      negotiationCode: 'SONY10',
      totalValue: 29488,
      valueScore: 94
    },
    {
      title: 'Apple iPhone 15 Pro 256GB Natural Titanium',
      seller: 'RetailNet (4.2★)',
      platform: 'Flipkart',
      price: '₹141,482',
      basePrice: '₹119,900',
      tax: '₹21,582',
      shipping: 'Free',
      delivery: 'Free delivery',
      rating: '4.4 (3,591)',
      badge: '⚠ Fake Markdown · MRP inflated by ~5%',
      image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=480&q=85',
      match: 78,
      dropChance: 42,
      dropWindow: '14d',
      negotiation: 'Low Negotiation',
      isFakeDiscount: true,
      totalValue: 141482,
      valueScore: 78
    },
    {
      title: "Nike Air Max 270 React Men's Running Shoes",
      seller: 'Nike Official Store',
      platform: 'Myntra',
      price: '₹10,813',
      basePrice: '₹8,995',
      tax: '₹1,619',
      shipping: '+ ₹199',
      delivery: 'Standard delivery',
      rating: '4.3 (1,842)',
      badge: '✓ Real Discount · 17% off MRP',
      image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=480&q=85',
      match: 88,
      dropChance: 61,
      dropWindow: '5d',
      negotiation: 'Medium Negotiation',
      negotiationCode: 'SAVE15',
      totalValue: 10813,
      valueScore: 88
    }
  ];

  get sortedDeals(): Deal[] {
    const sortKeys: Record<string, keyof Deal> = {
      'Lowest Total Cost': 'totalValue',
      'Best Value': 'valueScore',
      'Price Drop Probability': 'dropChance',
      'Personal Match Score': 'match',
      'Real Discount Detection': 'isFakeDiscount',
      'Negotiation Potential': 'valueScore'
    };
    const key = sortKeys[this.activeSort];
    return [...this.deals].sort((a, b) => {
      const left = a[key];
      const right = b[key];
      if (typeof left === 'number' && typeof right === 'number') {
        return this.activeSort === 'Lowest Total Cost' ? left - right : right - left;
      }
      if (typeof left === 'boolean' && typeof right === 'boolean') return Number(left) - Number(right);
      return 0;
    });
  }

  async search(request: { query: string; image?: string } = { query: '' }): Promise<void> {
    const result = await this.searchService.search({
      query: request.query || (request.image ? '' : 'laptop'),
      mode: request.image ? 'image' : 'text',
      category: this.selectedCategory,
      image: request.image
    });

    this.deals = result.deals ?? this.deals;
  }

  setSort(option: string): void {
    this.activeSort = option;
  }
}
