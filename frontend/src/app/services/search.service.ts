import { Injectable } from '@angular/core';

@Injectable()
export class SearchService {
  async search(payload: { query: string; mode?: string; category?: string; image?: string }) {
    const response = await fetch('http://localhost:3000/search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error('Failed to fetch search results');
    }

    return response.json();
  }
}
