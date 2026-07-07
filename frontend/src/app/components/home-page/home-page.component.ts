import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SearchService } from '../../services/search.service';

interface Deal {
  title: string;
  seller: string;
  price: string;
  delivery: string;
  rating: string;
  badge: string;
}

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  providers: [SearchService],
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent implements OnInit {
  constructor(private readonly searchService: SearchService) {}

  ngOnInit(): void {
    this.search();
  }

  query = '';
  selectedMode = 'text';
  selectedCategory = 'electronics';
  deals: Deal[] = [
    {
      title: 'UltraBook Pro 14',
      seller: 'TechNova',
      price: '$1,149',
      delivery: 'Free 2-day shipping',
      rating: '4.8/5',
      badge: 'Best overall'
    },
    {
      title: 'GalaxyTab Air',
      seller: 'BrightCart',
      price: '$879',
      delivery: '1-day delivery',
      rating: '4.6/5',
      badge: 'Fastest delivery'
    },
    {
      title: 'SmartWatch X3',
      seller: 'PricePilot',
      price: '$219',
      delivery: 'Standard shipping',
      rating: '4.7/5',
      badge: 'Lowest total cost'
    }
  ];

  async search() {
    const result = await this.searchService.search({
      query: this.query || 'laptop',
      mode: this.selectedMode,
      category: this.selectedCategory
    });

    this.deals = result.deals ?? this.deals;
  }
}
