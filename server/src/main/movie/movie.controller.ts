import { Movie, Result } from '@iinfinity/movie-crawler';
import { Controller, HTTP500Exception, Inject } from '@rester/core';
import { MovieEntity } from './movie.model';
import { SearchEntity } from './summary.model';

@Controller()
export class MovieController {

  @Inject() douban: Douban
  @Inject() pianku!: Crawler;

  async search(keyword: string): Promise<Result[]> {
    const searchInDB = await SearchEntity.findOne({ keyword });
    if (searchInDB) {
      // console.log('From cache in search: ' + decodeURIComponent(keyword));
      return searchInDB.results;
    }
    const results = await this.pianku.search(keyword)
      .catch(e => {
        console.warn('Exception on search ' + decodeURIComponent(keyword));
        throw new HTTP500Exception(e);
      });
    SearchEntity.insert({ keyword, results });
    return results;
  }

  async getDetail(id: string): Promise<Movie | undefined> {
    const detailInDB = await MovieEntity.findOne({ source: id });
    if (detailInDB) {
      // console.log('From cache in detail: ' + source);
      return detailInDB;
    }
    try {
      const detail = await this.pianku.getDetail(id);
      MovieEntity.insert(detail);
      return detail;
    } catch (error) {
      console.warn('Error while get detail from ' + id);
    }
  }

}
