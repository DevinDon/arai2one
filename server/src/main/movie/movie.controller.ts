import { Crawler, Detail, SearchResult } from '@iinfinity/movie-crawler';
import { Controller, Inject } from '@rester/core';
import { MovieEntity } from './movie.model';
import { SearchEntity } from './search.model';

@Controller()
export class MovieController {

  @Inject() crawler!: Crawler;

  async search(keyword: string): Promise<SearchResult[]> {
    const searchInDB = await SearchEntity.findOne({ keyword });
    if (searchInDB) { return searchInDB.results; }
    const results = await this.crawler.search(keyword);
    SearchEntity.insert({ keyword, results });
    return results;
  }

  async getDetail(source: string): Promise<Detail> {
    const detailInDB = await MovieEntity.findOne({ source });
    if (detailInDB) { return detailInDB; }
    const detail = await this.crawler.getDetail(source);
    MovieEntity.insert(detail);
    return detail;
  }

}
