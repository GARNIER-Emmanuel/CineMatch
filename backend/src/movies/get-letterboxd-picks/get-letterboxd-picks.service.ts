import { Injectable } from '@nestjs/common';
import Parser from 'rss-parser';

@Injectable()
export class GetLetterboxdPicksService {
  private parser: Parser;

  constructor() {
    this.parser = new Parser();
  }

  async execute() {
    const feed = await this.parser.parseURL('https://letterboxd.com/reglegorilla/rss/');

    return feed.items.map((item) => {
      const { title, rating } = this.parseTitleAndRating(item.title || '');
      return {
        title,
        letterboxdRating: rating,
        watchedDate: item.pubDate ? new Date(item.pubDate).toISOString().split('T')[0] : '',
      };
    });
  }

  private parseTitleAndRating(fullTitle: string): { title: string; rating: number } {
    // Format attendu: "Movie Title, ★★★★½"
    const parts = fullTitle.split(', ');
    const ratingString = parts.pop() || '';
    const title = parts.join(', ');

    return {
      title,
      rating: this.convertStarsToNumber(ratingString),
    };
  }

  private convertStarsToNumber(stars: string): number {
    let rating = 0;
    for (const char of stars) {
      if (char === '★') rating += 1;
      if (char === '½') rating += 0.5;
    }
    return rating;
  }
}
