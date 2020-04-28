import { DoubanCrawler, Movie, PiankuCrawler } from '@iinfinity/movie-crawler';
import { Controller, Inject } from '@rester/core';
import { MovieEntity } from './movie.model';

@Controller()
export class MovieController {

  @Inject() private douban!: DoubanCrawler
  @Inject() private pianku!: PiankuCrawler;

  async getDetail(id: string): Promise<Movie | undefined> {
    const detailInDB = await MovieEntity.findOne({ id });
    // 首先尝试从数据库获取
    if (detailInDB) {
      // console.log('From cache in detail: ' + source);
      return detailInDB;
    }
    // 如果数据库不存在，尝试爬取
    const detailFromDouban = await this.douban.movie(id);
    const detailFromPianku = await this.pianku.movieByID(id);
    // 如果爬到了 片库 的下载资源，合并
    if (detailFromPianku) {
      const detail = Object.assign<any, Movie | undefined, Pick<Movie, 'downloads' | 'links'>>(
        {},
        detailFromDouban,
        { downloads: detailFromPianku.downloads, links: detailFromPianku.links }
      );
      // console.log('detail with pianku');
      MovieEntity.insert(detail);
      return detail;
    }
    // 否则只返回豆瓣的
    // console.log('detail without pianku');
    if (detailFromDouban) { MovieEntity.insert(detailFromDouban); }
    return detailFromDouban;
  }

}
