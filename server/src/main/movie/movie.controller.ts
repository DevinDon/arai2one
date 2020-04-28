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
    const detailFromDouban = await this.douban.movie(id);
    const detailFromPianku = await this.pianku.movieByID(id);
    // 如果爬到了 片库 的下载资源，合并
    if (detailFromPianku) {
      const detail = Object.assign<Movie, Pick<Movie, 'downloads' | 'links'>>(
        detailFromDouban, {
        downloads: detailFromPianku.downloads,
        links: detailFromPianku.links
      });
      console.log('detail with pianku: ', detail);
      MovieEntity.insert(detail);
      return detail;
    }
    // 否则只返回豆瓣的
    console.log('detail without pianku: ', detailFromDouban);
    return detailFromDouban;
  }

}
