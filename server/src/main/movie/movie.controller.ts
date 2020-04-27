import { Crawler, Detail, SearchResult } from '@iinfinity/movie-crawler';
import { Controller, HTTP500Exception, Inject } from '@rester/core';
import { MovieEntity } from './movie.model';
import { SearchEntity } from './search.model';

@Controller()
export class MovieController {

  @Inject() crawler!: Crawler;

  async search(keyword: string): Promise<SearchResult[]> {
    const searchInDB = await SearchEntity.findOne({ keyword });
    if (searchInDB) {
      // console.log('From cache in search: ' + decodeURIComponent(keyword));
      return searchInDB.results;
    }
    const results = await this.crawler.search(keyword)
      .catch(e => {
        console.warn('Exception on search ' + decodeURIComponent(keyword));
        throw new HTTP500Exception(e);
      });
    SearchEntity.insert({ keyword, results });
    return results;
  }

  async getDetail(source: string): Promise<Detail | undefined> {
    const detailInDB = await MovieEntity.findOne({ source });
    if (detailInDB) {
      // console.log('From cache in detail: ' + source);
      return detailInDB;
    }
    try {
      const detail = await this.crawler.getDetail(source);
      MovieEntity.insert(detail);
      return detail;
    } catch (error) {
      console.warn('Error while get detail from ' + source);
    }
  }

}
