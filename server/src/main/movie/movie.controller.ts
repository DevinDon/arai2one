import { DoubanCrawler, Movie, PiankuCrawler } from '@iinfinity/movie-crawler';
import { Controller, Inject } from '@rester/core';
import { MovieEntity } from './movie.model';

@Controller()
export class MovieController {

  @Inject() douban!: DoubanCrawler
  @Inject() pianku!: PiankuCrawler;

  async getDetail(id: string): Promise<Movie | undefined> {
    const detailInDB = await MovieEntity.findOne({ id });
    // if detail in db, return it
    if (detailInDB) {
      // console.log('From cache in detail: ' + source);
      return detailInDB;
    }
    // else try to use crawler to get it
    try {
      const detailFromPianku = await this.pianku.movie(id);
      const detailFromDouban = await this.douban.movie(id);
      const detail = Object.assign(detailFromDouban, detailFromPianku);
      console.log('detail: ', detail);
      MovieEntity.insert(detail);
      return detail;
    } catch (error) {
      console.warn('Error while get detail from ' + id);
    }
  }

}
